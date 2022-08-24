from flask import Blueprint
from ..models import Wishlists, db

wishlists = Blueprint('wishlists', __name__, url_prefix='/api/wishlists')

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
def get_spot_wishLists(userId):
    spotWishlists = wishlists.query.filter_by(userId=userId).all()
    lists = [i.toDict() for i in spotWishlists]

    for i in range(len(spotWishlists)):
        wishListsDict = {i.id: i.toDict() for i in spotWishlists[i].wishSpots}
        lists[i]['wishSpots'] = wishListsDict

        return {'wishlists': lists}
