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


if __name__ == '__main__':
    unittest.main()
