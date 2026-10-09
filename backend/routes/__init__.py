from routes.auth import auth_bp
from routes.products import products_bp, categories_bp
from routes.inquiries import inquiries_bp
from routes.dealers import dealers_bp
from routes.dashboard import dashboard_bp
from routes.wishlist import wishlist_bp
from routes.content import content_bp


def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(categories_bp)
    app.register_blueprint(inquiries_bp)
    app.register_blueprint(dealers_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(wishlist_bp)
    app.register_blueprint(content_bp)
