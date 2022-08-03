from app.models import db, Spots

def seed_spots():
    first = Spots(
        userId = 1, name='CoolSpot', price='300',streetAdress='222 twenty two drive', city='Blacksburg', state='Virginia', zip='11111'
    )

    db.session.add(first)
    db.session.commit()

def undo_spots():
    db.session.execute('TRUNCATE spots RESTART IDENTITY CASCADE;')
    db.session.commit()
