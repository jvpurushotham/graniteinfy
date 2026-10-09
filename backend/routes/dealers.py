from flask import Blueprint, request, jsonify
from extensions import db
from models import User
from middleware.auth import roles_required, FACTORY_ROLES

dealers_bp = Blueprint("dealers", __name__, url_prefix="/api/dealers")


@dealers_bp.route("", methods=["GET"])
@roles_required(*FACTORY_ROLES)
def list_dealers():
    status = request.args.get("status")  # pending/approved/rejected
    query = User.query.filter_by(role="retailer")
    if status:
        query = query.filter_by(dealer_status=status)
    dealers = query.order_by(User.created_at.desc()).all()
    return jsonify({"dealers": [d.to_dict() for d in dealers]}), 200


@dealers_bp.route("/<int:dealer_id>/approve", methods=["POST"])
@roles_required(*FACTORY_ROLES)
def approve_dealer(dealer_id):
    dealer = User.query.filter_by(id=dealer_id, role="retailer").first_or_404()
    dealer.dealer_status = "approved"
    dealer.is_verified = True
    db.session.commit()
    return jsonify({"dealer": dealer.to_dict()}), 200


@dealers_bp.route("/<int:dealer_id>/reject", methods=["POST"])
@roles_required(*FACTORY_ROLES)
def reject_dealer(dealer_id):
    dealer = User.query.filter_by(id=dealer_id, role="retailer").first_or_404()
    dealer.dealer_status = "rejected"
    db.session.commit()
    return jsonify({"dealer": dealer.to_dict()}), 200


@dealers_bp.route("/<int:dealer_id>/discount", methods=["PUT"])
@roles_required(*FACTORY_ROLES)
def set_dealer_discount(dealer_id):
    dealer = User.query.filter_by(id=dealer_id, role="retailer").first_or_404()
    data = request.get_json(force=True) or {}
    dealer.dealer_discount_percent = float(data.get("discount_percent", 0))
    db.session.commit()
    return jsonify({"dealer": dealer.to_dict()}), 200
