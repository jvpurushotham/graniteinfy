from datetime import datetime
from extensions import db


class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    products = db.relationship("Product", backref="category", lazy="dynamic")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "description": self.description,
            "product_count": self.products.count(),
        }


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    slug = db.Column(db.String(180), unique=True, nullable=False, index=True)
    product_code = db.Column(db.String(50), unique=True, nullable=False)

    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=True)

    material = db.Column(db.String(50), default="Granite")
    color = db.Column(db.String(60))
    finish = db.Column(db.String(60))  # Polished, Honed, Flamed, Leather
    origin = db.Column(db.String(100))

    thickness_mm = db.Column(db.Float)
    length_mm = db.Column(db.Float)
    width_mm = db.Column(db.Float)
    weight_kg_per_sqft = db.Column(db.Float)

    description = db.Column(db.Text)
    applications = db.Column(db.String(255))  # comma-separated: Kitchen,Floor,Wall...

    price_per_sqft = db.Column(db.Float, nullable=True)  # optional, visible to retailers/admin
    show_price_publicly = db.Column(db.Boolean, default=False)

    available_quantity_sqft = db.Column(db.Float, default=0)
    minimum_order_sqft = db.Column(db.Float, default=50)
    low_stock_threshold = db.Column(db.Float, default=100)

    brochure_url = db.Column(db.String(500))
    video_url = db.Column(db.String(500))

    is_featured = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    approval_status = db.Column(db.String(20), default="approved")  # pending/approved/rejected

    view_count = db.Column(db.Integer, default=0)
    inquiry_count = db.Column(db.Integer, default=0)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    images = db.relationship("ProductImage", backref="product", lazy="joined", cascade="all, delete-orphan")

    @property
    def is_low_stock(self):
        return self.available_quantity_sqft <= self.low_stock_threshold

    def to_dict(self, detailed=False):
        data = {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "product_code": self.product_code,
            "category": self.category.name if self.category else None,
            "category_id": self.category_id,
            "material": self.material,
            "color": self.color,
            "finish": self.finish,
            "origin": self.origin,
            "thickness_mm": self.thickness_mm,
            "applications": self.applications.split(",") if self.applications else [],
            "price_per_sqft": self.price_per_sqft if self.show_price_publicly else None,
            "available_quantity_sqft": self.available_quantity_sqft,
            "is_low_stock": self.is_low_stock,
            "is_featured": self.is_featured,
            "is_active": self.is_active,
            "approval_status": self.approval_status,
            "images": [img.url for img in self.images],
            "primary_image": self.images[0].url if self.images else None,
            "view_count": self.view_count,
        }
        if detailed:
            data.update({
                "description": self.description,
                "length_mm": self.length_mm,
                "width_mm": self.width_mm,
                "weight_kg_per_sqft": self.weight_kg_per_sqft,
                "minimum_order_sqft": self.minimum_order_sqft,
                "brochure_url": self.brochure_url,
                "video_url": self.video_url,
                "inquiry_count": self.inquiry_count,
                "created_at": self.created_at.isoformat() if self.created_at else None,
            })
        return data


class ProductImage(db.Model):
    __tablename__ = "product_images"

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    url = db.Column(db.String(500), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)
    sort_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
