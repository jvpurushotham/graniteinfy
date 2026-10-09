from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required,
    get_jwt_identity, get_jwt
)
from extensions import db
from models import User
from utils.helpers import is_valid_email

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# Roles a person can self-register as. Factory staff accounts are seeded/created by an owner.
PUBLIC_ROLES = ("customer", "retailer")


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(force=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    role = data.get("role", "customer")
    phone = data.get("phone")

    if not name or not email or not password:
        return jsonify({"error": "name, email and password are required"}), 400
    if not is_valid_email(email):
        return jsonify({"error": "Invalid email address"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400
    if role not in PUBLIC_ROLES:
        return jsonify({"error": "Invalid role for self-registration"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "An account with this email already exists"}), 409

    user = User(name=name, email=email, phone=phone, role=role)
    user.set_password(password)

    if role == "retailer":
        user.dealer_status = "pending"
        user.company_name = data.get("company_name")
        user.gst_number = data.get("gst_number")
        user.business_address = data.get("business_address")

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "Registration successful" + (
            ". Your dealer account is pending admin approval." if role == "retailer" else ""
        ),
        "user": user.to_dict(),
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(force=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401
    if not user.is_active:
        return jsonify({"error": "This account has been deactivated"}), 403
    if user.role == "retailer" and user.dealer_status == "rejected":
        return jsonify({"error": "Your dealer application was not approved"}), 403

    extra_claims = {"role": user.role, "name": user.name}
    access_token = create_access_token(identity=str(user.id), additional_claims=extra_claims)
    refresh_token = create_refresh_token(identity=str(user.id), additional_claims=extra_claims)

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user.to_dict(),
    }), 200


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    claims = get_jwt()
    user = User.query.get(int(identity))
    if not user:
        return jsonify({"error": "User not found"}), 404
    access_token = create_access_token(
        identity=identity, additional_claims={"role": user.role, "name": user.name}
    )
    return jsonify({"access_token": access_token}), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    identity = get_jwt_identity()
    user = User.query.get(int(identity))
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"user": user.to_dict()}), 200


@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json(force=True) or {}
    email = (data.get("email") or "").strip().lower()
    user = User.query.filter_by(email=email).first()
    # Always return 200 to avoid leaking which emails are registered.
    # In production this would email a signed reset token (e.g. itsdangerous + Flask-Mail).
    if user:
        pass  # TODO: send reset email with time-limited token
    return jsonify({"message": "If that email exists, a reset link has been sent."}), 200


@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json(force=True) or {}
    # TODO: verify signed token in production instead of trusting email+new_password directly
    email = (data.get("email") or "").strip().lower()
    new_password = data.get("new_password") or ""
    token = data.get("token")

    if not token:
        return jsonify({"error": "Reset token is required"}), 400
    if len(new_password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Invalid request"}), 400

    user.set_password(new_password)
    user.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify({"message": "Password has been reset successfully"}), 200
