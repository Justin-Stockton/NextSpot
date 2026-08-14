from datetime import date, timedelta

from app.models import Bookings, Reviews, Spots, Wishlists, Wishspots, db


PLACES = (
    {
        'name': 'Kyoto in Spring', 'location': 'Kyoto, Japan', 'city': 'Kyoto',
        'state': 'Kyoto', 'img1': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    },
    {
        'name': 'Lisbon Weekend', 'location': 'Lisbon, Portugal', 'city': 'Lisbon',
        'state': 'Lisbon', 'img1': 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=80',
    },
    {
        'name': 'Banff Adventure', 'location': 'Alberta, Canada', 'city': 'Banff',
        'state': 'Alberta', 'img1': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    },
)


def seed_demo_journal(user):
    """Give an empty Demo account a small, complete travel journal."""
    if user.spots:
        return

    places = [Spots(
        userId=user.id, price=0, streetAdress='', zip=0, **place
    ) for place in PLACES]
    db.session.add_all(places)
    db.session.flush()

    today = date.today()
    db.session.add_all((
        Bookings(userId=user.id, spotId=places[0].id, spotName=places[0].name,
                 startDate=today - timedelta(days=400), endDate=today - timedelta(days=394)),
        Bookings(userId=user.id, spotId=places[1].id, spotName=places[1].name,
                 startDate=today - timedelta(days=90), endDate=today - timedelta(days=86)),
        Bookings(userId=user.id, spotId=places[2].id, spotName=places[2].name,
                 startDate=today + timedelta(days=90), endDate=today + timedelta(days=96)),
        Reviews(userId=user.id, spotId=places[0].id, username=user.username, rating=5,
                review='Cherry blossoms, quiet temples, and the best early-morning walks.'),
        Reviews(userId=user.id, spotId=places[1].id, username=user.username, rating=4,
                review='Loved the tiled streets, viewpoints, and pastéis de nata.'),
    ))
    favorites = Wishlists(userId=user.id, name='Favorite trips')
    db.session.add(favorites)
    db.session.flush()
    db.session.add_all((
        Wishspots(spotId=places[0].id, wishlistId=favorites.id),
        Wishspots(spotId=places[1].id, wishlistId=favorites.id),
    ))
    db.session.commit()
