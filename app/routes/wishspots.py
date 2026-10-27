from flask import Blueprint, abort, request
from flask_login import current_user, login_required

from ..models import Wishlists, Wishspots, db

wishspots = Blueprint("wishspots", __name__, url_prefix="/api/wishspots")


def owned_wishlist(wishlist_id):
    wishlist = db.session.get(Wishlists, wishlist_id)
    if wishlist is None:
        abort(404)
    if wishlist.userId != current_user.id:
        abort(403)
    return wishlist


@wishspots.get("/<int:wishlist_id>")
@login_required
def get_spot_wishspots(wishlist_id):
    owned_wishlist(wishlist_id)
    return {
        "wishspots": [item.toDict() for item in Wishspots.query.filter_by(wishlistId=wishlist_id).all()]
    }


@wishspots.post("/create")
@login_required
def create_wishspot():
    data = request.get_json()
    owned_wishlist(data["wishlistId"])
    new_wishspot = Wishspots(spotId=data["spotId"], wishlistId=data["wishlistId"])
    db.session.add(new_wishspot)
    db.session.commit()
    return new_wishspot.toDict()


@wishspots.put("/update")
@login_required
def update_wishspot():
    data = request.get_json()
    wishspot = db.session.get(Wishspots, data["id"])
    if wishspot is None:
        abort(404)
    owned_wishlist(wishspot.wishlistId)
    owned_wishlist(data["wishlistId"])
    wishspot.wishlistId = data["wishlistId"]
    db.session.commit()
    return wishspot.toDict()


@wishspots.delete("/delete")
@login_required
def delete_wishspot():
    data = request.get_json()
    owned_wishlist(data["wishlistId"])
    item = Wishspots.query.filter_by(
        spotId=data["spotId"], wishlistId=data["wishlistId"]
    ).first()
    if item is None:
        abort(404)
    db.session.delete(item)
    db.session.commit()
    return {"message": "Wishspot successfully removed"}
