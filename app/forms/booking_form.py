from flask_wtf import FlaskForm
from wtforms import DateField
from wtforms.validators import DataRequired, ValidationError
from datetime import datetime


def valid_start(form,field):
    start = field.data
    if start <= datetime.today().date():
        raise ValidationError('The start date must be in the future.')

def valid_end(form,field):
    end = field.data
    if end <= datetime.today().date():
        raise ValidationError('The end date must be in the future.')


class BookingsForm(FlaskForm):
    start_date = DateField('startDate', validators=[DataRequired(), valid_start])
    end_date = DateField('endDate', validators=[DataRequired(), valid_end])
