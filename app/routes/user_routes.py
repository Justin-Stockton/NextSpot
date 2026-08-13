from flask import Blueprint
from flask_login import current_user, login_required

user_route = Blueprint('users', __name__, url_prefix='/api/users')


@user_route.route('/')
@login_required
def users():
    return {'users': [current_user.toDict()]}


@user_route.route('/<int:id>')
@login_required
def user(id):
    if id != current_user.id:
        return {'errors': ['User not found']}, 404
    return current_user.toDict()
