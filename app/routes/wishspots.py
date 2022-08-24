from urllib import request
from flask import Blueprint, jsonify, session, request
from ..models import Wishspots, db

wishspots = Blueprint('wishspots', __name__, url_prefix='/api/wishspots')

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages

@wishspots.route('/<wishlistId>')
def get_spot_wishspots(wishlistId):
    wishspots = wishspots.query.filter_by(wishlistId=wishlistId).all()
    lists = [i.toDict() for i in wishspots]

    for i in range(len(wishspots)):
        wishspotsDict = {i.id: i.toDict() for i in wishspots[i].wishspots}
        lists[i]['wishspots'] = wishspotsDict
        return {'wishspots': lists}


@wishspots.route('/create', methods=['POST'])
def create_wishspot():
    data=request.json

    new_wishspot = Wishspots(
        userId=data['userId'],
        wishlistId=data['wishlistId'],
    )
    db.session.add(new_wishspot)
    db.session.commit()
    return new_wishspot.toDict()


@wishspots.route('/update', methods=['PUT'])
def update_wishspot():

    data = request.json
    wishspot = Wishspots.query.get(data['id'])
    wishspot.wishlistId=data['wishlistId']
    db.session.commit()
    return wishspot.toDict()

@wishspots.route('/delete', methods=['DELETE'])
def delete_booking():
    data = request.json
    Wishspots.query.filter_by(id=data).delete()
    db.session.commit()
    return 'Wishspot successfully removed!'
