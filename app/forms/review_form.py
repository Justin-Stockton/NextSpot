from flask_wtf import FlaskForm
from wtforms import TextAreaField,IntegerField
from wtforms.validators import DataRequired, ValidationError

def valid_rating(form,field):
    rating = field.data
    if rating <= 0 or rating >= 5:
        raise ValidationError('Ratings are based on a 0 - 5 scale.')



class ReviewsForm(FlaskForm):
    review = TextAreaField('review', validators=[DataRequired()])
    rating = IntegerField('rating',validators=[DataRequired,valid_rating])
