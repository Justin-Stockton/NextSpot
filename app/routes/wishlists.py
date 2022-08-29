from urllib import request
from flask import Blueprint,request
from ..models import Wishlists, db

wishlists = Blueprint('wishlists', __name__, url_prefix = '/api/wishlists')

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@wishlists.route('/<userId>')
def get_user_wishLists(userId):
    spotWishlists = Wishlists.query.filter_by(userId = userId).all()
    list_dict = [i.toDict() for i in spotWishlists]

    for i in range(len(spotWishlists)):
        spotDict = {i.id: i.toDict() for i in spotWishlists[i].wishspots }
        list_dict[i]['wishspots'] = spotDict

    return {'wishlists': list_dict}


@wishlists.route('/create', methods = ['POST'])
def create_wishlist():
    data = request.json
    new_wishlist = Wishlists(
        userId = data['userId'],
        name = data['name'],
    )
    db.session.add(new_wishlist)
    db.session.commit()
    return new_wishlist.toDict()


@wishlists.route('/update', methods = ['PUT'])
def update_wishlist():

    data = request.json
    wishlist = Wishlists.query.get(data['id'])
    wishlist.name = data['name']
    db.session.commit()
    return wishlist.toDict()


@wishlists.route('/delete', methods=['DELETE'])
def delete_booking():
    data = request.json
    Wishlists.query.filter_by(id=data).delete()
    db.session.commit()
    return 'Wishlist successfully deleted!'
