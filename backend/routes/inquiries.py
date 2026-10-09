from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from extensions import db
from models import Inquiry, Product
from middleware.auth import roles_required, FACTORY_ROLES

inquiries_bp = Blueprint("inquiries", __name__, url_prefix="/api/inquiries")


@inquiries_bp.route("", methods=["POST"])
def create_inquiry():
    """Public endpoint - works for guests and logged in users (Request Quote / Callback / Visit / Question)."""
    data = request.get_json(force=True) or {}

    user_id = None
    try:
        verify_jwt_in_request(optional=True)
        identity = get_jwt_identity()
        if identity:
            user_id = int(identity)
    except Exception:
        pass

    inquiry = Inquiry(
        user_id=user_id,
        product_id=data.get("product_id"),
        guest_name=data.get("name"),
        guest_email=data.get("email"),
        guest_phone=data.get("phone"),
        inquiry_type=data.get("inquiry_type", "quote"),
        message=data.get("message"),
    )
    db.session.add(inquiry)

    if inquiry.product_id:
        product = Product.query.get(inquiry.product_id)
        if product:
            product.inquiry_count = (product.inquiry_count or 0) + 1

    db.session.commit()
    return jsonify({"message": "Inquiry submitted successfully", "inquiry": inquiry.to_dict()}), 201


@inquiries_bp.route("", methods=["GET"])
@roles_required(*FACTORY_ROLES)
def list_inquiries():
    status = request.args.get("status")
    query = Inquiry.query
    if status:
        query = query.filter_by(status=status)
    query = query.order_by(Inquiry.created_at.desc())

    page = int(request.args.get("page", 1))
    per_page = min(int(request.args.get("per_page", 20)), 100)
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "inquiries": [i.to_dict() for i in pagination.items],
        "total": pagination.total,
        "page": page,
        "pages": pagination.pages,
    }), 200


@inquiries_bp.route("/<int:inquiry_id>", methods=["PUT"])
@roles_required(*FACTORY_ROLES)
def update_inquiry(inquiry_id):
    inquiry = Inquiry.query.get_or_404(inquiry_id)
    data = request.get_json(force=True) or {}

    if "status" in data:
        inquiry.status = data["status"]
    if "assigned_to_id" in data:
        inquiry.assigned_to_id = data["assigned_to_id"]
    if "internal_notes" in data:
        inquiry.internal_notes = data["internal_notes"]

    db.session.commit()
    return jsonify({"inquiry": inquiry.to_dict()}), 200


@inquiries_bp.route("/my", methods=["GET"])
@jwt_required()
def my_inquiries():
    user_id = int(get_jwt_identity())
    items = Inquiry.query.filter_by(user_id=user_id).order_by(Inquiry.created_at.desc()).all()
    return jsonify({"inquiries": [i.to_dict() for i in items]}), 200
