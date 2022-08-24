from flask import Blueprint
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
