from datetime import datetime, timedelta
from flask import Blueprint, jsonify
from sqlalchemy import func
from extensions import db
from models import Product, Inquiry, User
from middleware.auth import roles_required, FACTORY_ROLES

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")


@dashboard_bp.route("/stats", methods=["GET"])
@roles_required(*FACTORY_ROLES)
def stats():
    total_products = Product.query.count()
    total_retailers = User.query.filter_by(role="retailer").count()
    total_customers = User.query.filter_by(role="customer").count()
    todays_inquiries = Inquiry.query.filter(
        func.date(Inquiry.created_at) == datetime.utcnow().date()
    ).count()
    pending_inquiries = Inquiry.query.filter_by(status="pending").count()
    pending_dealers = User.query.filter_by(role="retailer", dealer_status="pending").count()
    low_stock_products = [p.to_dict() for p in Product.query.all() if p.is_low_stock]

    most_viewed = (Product.query.order_by(Product.view_count.desc()).limit(5).all())
    most_inquired = (Product.query.order_by(Product.inquiry_count.desc()).limit(5).all())

    recent_inquiries = Inquiry.query.order_by(Inquiry.created_at.desc()).limit(8).all()

    return jsonify({
        "cards": {
            "total_products": total_products,
            "total_retailers": total_retailers,
            "total_customers": total_customers,
            "todays_inquiries": todays_inquiries,
            "pending_inquiries": pending_inquiries,
            "pending_dealer_approvals": pending_dealers,
            "low_stock_count": len(low_stock_products),
        },
        "most_viewed_products": [p.to_dict() for p in most_viewed],
        "most_inquired_products": [p.to_dict() for p in most_inquired],
        "low_stock_products": low_stock_products[:10],
        "recent_inquiries": [i.to_dict() for i in recent_inquiries],
    }), 200
