from flask import Blueprint, jsonify, session, request
from ..models import Spots, db


spots = Blueprint('spots', __name__, url_prefix='/api/spots')
@spots.route('/')
def get_spots():
    spots = Spots.query.all()
    data = [i.toDict() for i in spots]
    for i in range(len(spots)):
        reviewsDict = {i.id: i.toDict() for i in spots[i].reviews}
        data[i]['reviews'] = reviewsDict

    return {'spots' : data}
