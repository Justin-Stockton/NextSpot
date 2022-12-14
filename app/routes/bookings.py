from flask import Blueprint, jsonify, session, request
from ..models import Bookings, db
from ..forms import BookingsForm

bookings = Blueprint('bookings', __name__, url_prefix='/api/bookings')

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@bookings.route('/spot/<spotId>')
def get_spot_bookings(spotId):
    spotBookings = Bookings.query.filter_by(spotId=spotId).all()
    data = [i.toDict() for i in spotBookings]

    for i in range(len(spotBookings)):
        bookingsDict = {i.id: i.toDict() for i in spotBookings[i].boards}
        data[i]['boards'] = bookingsDict

        return {'bookings': data}


@bookings.route('/user/<userId>')
def get_user_bookings(userId):

    userBookings = Bookings.query.filter_by(userId=userId).all()
    data = [i.toDict() for i in userBookings]

    return {'bookings': data}


@bookings.route('/create', methods=['POST'])
def create_bookings():
    data=request.json
    form = BookingsForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    new_booking = Bookings(
        userId=data['userId'],
        spotId=data['spotId'],
        spotName=data['spotName'],
        startDate=data['startDate'],
        endDate=data['endDate'],
    )
    db.session.add(new_booking)
    db.session.commit()
    return new_booking.toDict()



@bookings.route('/update', methods=['PUT'])
def update_booking():

    data = request.json
    booking = Bookings.query.get(data['id'])
    booking.startDate=data['startDate']
    booking.endDate=data['endDate']
    db.session.commit()
    return booking.toDict()


@bookings.route('/delete', methods=['DELETE'])
def delete_booking():
    data = request.json
    Bookings.query.filter_by(id=data).delete()
    db.session.commit()
    return 'Booking successfully deleted!'
