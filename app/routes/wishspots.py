from flask import Blueprint, request
from flask_login import current_user, login_required
from ..models import Wishspots, Wishlists, Spots, db

wishspots = Blueprint('wishspots', __name__, url_prefix='/api/wishspots')


def parents(data):
    collection = Wishlists.query.filter_by(id=data.get('wishlistId'), userId=current_user.id).first()
    place = Spots.query.filter_by(id=data.get('spotId'), userId=current_user.id).first()
    return collection, place


@wishspots.route('/<int:wishlist_id>')
@login_required
def get_wishspots(wishlist_id):
    collection = Wishlists.query.filter_by(id=wishlist_id, userId=current_user.id).first()
    if not collection:
        return {'errors': ['Collection not found']}, 404
    return {'wishspots': [item.toDict() for item in collection.wishspots]}


@wishspots.route('/create', methods=['POST'])
@login_required
def create_wishspot():
    data = request.get_json(silent=True) or {}
    collection, place = parents(data)
    if not collection or not place:
        return {'errors': ['Owned Collection and Place are required']}, 404
    existing = Wishspots.query.filter_by(spotId=place.id, wishlistId=collection.id).first()
    if existing:
        return existing.toDict()
    item = Wishspots(spotId=place.id, wishlistId=collection.id)
    db.session.add(item)
    db.session.commit()
    return item.toDict(), 201


@wishspots.route('/update', methods=['PUT'])
@login_required
def update_wishspot():
    data = request.get_json(silent=True) or {}
    item = Wishspots.query.get(data.get('id'))
    collection, place = parents(data)
    if not item or not collection or not place or item.spot.userId != current_user.id or item.wishlists.userId != current_user.id:
        return {'errors': ['Collection membership not found']}, 404
    item.wishlistId = collection.id
    db.session.commit()
    return item.toDict()


@wishspots.route('/delete', methods=['DELETE'])
@login_required
def delete_wishspot():
    data = request.get_json(silent=True) or {}
    collection, place = parents(data)
    if not collection or not place:
        return {'errors': ['Collection membership not found']}, 404
    item = Wishspots.query.filter_by(spotId=place.id, wishlistId=collection.id).first()
    if not item:
        return {'errors': ['Collection membership not found']}, 404
    db.session.delete(item)
    db.session.commit()
    return {'message': 'Place removed from Collection'}
