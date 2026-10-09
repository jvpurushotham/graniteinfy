from datetime import datetime
from extensions import db


class Inquiry(db.Model):
    """Covers Request Quote / Request Callback / Schedule Visit / Ask Question flows."""
    __tablename__ = "inquiries"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=True)

    # allow guest inquiries too (no login required)
    guest_name = db.Column(db.String(120))
    guest_email = db.Column(db.String(120))
    guest_phone = db.Column(db.String(30))

    inquiry_type = db.Column(db.String(30), default="quote")  # quote/callback/visit/question
    message = db.Column(db.Text)

    status = db.Column(db.String(20), default="pending")  # pending/contacted/closed
    assigned_to_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    internal_notes = db.Column(db.Text)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    product = db.relationship("Product", backref="inquiries")
    assigned_to = db.relationship("User", foreign_keys=[assigned_to_id])

    def to_dict(self):
        return {
            "id": self.id,
            "user": self.user.to_dict() if self.user_id and self.user else None,
            "guest_name": self.guest_name,
            "guest_email": self.guest_email,
            "guest_phone": self.guest_phone,
            "product": self.product.to_dict() if self.product else None,
            "inquiry_type": self.inquiry_type,
            "message": self.message,
            "status": self.status,
            "assigned_to": self.assigned_to.name if self.assigned_to else None,
            "internal_notes": self.internal_notes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Wishlist(db.Model):
    __tablename__ = "wishlists"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    product = db.relationship("Product")

    __table_args__ = (db.UniqueConstraint("user_id", "product_id", name="uq_user_product_wishlist"),)


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    category = db.Column(db.String(50))  # Residential/Commercial/Hotels/...
    location = db.Column(db.String(150))
    granite_used = db.Column(db.String(150))
    area_sqft = db.Column(db.Float)
    completion_date = db.Column(db.Date)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "category": self.category,
            "location": self.location,
            "granite_used": self.granite_used,
            "area_sqft": self.area_sqft,
            "completion_date": self.completion_date.isoformat() if self.completion_date else None,
            "description": self.description,
            "image_url": self.image_url,
        }


class Testimonial(db.Model):
    __tablename__ = "testimonials"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(120))
    message = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, default=5)
    is_published = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id, "name": self.name, "role": self.role,
            "message": self.message, "rating": self.rating,
        }


class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id, "title": self.title, "message": self.message,
            "is_read": self.is_read, "created_at": self.created_at.isoformat(),
        }
