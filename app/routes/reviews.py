from flask import Blueprint, request
from flask_login import current_user, login_required
from ..models import Reviews, Spots, db

reviews = Blueprint('reviews', __name__, url_prefix='/api/reviews')


def owned_review(review_id):
    return Reviews.query.filter_by(id=review_id, userId=current_user.id).first()


def valid(data):
    return isinstance(data.get('review'), str) and bool(data['review'].strip()) and isinstance(data.get('rating'), int) and 1 <= data['rating'] <= 5


@reviews.route('/<int:spot_id>')
@login_required
def get_spot_reviews(spot_id):
    if not Spots.query.filter_by(id=spot_id, userId=current_user.id).first():
        return {'errors': ['Place not found']}, 404
    return {'reviews': [item.toDict() for item in Reviews.query.filter_by(spotId=spot_id, userId=current_user.id).all()]}


@reviews.route('/create', methods=['POST'])
@login_required
def create_review():
    data = request.get_json(silent=True) or {}
    spot = Spots.query.filter_by(id=data.get('spotId'), userId=current_user.id).first()
    if not spot:
        return {'errors': ['Place not found']}, 404
    if not valid(data):
        return {'errors': ['A note and integer rating from 1 to 5 are required']}, 400
    review = Reviews(userId=current_user.id, spotId=spot.id, review=data['review'].strip(),
                     rating=data['rating'], username=current_user.username)
    db.session.add(review)
    db.session.commit()
    return review.toDict(), 201


@reviews.route('/update', methods=['PUT'])
@login_required
def update_review():
    data = request.get_json(silent=True) or {}
    review = owned_review(data.get('id'))
    if not review:
        return {'errors': ['Memory not found']}, 404
    if not valid(data):
        return {'errors': ['A note and integer rating from 1 to 5 are required']}, 400
    review.review, review.rating = data['review'].strip(), data['rating']
    db.session.commit()
    return review.toDict()


@reviews.route('/delete', methods=['DELETE'])
@login_required
def delete_review():
    data = request.get_json(silent=True) or {}
    review = owned_review(data.get('reviewId', data.get('id')))
    if not review:
        return {'errors': ['Memory not found']}, 404
    db.session.delete(review)
    db.session.commit()
    return {'message': 'Memory deleted'}
