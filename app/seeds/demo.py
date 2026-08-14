from datetime import date, timedelta

from app.models import Bookings, Reviews, Spots, Wishlists, Wishspots, db


def images(*ids):
    return {f'img{index}': f'https://images.unsplash.com/{image}?auto=format&fit=crop&w=1200&q=80'
            for index, image in enumerate(ids, 1)}


PLACES = (
    {
        'name': 'Kyoto in Spring', 'location': 'Kyoto, Japan', 'city': 'Kyoto', 'state': 'Kyoto',
        **images('photo-1493976040374-85c8e12f0c0e', 'photo-1528360983277-13d401cdc186',
                 'photo-1542051841857-5f90071e7989', 'photo-1490806843957-31f4c9a91c65',
                 'photo-1545569341-9eb8b30979d9', 'photo-1478436127897-769e1b3f0f36'),
    },
    {
        'name': 'Lisbon Weekend', 'location': 'Lisbon, Portugal', 'city': 'Lisbon', 'state': 'Lisbon',
        **images('photo-1555881400-74d7acaacd8b', 'photo-1548707309-dcebeab9ea9b',
                 'photo-1536663815808-535e2280d2c2', 'photo-1513735492246-483525079686',
                 'photo-1585208798174-6cedd86e019a', 'photo-1520440229-6469a149ac59'),
    },
    {
        'name': 'Banff Adventure', 'location': 'Alberta, Canada', 'city': 'Banff', 'state': 'Alberta',
        **images('photo-1501785888041-af3ef285b470', 'photo-1443632864897-14973fa006cf',
                 'photo-1486911278844-a81c5267e227', 'photo-1526392060635-9d6019884377',
                 'photo-1531089073319-17596b946d42', 'photo-1464822759023-fed622ff2c3b'),
    },
    {
        'name': 'New Zealand Dream', 'location': 'South Island, New Zealand',
        'city': 'Queenstown', 'state': 'Otago',
        **images('photo-1469521669194-babb45599def', 'photo-1500530855697-b586d89ba3ee',
                 'photo-1464278533981-50106e6176b1', 'photo-1449157291145-7efd050a4d0e',
                 'photo-1531804055935-76f44d7c3621', 'photo-1507699622108-4be3abd695ad'),
    },
)


def reset_demo_journal(user):
    """Remove visitor changes and restore the shared Demo journal."""
    for collection in list(user.wishlists):
        db.session.delete(collection)
    for place in list(user.spots):
        db.session.delete(place)
    db.session.commit()
    seed_demo_journal(user)


def seed_demo_journal(user):
    """Idempotently restore the shared Demo journal."""
    samples = {place.name: place for place in user.spots}
    for data in PLACES:
        place = samples.get(data['name'])
        if not place:
            place = Spots(userId=user.id, price=0, streetAdress='', zip=0, **data)
            samples[data['name']] = place
            db.session.add(place)
        else:
            for field in (f'img{number}' for number in range(1, 7)):
                setattr(place, field, data[field])
    db.session.flush()

    today = date.today()
    stay_dates = (
        (today - timedelta(days=400), today - timedelta(days=394)),
        (today - timedelta(days=90), today - timedelta(days=86)),
        (today + timedelta(days=90), today + timedelta(days=96)),
    )
    for place, (start, end) in zip((samples[data['name']] for data in PLACES[:3]), stay_dates):
        if not Bookings.query.filter_by(userId=user.id, spotId=place.id).first():
            db.session.add(Bookings(userId=user.id, spotId=place.id, spotName=place.name,
                                    startDate=start, endDate=end))

    memory_data = (
        ('Kyoto in Spring', 5, 'Cherry blossoms, quiet temples, and the best early-morning walks.'),
        ('Lisbon Weekend', 4, 'Loved the tiled streets, viewpoints, and pastéis de nata.'),
    )
    for name, rating, note in memory_data:
        place = samples[name]
        if not Reviews.query.filter_by(userId=user.id, spotId=place.id).first():
            db.session.add(Reviews(userId=user.id, spotId=place.id, username=user.username,
                                   rating=rating, review=note))

    collections = {}
    for name in ('Favorite trips', 'Dream destinations'):
        collections[name] = Wishlists.query.filter_by(userId=user.id, name=name).first()
        if not collections[name]:
            collections[name] = Wishlists(userId=user.id, name=name)
            db.session.add(collections[name])
    db.session.flush()
    memberships = (
        (samples['Kyoto in Spring'], collections['Favorite trips']),
        (samples['Lisbon Weekend'], collections['Favorite trips']),
        (samples['New Zealand Dream'], collections['Dream destinations']),
    )
    for place, collection in memberships:
        if not Wishspots.query.filter_by(spotId=place.id, wishlistId=collection.id).first():
            db.session.add(Wishspots(spotId=place.id, wishlistId=collection.id))
    db.session.commit()
