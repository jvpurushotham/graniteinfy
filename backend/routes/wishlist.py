from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Wishlist, Product

wishlist_bp = Blueprint("wishlist", __name__, url_prefix="/api/wishlist")


@wishlist_bp.route("", methods=["GET"])
@jwt_required()
def get_wishlist():
    user_id = int(get_jwt_identity())
    items = Wishlist.query.filter_by(user_id=user_id).all()
    return jsonify({"wishlist": [w.product.to_dict() for w in items if w.product]}), 200


@wishlist_bp.route("/<int:product_id>", methods=["POST"])
@jwt_required()
def add_to_wishlist(product_id):
    user_id = int(get_jwt_identity())
    Product.query.get_or_404(product_id)
    existing = Wishlist.query.filter_by(user_id=user_id, product_id=product_id).first()
    if not existing:
        db.session.add(Wishlist(user_id=user_id, product_id=product_id))
        db.session.commit()
    return jsonify({"message": "Added to wishlist"}), 201


@wishlist_bp.route("/<int:product_id>", methods=["DELETE"])
@jwt_required()
def remove_from_wishlist(product_id):
    user_id = int(get_jwt_identity())
    Wishlist.query.filter_by(user_id=user_id, product_id=product_id).delete()
    db.session.commit()
    return jsonify({"message": "Removed from wishlist"}), 200
