from datetime import date
from flask import Blueprint, request
from flask_login import current_user, login_required
from ..models import Bookings, Spots, db

bookings = Blueprint('bookings', __name__, url_prefix='/api/bookings')


def owned_booking(booking_id):
    return Bookings.query.filter_by(id=booking_id, userId=current_user.id).first()


def dates(data):
    try:
        start = date.fromisoformat(data['startDate'])
        end = date.fromisoformat(data['endDate'])
    except (KeyError, TypeError, ValueError):
        return None
    return (start, end) if end >= start else None


@bookings.route('/spot/<int:spot_id>')
@login_required
def get_spot_bookings(spot_id):
    if not Spots.query.filter_by(id=spot_id, userId=current_user.id).first():
        return {'errors': ['Place not found']}, 404
    return {'bookings': [item.toDict() for item in Bookings.query.filter_by(spotId=spot_id, userId=current_user.id).all()]}


@bookings.route('/user/<int:user_id>')
@bookings.route('/user')
@login_required
def get_user_bookings(user_id=None):
    return {'bookings': [item.toDict() for item in Bookings.query.filter_by(userId=current_user.id).all()]}


@bookings.route('/create', methods=['POST'])
@login_required
def create_booking():
    data = request.get_json(silent=True) or {}
    spot = Spots.query.filter_by(id=data.get('spotId'), userId=current_user.id).first()
    parsed = dates(data)
    if not spot:
        return {'errors': ['Place not found']}, 404
    if not parsed:
        return {'errors': ['Valid arrival and departure dates are required; departure cannot precede arrival']}, 400
    booking = Bookings(userId=current_user.id, spotId=spot.id, spotName=spot.name,
                       startDate=parsed[0], endDate=parsed[1])
    db.session.add(booking)
    db.session.commit()
    return booking.toDict(), 201


@bookings.route('/update', methods=['PUT'])
@login_required
def update_booking():
    data = request.get_json(silent=True) or {}
    booking = owned_booking(data.get('id'))
    parsed = dates(data)
    if not booking:
        return {'errors': ['Stay not found']}, 404
    if not parsed:
        return {'errors': ['Valid arrival and departure dates are required; departure cannot precede arrival']}, 400
    booking.startDate, booking.endDate = parsed
    db.session.commit()
    return booking.toDict()


@bookings.route('/delete', methods=['DELETE'])
@login_required
def delete_booking():
    data = request.get_json(silent=True)
    booking_id = data.get('id') if isinstance(data, dict) else data
    booking = owned_booking(booking_id)
    if not booking:
        return {'errors': ['Stay not found']}, 404
    db.session.delete(booking)
    db.session.commit()
    return {'message': 'Stay deleted'}
