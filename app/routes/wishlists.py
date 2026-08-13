from flask import Blueprint, request
from flask_login import current_user, login_required
from ..models import Wishlists, db

wishlists = Blueprint('wishlists', __name__, url_prefix='/api/wishlists')


def owned(wishlist_id):
    return Wishlists.query.filter_by(id=wishlist_id, userId=current_user.id).first()


def serialize(item):
    data = item.toDict()
    data['wishspots'] = {member.id: member.toDict() for member in item.wishspots}
    return data


@wishlists.route('/<int:user_id>')
@wishlists.route('/')
@login_required
def get_user_wishlists(user_id=None):
    return {'wishlists': [serialize(item) for item in Wishlists.query.filter_by(userId=current_user.id).all()]}


@wishlists.route('/create', methods=['POST'])
@login_required
def create_wishlist():
    data = request.get_json(silent=True) or {}
    if not isinstance(data.get('name'), str) or not data['name'].strip():
        return {'errors': ['Collection name is required']}, 400
    item = Wishlists(userId=current_user.id, name=data['name'].strip())
    db.session.add(item)
    db.session.commit()
    return serialize(item), 201


@wishlists.route('/update', methods=['PUT'])
@login_required
def update_wishlist():
    data = request.get_json(silent=True) or {}
    item = owned(data.get('id'))
    if not item:
        return {'errors': ['Collection not found']}, 404
    if not isinstance(data.get('name'), str) or not data['name'].strip():
        return {'errors': ['Collection name is required']}, 400
    item.name = data['name'].strip()
    db.session.commit()
    return serialize(item)


@wishlists.route('/delete', methods=['DELETE'])
@login_required
def delete_wishlist():
    data = request.get_json(silent=True)
    item = owned(data.get('id') if isinstance(data, dict) else data)
    if not item:
        return {'errors': ['Collection not found']}, 404
    db.session.delete(item)
    db.session.commit()
    return {'message': 'Collection deleted'}
