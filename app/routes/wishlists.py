from flask import Blueprint, abort, request
from flask_login import current_user, login_required

from ..models import Wishlists, db

wishlists = Blueprint("wishlists", __name__, url_prefix="/api/wishlists")


@wishlists.get("/<int:user_id>")
@login_required
def get_user_wishlists(user_id):
    if user_id != current_user.id:
        abort(403)
    user_wishlists = Wishlists.query.filter_by(userId=user_id).all()
    result = [wishlist.toDict() for wishlist in user_wishlists]
    for index, wishlist in enumerate(user_wishlists):
        result[index]["wishspots"] = {item.id: item.toDict() for item in wishlist.wishspots}
    return {"wishlists": result}


@wishlists.post("/create")
@login_required
def create_wishlist():
    new_wishlist = Wishlists(userId=current_user.id, name=request.get_json()["name"])
    db.session.add(new_wishlist)
    db.session.commit()
    return new_wishlist.toDict()


@wishlists.put("/update")
@login_required
def update_wishlist():
    data = request.get_json()
    wishlist = db.session.get(Wishlists, data["id"])
    if wishlist is None:
        abort(404)
    if wishlist.userId != current_user.id:
        abort(403)
    wishlist.name = data["name"]
    db.session.commit()
    return wishlist.toDict()


@wishlists.delete("/delete")
@login_required
def delete_wishlist():
    wishlist = db.session.get(Wishlists, request.get_json())
    if wishlist is None:
        abort(404)
    if wishlist.userId != current_user.id:
        abort(403)
    db.session.delete(wishlist)
    db.session.commit()
    return {"message": "Wishlist successfully deleted"}
