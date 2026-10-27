import os
from datetime import date

os.environ.setdefault("DATABASE_URL", "sqlite://")
os.environ.setdefault("SECRET_KEY", "test-secret")

import pytest

from app import app
from app.models import Bookings, Reviews, Spots, Users, Wishlists, Wishspots, db


@pytest.fixture()
def client():
    app.config.update(
        TESTING=True,
        SQLALCHEMY_DATABASE_URI="sqlite://",
        WTF_CSRF_ENABLED=True,
        SESSION_COOKIE_SECURE=False,
    )
    with app.app_context():
        db.drop_all()
        db.create_all()
        owner = Users(username="owner", email="owner@example.com", password="password")
        other = Users(username="other", email="other@example.com", password="password")
        db.session.add_all([owner, other])
        db.session.commit()
        spot = Spots(
            userId=owner.id,
            name="Demo spot",
            price=100,
            streetAdress="1 Main St",
            city="Town",
            state="CA",
            zip=12345,
        )
        db.session.add(spot)
        db.session.commit()
        booking = Bookings(
            userId=owner.id,
            spotId=spot.id,
            spotName=spot.name,
            startDate=date(2030, 1, 1),
            endDate=date(2030, 1, 2),
        )
        review = Reviews(
            userId=owner.id,
            spotId=spot.id,
            review="Nice",
            rating=4,
            username=owner.username,
        )
        wishlist = Wishlists(userId=owner.id, name="Trips")
        db.session.add_all([booking, review, wishlist])
        db.session.commit()
        db.session.add(Wishspots(spotId=spot.id, wishlistId=wishlist.id))
        db.session.commit()

    yield app.test_client()

    with app.app_context():
        db.session.remove()
        db.drop_all()


def csrf_headers(client):
    client.get("/api/auth/")
    return {"X-CSRFToken": client.get_cookie("csrf_token").value}


def login(client, email):
    return client.post(
        "/api/auth/login",
        json={"email": email, "password": "password"},
        headers=csrf_headers(client),
    )


def test_auth_responses_never_expose_password_hash(client):
    response = login(client, "owner@example.com")
    assert response.status_code == 200
    assert "hashedPassword" not in response.get_json()
    assert "hashedPassword" not in client.get("/api/auth/").get_json()
    users = client.get("/api/users/").get_json()["users"]
    assert all("hashedPassword" not in user for user in users)


def test_mutations_require_login_and_csrf(client):
    booking = {
        "userId": 2,
        "spotId": 1,
        "spotName": "Demo spot",
        "startDate": "2030-02-01",
        "endDate": "2030-02-02",
    }
    assert client.post("/api/bookings/create", json=booking).status_code == 400

    headers = csrf_headers(client)
    attempts = [
        ("post", "/api/bookings/create", booking),
        ("put", "/api/bookings/update", {"id": 1}),
        ("delete", "/api/bookings/delete", 1),
        ("post", "/api/reviews/create", {"spotId": 1}),
        ("put", "/api/reviews/update", {"id": 1}),
        ("delete", "/api/reviews/delete", {"reviewId": 1}),
        ("post", "/api/wishlists/create", {"name": "Trips"}),
        ("put", "/api/wishlists/update", {"id": 1}),
        ("delete", "/api/wishlists/delete", 1),
        ("post", "/api/wishspots/create", {"spotId": 1, "wishlistId": 1}),
        ("put", "/api/wishspots/update", {"id": 1, "wishlistId": 1}),
        ("delete", "/api/wishspots/delete", {"spotId": 1, "wishlistId": 1}),
    ]
    for method, url, payload in attempts:
        assert getattr(client, method)(url, json=payload, headers=headers).status_code == 401


def test_creates_use_current_user_not_body_identity(client):
    assert login(client, "owner@example.com").status_code == 200
    response = client.post(
        "/api/bookings/create",
        json={
            "userId": 2,
            "spotId": 1,
            "spotName": "Demo spot",
            "startDate": "2030-02-01",
            "endDate": "2030-02-02",
        },
        headers=csrf_headers(client),
    )
    assert response.status_code == 200
    assert response.get_json()["userId"] == 1


def test_other_user_cannot_change_owned_resources(client):
    assert login(client, "other@example.com").status_code == 200
    headers = csrf_headers(client)
    attempts = [
        ("put", "/api/bookings/update", {"id": 1, "startDate": "2031-01-01", "endDate": "2031-01-02"}),
        ("delete", "/api/bookings/delete", 1),
        ("put", "/api/reviews/update", {"id": 1, "review": "Changed", "rating": 1}),
        ("delete", "/api/reviews/delete", {"reviewId": 1}),
        ("put", "/api/wishlists/update", {"id": 1, "name": "Changed"}),
        ("delete", "/api/wishlists/delete", 1),
        ("post", "/api/wishspots/create", {"spotId": 1, "wishlistId": 1}),
        ("put", "/api/wishspots/update", {"id": 1, "wishlistId": 1}),
        ("delete", "/api/wishspots/delete", {"spotId": 1, "wishlistId": 1}),
    ]
    for method, url, payload in attempts:
        response = getattr(client, method)(url, json=payload, headers=headers)
        assert response.status_code == 403, (method, url, response.get_data(as_text=True))


def test_logout_is_post_only(client):
    assert login(client, "owner@example.com").status_code == 200
    assert client.get("/api/auth/logout").status_code != 200
    assert client.get("/api/auth/").status_code == 200
    assert client.post("/api/auth/logout", headers=csrf_headers(client)).status_code == 200


def test_health_endpoint(client):
    assert client.get("/api/health").get_json() == {"status": "ok"}
