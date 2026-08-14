from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import Users


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    if email.strip().lower() == 'demo@aa.io':
        raise ValidationError('That email address is reserved for the public demo.')
    user = Users.query.filter(Users.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    if username.strip().lower() == 'demo':
        raise ValidationError('That username is reserved for the public demo.')
    user = Users.query.filter(Users.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')


class SignUpForm(FlaskForm):
    username = StringField(
        'username', validators=[DataRequired(), username_exists])
    email = StringField('email', validators=[DataRequired(), user_exists, Email()])
    password = StringField('password', validators=[DataRequired()])
