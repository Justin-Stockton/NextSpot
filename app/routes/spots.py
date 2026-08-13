from flask import Blueprint, request
from flask_login import current_user, login_required
from ..models import Spots, db

spots = Blueprint('spots', __name__, url_prefix='/api/spots')


def serialize(spot):
    data = spot.toDict()
    data['reviews'] = {item.id: item.toDict() for item in spot.reviews}
    data['bookings'] = {item.id: item.toDict() for item in spot.bookings}
    return data


def owned_spot(spot_id):
    return Spots.query.filter_by(id=spot_id, userId=current_user.id).first()


@spots.route('/')
@login_required
def get_spots():
    owned = Spots.query.filter_by(userId=current_user.id).all()
    return {'spots': [serialize(spot) for spot in owned]}


@spots.route('/<int:spot_id>')
@login_required
def get_spot(spot_id):
    spot = owned_spot(spot_id)
    return (serialize(spot), 200) if spot else ({'errors': ['Place not found']}, 404)


@spots.route('/create', methods=['POST'])
@login_required
def create_spot():
    data = request.get_json(silent=True) or {}
    if not data.get('name') or not data.get('location'):
        return {'errors': ['Name and location are required']}, 400
    spot = Spots(
        userId=current_user.id, name=data['name'], location=data['location'],
        price=data.get('price') or 0, streetAdress=data.get('streetAdress') or '',
        city=data.get('city') or '', state=data.get('state') or '', zip=data.get('zip') or 0,
        **{f'img{i}': data.get(f'img{i}') or None for i in range(1, 7)}
    )
    db.session.add(spot)
    db.session.commit()
    return serialize(spot), 201


@spots.route('/<int:spot_id>', methods=['PUT'])
@login_required
def update_spot(spot_id):
    spot = owned_spot(spot_id)
    if not spot:
        return {'errors': ['Place not found']}, 404
    data = request.get_json(silent=True) or {}
    for field in ('name', 'location', 'price', 'streetAdress', 'city', 'state', 'zip',
                  'img1', 'img2', 'img3', 'img4', 'img5', 'img6'):
        if field in data:
            setattr(spot, field, data[field] if data[field] not in (None, '') or field in ('name', 'location') else (0 if field in ('price', 'zip') else ''))
    if not spot.name or not spot.location:
        return {'errors': ['Name and location are required']}, 400
    db.session.commit()
    return serialize(spot)


@spots.route('/<int:spot_id>', methods=['DELETE'])
@login_required
def delete_spot(spot_id):
    spot = owned_spot(spot_id)
    if not spot:
        return {'errors': ['Place not found']}, 404
    db.session.delete(spot)
    db.session.commit()
    return {'message': 'Place deleted'}
