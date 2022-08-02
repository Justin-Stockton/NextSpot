from flask import Blueprint, jsonify, session, request
from ..models import Bookings, db
from ..forms import BookingsForm

bookings_route = Blueprint('auth', __name__, url_prefix='/api/bookings')

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@bookings_route.route('/spot')
def get_spot_bookings():
    pass


@bookings_route.route('/user')
def get_user_bookings():
    pass


@bookings_route.route('/create', methods=['POST'])
def create_bookings():
    form = BookingsForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_booking = Bookings(
            userId=form.data['userId'],
            spotId=form.data['spotId'],
            startDate=form.data['startDate'],
            endDate=form.data['endDate'],
        )
        db.session.add(new_booking)
        db.session.commit()
        return new_booking.toDict()
    return 400


@bookings_route.route('/update', methods=['PUT'])
def update_booking():

    data = request.json
    booking = Bookings.query.get(data['id'])
    booking.startDate=data['startDate']
    booking.endDate=data['endDate']
    db.session.commit()
    return booking.toDict()


@bookings_route.route('/delete', methods=['DELETE'])
def delete_booking():
    data = request.json
    Bookings.query.filter_by(id=data).delete()
    db.session.commit()
    return 'Workspace successfully deleted!'
