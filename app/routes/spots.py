from flask import Blueprint, jsonify, session, request
from ..models import Spots, db, Bookings

# This fetch will only work well in small scale apps If i were to do this in a larger
# app I would break this apart into smaller fetches to prevent the initial load from taking to long
# with a small amount of data like I am currently using this still is a fast loading fetch.

spots = Blueprint('spots', __name__, url_prefix='/api/spots')
@spots.route('/')
def get_spots():
    spots = Spots.query.all()
    data = [i.toDict() for i in spots]

    for i in range(len(spots)):
        reviewsDict = {i.id: i.toDict() for i in spots[i].reviews}
        data[i]['reviews'] = reviewsDict

    booking_data = [i.toDict() for i in spots]
    for i in range(len(spots)):
        bookingsDict = {i.id: i.toDict() for i in spots[i].bookings}
        data[i]['bookings'] = bookingsDict

    return {'spots' : data, 'bookings':booking_data}
