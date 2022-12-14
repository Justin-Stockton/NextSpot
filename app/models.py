from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

db = SQLAlchemy()

class Users(db.Model, UserMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    hashedPassword = db.Column(db.String(500))
    host = db.Column(db.Boolean, nullable=False, default=False)
    createdAt = db.Column(db.DateTime(timezone=True), nullable=False, server_default=func.now())
    updatedAt = db.Column(db.DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    reviews = db.relationship('Reviews', back_populates='user', cascade="all, delete-orphan")
    spots = db.relationship('Spots', back_populates='user', cascade="all, delete-orphan")
    bookings = db.relationship('Bookings', back_populates='user', cascade="all, delete-orphan")
    wishlists = db.relationship('Wishlists', back_populates='user', cascade="all, delete-orphan")

    @property
    def password(self):
        return self.hashedPassword

    @password.setter
    def password(self, password):
        self.hashedPassword = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def toDict(self):
        return dict(
            id=self.id,
            username=self.username,
            email=self.email,
            hashedPassword=self.hashedPassword,
            createdAt=self.createdAt,
            updatedAt=self.updatedAt
        )

class Spots(db.Model):
    __tablename__ = "spots"

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey("users.id", ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(500),nullable=False)
    price = db.Column(db.Integer,nullable=False)
    streetAdress = db.Column(db.String(400), nullable=False)
    city = db.Column(db.String(50), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    zip = db.Column(db.Integer,nullable=False)
    location = db.Column(db.String(50), nullable=True)
    img1 = db.Column(db.String(1000), nullable=True)
    img2 = db.Column(db.String(1000), nullable=True)
    img3 = db.Column(db.String(1000), nullable=True)
    img4 = db.Column(db.String(1000), nullable=True)
    img5 = db.Column(db.String(1000), nullable=True)
    img6 = db.Column(db.String(1000), nullable=True)
    createdAt = db.Column(db.DateTime(timezone=True), nullable=False, server_default=func.now())
    updatedAt = db.Column(db.DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    user = db.relationship('Users', back_populates='spots')
    bookings = db.relationship('Bookings', back_populates='spot')
    reviews = db.relationship('Reviews', back_populates='spot')
    wishspots = db.relationship('Wishspots', back_populates='spot', cascade="all, delete-orphan")


    def toDict(self):
        return dict(
            id=self.id,
            userId=self.userId,
            name=self.name,
            price=self.price,
            streetAdress=self.streetAdress,
            city=self.city,
            state=self.state,
            zip=self.zip,
            img1=self.img1,
            img2=self.img2,
            img3=self.img3,
            img4=self.img4,
            img5=self.img5,
            img6=self.img6,
            location=self.location,
            createdAt=self.createdAt,
            updatedAt=self.updatedAt,
        )

class Bookings(db.Model):
    __tablename__ = "bookings"

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey("users.id", ondelete='CASCADE'), nullable=False)
    spotId = db.Column(db.Integer, db.ForeignKey("spots.id", ondelete='CASCADE'), nullable=False)
    spotName = db.Column(db.String(50),nullable=False)
    startDate = db.Column(db.Date, nullable = False)
    endDate = db.Column(db.Date, nullable = False)
    createdAt = db.Column(db.DateTime(timezone=True), nullable=False, server_default=func.now())
    updatedAt = db.Column(db.DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    spot = db.relationship('Spots', back_populates='bookings')
    user = db.relationship('Users', back_populates='bookings')



    def toDict(self):
        return dict(
            id=self.id,
            userId=self.userId,
            spotId=self.spotId,
            spotName=self.spotName,
            startDate=self.startDate,
            endDate=self.endDate,
            createdAt=self.createdAt,
            updatedAt=self.updatedAt,
        )


class Reviews(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey("users.id", ondelete='CASCADE'), nullable=False)
    spotId = db.Column(db.Integer, db.ForeignKey("spots.id", ondelete='CASCADE'), nullable=False)
    review = db.Column(db.String(1000), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    username = db.Column(db.String(50), nullable=False)
    createdAt = db.Column(db.DateTime(timezone=True), nullable=False, server_default=func.now())
    updatedAt = db.Column(db.DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    spot = db.relationship('Spots', back_populates='reviews')
    user = db.relationship('Users', back_populates='reviews')

    def toDict(self):
        return dict(
            id=self.id,
            userId=self.userId,
            spotId=self.spotId,
            review=self.review,
            rating=self.rating,
            username=self.username,
            createdAt=self.createdAt,
            updatedAt=self.updatedAt
        )

class Wishlists(db.Model):
    __tablename__ = "wishlists"

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey("users.id", ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(100), nullable=False)

    user = db.relationship('Users', back_populates='wishlists')
    wishspots = db.relationship('Wishspots', back_populates='wishlists',cascade="all, delete-orphan")

    def toDict(self):
        return dict(
            id=self.id,
            userId=self.userId,
            name=self.name,
        )

class Wishspots(db.Model):
    __tablename__ = "wishspots"

    id = db.Column(db.Integer, primary_key=True)
    spotId = db.Column(db.Integer, db.ForeignKey("spots.id", ondelete='CASCADE'), nullable=False)
    wishlistId = db.Column(db.Integer, db.ForeignKey("wishlists.id", ondelete='CASCADE'), nullable=False)

    spot = db.relationship('Spots', back_populates='wishspots')
    wishlists = db.relationship('Wishlists', back_populates='wishspots')

    def toDict(self):
        return dict(
            id=self.id,
            spotId=self.spotId,
            wishlistId=self.wishlistId,
        )
