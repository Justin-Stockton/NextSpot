import os

from flask import Flask
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFError, CSRFProtect, generate_csrf
from werkzeug.middleware.proxy_fix import ProxyFix

from .config import Config
from .models import Users, db
from .routes import auth_routes, bookings, reviews, spots, user_routes, wishlists, wishspots
from .seeds import seed_commands

app = Flask(__name__, static_url_path='')
app.config.from_object(Config)
if os.environ.get("FLASK_ENV") == "production":
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)

login = LoginManager(app)


@login.unauthorized_handler
def unauthorized():
    return {"errors": ["Unauthorized"]}, 401


@login.user_loader
def load_user(user_id):
    return db.session.get(Users, int(user_id))


app.cli.add_command(seed_commands)
app.register_blueprint(user_routes.user_route)
app.register_blueprint(auth_routes.auth_route)
app.register_blueprint(reviews)
app.register_blueprint(bookings)
app.register_blueprint(spots)
app.register_blueprint(wishlists)
app.register_blueprint(wishspots)
db.init_app(app)
Migrate(app, db)
CSRFProtect(app)


@app.errorhandler(CSRFError)
def handle_csrf_error(error):
    return {"errors": [error.description]}, 400


@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        "csrf_token",
        generate_csrf(),
        secure=app.config["SESSION_COOKIE_SECURE"],
        samesite="Lax",
        httponly=False,
    )
    return response


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def react_root(path):
    if path == "favicon.ico":
        return app.send_static_file("favicon.ico")
    return app.send_static_file("index.html")
