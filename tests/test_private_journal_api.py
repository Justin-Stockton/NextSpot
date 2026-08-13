import os
import unittest

os.environ.setdefault('DATABASE_URL', 'sqlite:///:memory:')
os.environ.setdefault('SECRET_KEY', 'test')

from app import app
from app.models import db, Users, Spots


class PrivateJournalApiTest(unittest.TestCase):
    def setUp(self):
        app.config.update(TESTING=True, WTF_CSRF_ENABLED=False, SQLALCHEMY_ECHO=False)
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

    def login(self, user_id):
        with self.client.session_transaction() as session:
            session['_user_id'] = str(user_id)
            session['_fresh'] = True

    def test_auth_and_user_json_never_expose_password_hash(self):
        self.assertEqual(self.client.get('/api/spots/').status_code, 401)
        self.login(self.a)
        response = self.client.get('/api/auth/')
        self.assertEqual(response.status_code, 200)
        self.assertNotIn('hashedPassword', response.get_json())

    def test_place_crud_is_owned_and_ignores_body_user(self):
        self.login(self.a)
        created = self.client.post('/api/spots/create', json={
            'userId': self.b, 'name': 'Lisbon', 'location': 'Portugal'
        })
        self.assertEqual(created.status_code, 201)
        place = created.get_json()
        self.assertEqual(place['userId'], self.a)
        self.assertEqual(self.client.get(f'/api/spots/{self.foreign_place}').status_code, 404)
        self.assertEqual(self.client.put(f"/api/spots/{place['id']}", json={
            'name': 'Lisboa', 'location': 'Portugal'
        }).status_code, 200)
        self.assertEqual(self.client.delete(f"/api/spots/{place['id']}").status_code, 200)

    def test_owned_children_and_collection_membership(self):
        self.login(self.a)
        place = self.client.post('/api/spots/create', json={'name': 'Rome', 'location': 'Italy'}).get_json()
        stay = self.client.post('/api/bookings/create', json={
            'spotId': place['id'], 'startDate': '2020-01-01', 'endDate': '2020-01-02'
        })
        self.assertEqual(stay.status_code, 201)
        self.assertEqual(self.client.post('/api/bookings/create', json={
            'spotId': place['id'], 'startDate': '2020-01-02', 'endDate': '2020-01-01'
        }).status_code, 400)
        memory = self.client.post('/api/reviews/create', json={
            'spotId': place['id'], 'review': 'Wonderful', 'rating': 5
        })
        self.assertEqual(memory.status_code, 201)
        collection = self.client.post('/api/wishlists/create', json={'name': 'Favorites'}).get_json()
        member = self.client.post('/api/wishspots/create', json={
            'spotId': place['id'], 'wishlistId': collection['id']
        })
        self.assertEqual(member.status_code, 201)
        self.assertEqual(self.client.post('/api/wishspots/create', json={
            'spotId': self.foreign_place, 'wishlistId': collection['id']
        }).status_code, 404)

        stay_id = stay.get_json()['id']
        self.assertEqual(self.client.put('/api/bookings/update', json={
            'id': stay_id, 'startDate': '2020-02-01', 'endDate': '2020-02-03'
        }).status_code, 200)
        self.assertEqual(self.client.delete('/api/bookings/delete', json={'id': stay_id}).status_code, 200)

        memory_id = memory.get_json()['id']
        self.assertEqual(self.client.put('/api/reviews/update', json={
            'id': memory_id, 'review': 'Unforgettable', 'rating': 4
        }).status_code, 200)
        self.assertEqual(self.client.delete('/api/reviews/delete', json={'id': memory_id}).status_code, 200)

        self.assertEqual(self.client.put('/api/wishlists/update', json={
            'id': collection['id'], 'name': 'Italy'
        }).status_code, 200)
        self.assertEqual(self.client.delete('/api/wishspots/delete', json={
            'spotId': place['id'], 'wishlistId': collection['id']
        }).status_code, 200)
        self.assertEqual(self.client.delete('/api/wishlists/delete', json={
            'id': collection['id']
        }).status_code, 200)

    def test_cannot_mutate_another_users_children(self):
        self.login(self.b)
        stay = self.client.post('/api/bookings/create', json={
            'spotId': self.foreign_place, 'startDate': '2020-01-01', 'endDate': '2020-01-02'
        }).get_json()
        memory = self.client.post('/api/reviews/create', json={
            'spotId': self.foreign_place, 'review': 'Private memory', 'rating': 5
        }).get_json()
        collection = self.client.post('/api/wishlists/create', json={'name': 'Private collection'}).get_json()

        self.client.get('/api/auth/logout')
        self.login(self.a)
        self.assertEqual(self.client.put('/api/bookings/update', json={
            'id': stay['id'], 'startDate': '2021-01-01', 'endDate': '2021-01-02'
        }).status_code, 404)
        self.assertEqual(self.client.delete('/api/reviews/delete', json={'id': memory['id']}).status_code, 404)
        self.assertEqual(self.client.delete('/api/wishlists/delete', json={'id': collection['id']}).status_code, 404)


if __name__ == '__main__':
    unittest.main()
