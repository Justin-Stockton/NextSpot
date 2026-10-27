from datetime import date

from flask import Blueprint, abort, request
from flask_login import current_user, login_required

from ..models import Bookings, db

bookings = Blueprint("bookings", __name__, url_prefix="/api/bookings")


@bookings.get("/spot/<int:spot_id>")
def get_spot_bookings(spot_id):
    return {"bookings": [booking.toDict() for booking in Bookings.query.filter_by(spotId=spot_id).all()]}


@bookings.get("/user/<int:user_id>")
@login_required
def get_user_bookings(user_id):
    if user_id != current_user.id:
        abort(403)
    return {"bookings": [booking.toDict() for booking in Bookings.query.filter_by(userId=user_id).all()]}


@bookings.post("/create")
@login_required
def create_bookings():
    data = request.get_json()
    new_booking = Bookings(
        userId=current_user.id,
        spotId=data["spotId"],
        spotName=data["spotName"],
        startDate=date.fromisoformat(data["startDate"]),
        endDate=date.fromisoformat(data["endDate"]),
    )
    db.session.add(new_booking)
    db.session.commit()
    return new_booking.toDict()


@bookings.put("/update")
@login_required
def update_booking():
    data = request.get_json()
    booking = db.session.get(Bookings, data["id"])
    if booking is None:
        abort(404)
    if booking.userId != current_user.id:
        abort(403)
    booking.startDate = date.fromisoformat(data["startDate"])
    booking.endDate = date.fromisoformat(data["endDate"])
    db.session.commit()
    return booking.toDict()


@bookings.delete("/delete")
@login_required
def delete_booking():
    booking = db.session.get(Bookings, request.get_json())
    if booking is None:
        abort(404)
    if booking.userId != current_user.id:
        abort(403)
    db.session.delete(booking)
    db.session.commit()
    return {"message": "Booking successfully deleted"}
