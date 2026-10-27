from flask import Blueprint, abort, request
from flask_login import current_user, login_required

from ..models import Reviews, db

reviews = Blueprint("reviews", __name__, url_prefix="/api/reviews")


@reviews.get("/<int:spot_id>")
def get_spot_reviews(spot_id):
    return {"reviews": [review.toDict() for review in Reviews.query.filter_by(spotId=spot_id).all()]}


@reviews.post("/create")
@login_required
def create_reviews():
    data = request.get_json()
    new_review = Reviews(
        userId=current_user.id,
        spotId=data["spotId"],
        review=data["review"],
        rating=data["rating"],
        username=current_user.username,
    )
    db.session.add(new_review)
    db.session.commit()
    return new_review.toDict()


@reviews.put("/update")
@login_required
def update_review():
    data = request.get_json()
    review = db.session.get(Reviews, data["id"])
    if review is None:
        abort(404)
    if review.userId != current_user.id:
        abort(403)
    review.review = data["review"]
    review.rating = data["rating"]
    db.session.commit()
    return review.toDict()


@reviews.delete("/delete")
@login_required
def delete_review():
    review = db.session.get(Reviews, request.get_json()["reviewId"])
    if review is None:
        abort(404)
    if review.userId != current_user.id:
        abort(403)
    db.session.delete(review)
    db.session.commit()
    return {"message": "Review successfully deleted"}
