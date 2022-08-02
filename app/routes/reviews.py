from flask import Blueprint, jsonify, session, request
from ..models import Reviews, db
from ..forms import ReviewsForm

reviews_route = Blueprint('auth', __name__, url_prefix='/api/reviews')

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@reviews_route.route('/all/<spotId>')
def get_spot_reviews(spotId):
    spotreviews = Reviews.query.filter_by(spotId=spotId).all()
    data = [i.toDict() for i in spotreviews]

    for i in range(len(spotreviews)):
        reviewsDict = {i.id: i.toDict() for i in spotreviews[i].boards}
        data[i]['boards'] = reviewsDict

        return {'reviews': data}


@reviews_route.route('/create', methods=['POST'])
def create_reviews():
    form = ReviewsForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    data = request.json
    if form.validate_on_submit():
        new_review = Reviews(
            userId=data['userId'],
            spotId=data['spotId'],
            startDate=form.data['startDate'],
            endDate=form.data['endDate'],
        )
        db.session.add(new_review)
        db.session.commit()
        return new_review.toDict()
    return 400


@reviews_route.route('/update', methods=['PUT'])
def update_review():

    data = request.json
    review = Reviews.query.get(data['id'])
    review.startDate=data['startDate']
    review.endDate=data['endDate']
    db.session.commit()
    return review.toDict()


@reviews_route.route('/delete', methods=['DELETE'])
def delete_review():
    data = request.json
    Reviews.query.filter_by(id=data).delete()
    db.session.commit()
    return 'Review successfully deleted!'
