from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db


class User(db.Model):
    """
    Unified user table for Factory Admins, Retailers, and Customers.
    `role` determines dashboard access and permissions.
    """
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(30))
    password_hash = db.Column(db.String(255), nullable=False)

    # 'factory_owner', 'factory_manager', 'sales_manager', 'retailer', 'customer'
    role = db.Column(db.String(30), nullable=False, default="customer")

    is_verified = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)

    # Retailer-specific approval workflow
    dealer_status = db.Column(db.String(20), default=None)  # pending/approved/rejected
    company_name = db.Column(db.String(150))
    gst_number = db.Column(db.String(50))
    business_address = db.Column(db.Text)
    dealer_discount_percent = db.Column(db.Float, default=0.0)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    wishlists = db.relationship("Wishlist", backref="user", lazy="dynamic", cascade="all, delete-orphan")
    inquiries = db.relationship(
        "Inquiry", backref="user", lazy="dynamic", cascade="all, delete-orphan",
        foreign_keys="Inquiry.user_id",
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @property
    def is_factory_staff(self):
        return self.role in ("factory_owner", "factory_manager", "sales_manager")

    def to_dict(self, include_sensitive=False):
        data = {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "role": self.role,
            "is_verified": self.is_verified,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
        if self.role == "retailer":
            data.update({
                "dealer_status": self.dealer_status,
                "company_name": self.company_name,
                "gst_number": self.gst_number,
                "business_address": self.business_address,
                "dealer_discount_percent": self.dealer_discount_percent,
            })
        return data
