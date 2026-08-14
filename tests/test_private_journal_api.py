import os
import unittest
from datetime import date
from http.cookies import SimpleCookie

os.environ.setdefault('DATABASE_URL', 'sqlite:///:memory:')
os.environ.setdefault('SECRET_KEY', 'test')

from app import app
from app.models import db, Users, Spots, Bookings, Reviews, Wishlists, Wishspots


class PrivateJournalApiTest(unittest.TestCase):
    def setUp(self):
        app.config.update(TESTING=True, WTF_CSRF_ENABLED=True, SQLALCHEMY_ECHO=False)
        self.client = app.test_client()
        with app.app_context():
            db.drop_all()
            db.create_all()
            a = Users(username='alice', email='a@example.com', password='password')
            b = Users(username='bob', email='b@example.com', password='password')
            db.session.add_all((a, b))
            db.session.commit()
            self.a, self.b = a.id, b.id
            db.session.add(Spots(userId=b.id, name='Private', location='Elsewhere', price=0,
                                 streetAdress='', city='', state='', zip=0))
            db.session.commit()
            self.foreign_place = Spots.query.filter_by(userId=b.id).first().id
        self.login(self.a)

    def login(self, user_id):
        with self.client.session_transaction() as session:
            session['_user_id'] = str(user_id)
            session['_fresh'] = True
        response = self.client.get('/api/auth/')
        cookie = SimpleCookie()
        cookie.load(response.headers.get('Set-Cookie'))
        self.csrf = cookie['csrf_token'].value

    def write(self, method, path, json=None, token=None):
        return self.client.open(path, method=method, json=json,
                                headers={'X-CSRFToken': self.csrf if token is None else token})

    def make_place(self, name='Rome'):
        return self.write('POST', '/api/spots/create', {'name': name, 'location': 'Italy'}).get_json()

    def test_auth_and_csrf_protection(self):
        anonymous = app.test_client()
        login_body = {'email': 'a@example.com', 'password': 'password'}
        self.assertEqual(anonymous.get('/api/spots/').status_code, 401)
        token_response = anonymous.get('/api/auth/')
        token_cookie = SimpleCookie()
        token_cookie.load(token_response.headers.get('Set-Cookie'))
        token = token_cookie['csrf_token'].value
        self.assertEqual(anonymous.post('/api/auth/login', json=login_body).status_code, 400)
        self.assertEqual(anonymous.post('/api/auth/login', json=login_body,
                         headers={'X-CSRFToken': 'invalid'}).status_code, 400)
        self.assertEqual(anonymous.post('/api/auth/login', json=login_body,
                         headers={'X-CSRFToken': token}).status_code, 200)

        demo = app.test_client()
        demo_response = demo.get('/api/auth/')
        demo_cookie = SimpleCookie()
        demo_cookie.load(demo_response.headers.get('Set-Cookie'))
        demo_token = demo_cookie['csrf_token'].value
        with app.app_context():
            db.session.add(Users(username='Demo', email='demo@aa.io', password='not-the-ui-password'))
            db.session.commit()
        response = demo.post('/api/auth/demo', headers={'X-CSRFToken': demo_token})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()['email'], 'demo@aa.io')
        places = demo.get('/api/spots/').get_json()['spots']
        self.assertGreaterEqual(len(places), 4)
        self.assertTrue(any(place['bookings'] for place in places))
        self.assertTrue(any(not place['bookings'] for place in places))
        self.assertTrue(any(place['reviews'] for place in places))
        self.assertTrue(all(place[f'img{number}'] for place in places for number in range(1, 7)))
        self.assertGreaterEqual(len(demo.get('/api/wishlists/').get_json()['wishlists']), 2)
        demo.post('/api/auth/demo', headers={'X-CSRFToken': demo_token})
        self.assertEqual(len(demo.get('/api/spots/').get_json()['spots']), len(places))

        signup = app.test_client()
        signup_body = {'username': 'carol', 'email': 'c@example.com', 'password': 'password'}
        signup_response = signup.get('/api/auth/')
        signup_cookie = SimpleCookie()
        signup_cookie.load(signup_response.headers.get('Set-Cookie'))
        signup_token = signup_cookie['csrf_token'].value
        self.assertEqual(signup.post('/api/auth/signup', json=signup_body).status_code, 400)
        self.assertEqual(signup.post('/api/auth/signup', json=signup_body,
                         headers={'X-CSRFToken': 'invalid'}).status_code, 400)
        self.assertEqual(signup.post('/api/auth/signup', json=signup_body,
                         headers={'X-CSRFToken': signup_token}).status_code, 200)
        response = self.client.get('/api/auth/')
        self.assertNotIn('hashedPassword', response.get_json())
        body = {'name': 'Lisbon', 'location': 'Portugal'}
        self.assertEqual(self.client.post('/api/spots/create', json=body).status_code, 400)
        self.assertEqual(self.client.post('/api/spots/create', json=body,
                         headers={'X-CSRFToken': 'invalid'}).status_code, 400)
        self.assertEqual(self.write('POST', '/api/spots/create', body).status_code, 201)

    def test_demo_upgrade_restores_complete_journal_without_duplicates(self):
        demo = app.test_client()
        token_response = demo.get('/api/auth/')
        cookie = SimpleCookie()
        cookie.load(token_response.headers.get('Set-Cookie'))
        token = cookie['csrf_token'].value
        with app.app_context():
            user = Users(username='Demo', email='demo@aa.io', password='password')
            db.session.add(user)
            db.session.flush()
            db.session.add(Spots(userId=user.id, name='Kyoto in Spring', location='Kyoto, Japan',
                                 price=0, streetAdress='', city='Kyoto', state='Kyoto', zip=0))
            db.session.commit()

        for _ in range(2):
            self.assertEqual(demo.post('/api/auth/demo', headers={'X-CSRFToken': token}).status_code, 200)

        places = demo.get('/api/spots/').get_json()['spots']
        collections = demo.get('/api/wishlists/').get_json()['wishlists']
        self.assertEqual(len({place['name'] for place in places}), 4)
        self.assertEqual(sum(len(place['bookings']) for place in places), 3)
        self.assertEqual(sum(len(place['reviews']) for place in places), 2)
        self.assertTrue(all(place[f'img{number}'] for place in places for number in range(1, 7)))
        self.assertEqual(sorted(item['name'] for item in collections),
                         ['Dream destinations', 'Favorite trips'])
        self.assertEqual(sum(len(item['wishspots']) for item in collections), 3)

    def test_place_crud_persists_and_cross_user_mutations_do_not_change_state(self):
        place = self.make_place('Lisbon')
        self.assertEqual(place['userId'], self.a)
        updated = self.write('PUT', f"/api/spots/{place['id']}",
                             {'name': 'Lisboa', 'location': 'Portugal'})
        self.assertEqual(updated.status_code, 200)
        self.assertEqual(self.client.get(f"/api/spots/{place['id']}").get_json()['name'], 'Lisboa')

        before = self.client.get(f'/api/spots/{self.foreign_place}').status_code
        self.assertEqual(before, 404)
        self.assertEqual(self.write('PUT', f'/api/spots/{self.foreign_place}',
                         {'name': 'Stolen', 'location': 'Here'}).status_code, 404)
        self.assertEqual(self.write('DELETE', f'/api/spots/{self.foreign_place}', {}).status_code, 404)
        with app.app_context():
            self.assertEqual(Spots.query.get(self.foreign_place).name, 'Private')

        self.assertEqual(self.write('DELETE', f"/api/spots/{place['id']}", {}).status_code, 200)
        self.assertEqual(self.client.get(f"/api/spots/{place['id']}").status_code, 404)

    def test_mixed_owner_children_are_hidden_and_block_place_deletion(self):
        place = self.make_place()
        with app.app_context():
            db.session.add_all((
                Bookings(userId=self.b, spotId=place['id'], spotName='Legacy',
                         startDate=date(2020, 1, 1), endDate=date(2020, 1, 2)),
                Reviews(userId=self.b, spotId=place['id'], review='Legacy private memory',
                        rating=5, username='bob'),
            ))
            db.session.commit()
            booking_id = Bookings.query.filter_by(userId=self.b, spotId=place['id']).first().id
            review_id = Reviews.query.filter_by(userId=self.b, spotId=place['id']).first().id
        serialized = self.client.get(f"/api/spots/{place['id']}").get_json()
        self.assertEqual(serialized['bookings'], {})
        self.assertEqual(serialized['reviews'], {})
        response = self.write('DELETE', f"/api/spots/{place['id']}", {})
        self.assertEqual(response.status_code, 409)
        self.assertIn('migrate', response.get_json()['errors'][0])
        with app.app_context():
            self.assertIsNotNone(Spots.query.get(place['id']))
            self.assertIsNotNone(Bookings.query.get(booking_id))
            self.assertIsNotNone(Reviews.query.get(review_id))

    def test_stay_crud_truncates_snapshot_and_rejects_all_cross_user_mutations(self):
        place = self.make_place('x' * 80)
        stay = self.write('POST', '/api/bookings/create', {
            'spotId': place['id'], 'startDate': '2020-01-01', 'endDate': '2020-01-02'}).get_json()
        self.assertEqual(stay['spotName'], 'x' * 50)
        self.assertEqual((stay['startDate'], stay['endDate']), ('2020-01-01', '2020-01-02'))
        updated = self.write('PUT', '/api/bookings/update', {
            'id': stay['id'], 'startDate': stay['startDate'], 'endDate': stay['endDate']})
        self.assertEqual((updated.get_json()['startDate'], updated.get_json()['endDate']),
                         ('2020-01-01', '2020-01-02'))

        self.login(self.b)
        self.assertEqual(self.write('PUT', '/api/bookings/update', {
            'id': stay['id'], 'startDate': '2030-01-01', 'endDate': '2030-01-02'}).status_code, 404)
        self.assertEqual(self.write('DELETE', '/api/bookings/delete', {'id': stay['id']}).status_code, 404)
        self.login(self.a)
        persisted = self.client.get('/api/bookings/user').get_json()['bookings'][0]
        self.assertEqual((persisted['startDate'], persisted['endDate']), ('2020-01-01', '2020-01-02'))
        self.assertEqual(self.write('DELETE', '/api/bookings/delete', {'id': stay['id']}).status_code, 200)
        self.assertEqual(self.client.get('/api/bookings/user').get_json()['bookings'], [])

    def test_memory_crud_persists_and_rejects_all_cross_user_mutations(self):
        place = self.make_place()
        memory = self.write('POST', '/api/reviews/create', {
            'spotId': place['id'], 'review': 'Wonderful', 'rating': 5}).get_json()
        updated = self.write('PUT', '/api/reviews/update', {
            'id': memory['id'], 'review': 'Unforgettable', 'rating': 4})
        self.assertEqual(updated.get_json()['review'], 'Unforgettable')
        self.login(self.b)
        self.assertEqual(self.write('PUT', '/api/reviews/update', {
            'id': memory['id'], 'review': 'Changed', 'rating': 1}).status_code, 404)
        self.assertEqual(self.write('DELETE', '/api/reviews/delete', {'id': memory['id']}).status_code, 404)
        self.login(self.a)
        persisted = self.client.get(f"/api/reviews/{place['id']}").get_json()['reviews'][0]
        self.assertEqual((persisted['review'], persisted['rating']), ('Unforgettable', 4))
        self.assertEqual(self.write('DELETE', '/api/reviews/delete', {'id': memory['id']}).status_code, 200)
        self.assertEqual(self.client.get(f"/api/reviews/{place['id']}").get_json()['reviews'], [])

    def test_membership_update_rejects_duplicate_destination_pair(self):
        first, second = self.make_place(), self.make_place('Milan')
        collection = self.write('POST', '/api/wishlists/create', {'name': 'Favorites'}).get_json()
        source = self.write('POST', '/api/wishspots/create', {
            'spotId': first['id'], 'wishlistId': collection['id']}).get_json()
        destination = self.write('POST', '/api/wishspots/create', {
            'spotId': second['id'], 'wishlistId': collection['id']}).get_json()

        response = self.write('PUT', '/api/wishspots/update', {
            'id': source['id'], 'spotId': second['id'], 'wishlistId': collection['id']})

        self.assertEqual(response.status_code, 409)
        self.assertEqual(response.get_json()['errors'], ['Place is already in Collection'])
        with app.app_context():
            pairs = {(item.spotId, item.wishlistId) for item in Wishspots.query.all()}
            self.assertEqual(pairs, {
                (first['id'], collection['id']), (second['id'], collection['id'])})
            self.assertIsNotNone(Wishspots.query.get(destination['id']))

    def test_collection_and_membership_crud_persist_and_reject_cross_user_mutations(self):
        place, second = self.make_place(), self.make_place('Milan')
        collection = self.write('POST', '/api/wishlists/create', {'name': 'Favorites'}).get_json()
        other = self.write('POST', '/api/wishlists/create', {'name': 'Other'}).get_json()
        member = self.write('POST', '/api/wishspots/create', {
            'spotId': place['id'], 'wishlistId': collection['id']}).get_json()
        moved = self.write('PUT', '/api/wishspots/update', {
            'id': member['id'], 'spotId': second['id'], 'wishlistId': other['id']})
        self.assertEqual((moved.get_json()['spotId'], moved.get_json()['wishlistId']),
                         (second['id'], other['id']))
        renamed = self.write('PUT', '/api/wishlists/update', {'id': other['id'], 'name': 'Italy'})
        self.assertEqual(renamed.get_json()['name'], 'Italy')

        self.login(self.b)
        for method, path, body in (
            ('PUT', '/api/wishlists/update', {'id': other['id'], 'name': 'Stolen'}),
            ('DELETE', '/api/wishlists/delete', {'id': other['id']}),
            ('PUT', '/api/wishspots/update', {'id': member['id'], 'spotId': self.foreign_place, 'wishlistId': other['id']}),
            ('DELETE', '/api/wishspots/delete', {'spotId': second['id'], 'wishlistId': other['id']}),
        ):
            self.assertEqual(self.write(method, path, body).status_code, 404)
        self.login(self.a)
        collections = {item['id']: item for item in self.client.get('/api/wishlists/').get_json()['wishlists']}
        self.assertEqual(collections[other['id']]['name'], 'Italy')
        self.assertEqual(next(iter(collections[other['id']]['wishspots'].values()))['spotId'], second['id'])
        self.assertEqual(self.write('DELETE', '/api/wishspots/delete', {
            'spotId': second['id'], 'wishlistId': other['id']}).status_code, 200)
        self.assertEqual(self.client.get(f"/api/wishspots/{other['id']}").get_json()['wishspots'], [])
        self.assertEqual(self.write('DELETE', '/api/wishlists/delete', {'id': other['id']}).status_code, 200)
        ids = [item['id'] for item in self.client.get('/api/wishlists/').get_json()['wishlists']]
        self.assertNotIn(other['id'], ids)


if __name__ == '__main__':
    unittest.main()
