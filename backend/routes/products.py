from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, jwt_required as _jr
from sqlalchemy import or_
from extensions import db
from models import Product, ProductImage, Category
from middleware.auth import roles_required, FACTORY_ROLES
from utils.helpers import unique_slug, generate_product_code

products_bp = Blueprint("products", __name__, url_prefix="/api/products")
categories_bp = Blueprint("categories", __name__, url_prefix="/api/categories")


@categories_bp.route("", methods=["GET"])
def list_categories():
    cats = Category.query.order_by(Category.name).all()
    return jsonify({"categories": [c.to_dict() for c in cats]}), 200


@categories_bp.route("", methods=["POST"])
@roles_required(*FACTORY_ROLES)
def create_category():
    data = request.get_json(force=True) or {}
    name = (data.get("name") or "").strip()
    if not name:
        return jsonify({"error": "name is required"}), 400
    slug = unique_slug(name, lambda s: Category.query.filter_by(slug=s).first() is not None)
    cat = Category(name=name, slug=slug, description=data.get("description"))
    db.session.add(cat)
    db.session.commit()
    return jsonify({"category": cat.to_dict()}), 201


@products_bp.route("", methods=["GET"])
def list_products():
    """
    Public catalog listing with filters, search & sort.
    Query params: q, color, finish, material, application, category, min_price,
    max_price, availability(in_stock/all), sort(newest/popular/alphabetical),
    page, per_page
    """
    query = Product.query.filter_by(is_active=True, approval_status="approved")

    q = request.args.get("q")
    if q:
        like = f"%{q}%"
        query = query.filter(or_(
            Product.name.ilike(like),
            Product.color.ilike(like),
            Product.product_code.ilike(like),
            Product.description.ilike(like),
        ))

    if color := request.args.get("color"):
        query = query.filter(Product.color.ilike(f"%{color}%"))
    if finish := request.args.get("finish"):
        query = query.filter(Product.finish.ilike(f"%{finish}%"))
    if material := request.args.get("material"):
        query = query.filter(Product.material.ilike(f"%{material}%"))
    if application := request.args.get("application"):
        query = query.filter(Product.applications.ilike(f"%{application}%"))
    if category := request.args.get("category"):
        query = query.join(Category).filter(Category.slug == category)
    if thickness := request.args.get("thickness"):
        query = query.filter(Product.thickness_mm == float(thickness))

    if request.args.get("availability") == "in_stock":
        query = query.filter(Product.available_quantity_sqft > 0)

    if min_price := request.args.get("min_price"):
        query = query.filter(Product.price_per_sqft >= float(min_price))
    if max_price := request.args.get("max_price"):
        query = query.filter(Product.price_per_sqft <= float(max_price))

    sort = request.args.get("sort", "newest")
    if sort == "popular":
        query = query.order_by(Product.view_count.desc())
    elif sort == "alphabetical":
        query = query.order_by(Product.name.asc())
    else:
        query = query.order_by(Product.created_at.desc())

    page = int(request.args.get("page", 1))
    per_page = min(int(request.args.get("per_page", 12)), 50)
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "products": [p.to_dict() for p in pagination.items],
        "total": pagination.total,
        "page": page,
        "pages": pagination.pages,
    }), 200


@products_bp.route("/<slug>", methods=["GET"])
def get_product(slug):
    product = Product.query.filter_by(slug=slug).first()
    if not product:
        return jsonify({"error": "Product not found"}), 404
    product.view_count = (product.view_count or 0) + 1
    db.session.commit()

    related = (Product.query
               .filter(Product.category_id == product.category_id, Product.id != product.id,
                       Product.is_active == True)
               .limit(4).all())

    return jsonify({
        "product": product.to_dict(detailed=True),
        "related_products": [p.to_dict() for p in related],
    }), 200


@products_bp.route("", methods=["POST"])
@roles_required(*FACTORY_ROLES)
def create_product():
    data = request.get_json(force=True) or {}
    name = (data.get("name") or "").strip()
    if not name:
        return jsonify({"error": "name is required"}), 400

    slug = unique_slug(name, lambda s: Product.query.filter_by(slug=s).first() is not None)
    code = data.get("product_code") or generate_product_code()
    while Product.query.filter_by(product_code=code).first():
        code = generate_product_code()

    product = Product(
        name=name, slug=slug, product_code=code,
        category_id=data.get("category_id"),
        material=data.get("material", "Granite"),
        color=data.get("color"), finish=data.get("finish"), origin=data.get("origin"),
        thickness_mm=data.get("thickness_mm"), length_mm=data.get("length_mm"),
        width_mm=data.get("width_mm"), weight_kg_per_sqft=data.get("weight_kg_per_sqft"),
        description=data.get("description"),
        applications=",".join(data.get("applications", [])) if isinstance(data.get("applications"), list) else data.get("applications"),
        price_per_sqft=data.get("price_per_sqft"),
        show_price_publicly=data.get("show_price_publicly", False),
        available_quantity_sqft=data.get("available_quantity_sqft", 0),
        minimum_order_sqft=data.get("minimum_order_sqft", 50),
        is_featured=data.get("is_featured", False),
        approval_status="approved",
    )
    db.session.add(product)
    db.session.flush()

    for i, url in enumerate(data.get("images", [])):
        db.session.add(ProductImage(product_id=product.id, url=url, is_primary=(i == 0), sort_order=i))

    db.session.commit()
    return jsonify({"product": product.to_dict(detailed=True)}), 201


@products_bp.route("/<int:product_id>", methods=["PUT"])
@roles_required(*FACTORY_ROLES)
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.get_json(force=True) or {}

    fields = [
        "name", "color", "finish", "origin", "material", "description",
        "thickness_mm", "length_mm", "width_mm", "weight_kg_per_sqft",
        "price_per_sqft", "show_price_publicly", "available_quantity_sqft",
        "minimum_order_sqft", "is_featured", "is_active", "category_id",
        "brochure_url", "video_url",
    ]
    for f in fields:
        if f in data:
            setattr(product, f, data[f])
    if "applications" in data:
        apps = data["applications"]
        product.applications = ",".join(apps) if isinstance(apps, list) else apps

    if "images" in data:
        ProductImage.query.filter_by(product_id=product.id).delete()
        for i, url in enumerate(data["images"]):
            db.session.add(ProductImage(product_id=product.id, url=url, is_primary=(i == 0), sort_order=i))

    db.session.commit()
    return jsonify({"product": product.to_dict(detailed=True)}), 200


@products_bp.route("/<int:product_id>", methods=["DELETE"])
@roles_required(*FACTORY_ROLES)
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted"}), 200


@products_bp.route("/bulk-import", methods=["POST"])
@roles_required(*FACTORY_ROLES)
def bulk_import():
    """Accepts a JSON array of product objects (CSV import is parsed client-side to JSON)."""
    data = request.get_json(force=True) or {}
    items = data.get("products", [])
    created = 0
    errors = []
    for row in items:
        name = (row.get("name") or "").strip()
        if not name:
            errors.append({"row": row, "error": "missing name"})
            continue
        slug = unique_slug(name, lambda s: Product.query.filter_by(slug=s).first() is not None)
        code = row.get("product_code") or generate_product_code()
        product = Product(
            name=name, slug=slug, product_code=code,
            color=row.get("color"), finish=row.get("finish"), origin=row.get("origin"),
            thickness_mm=row.get("thickness_mm"),
            price_per_sqft=row.get("price_per_sqft"),
            available_quantity_sqft=row.get("available_quantity_sqft", 0),
            description=row.get("description"),
        )
        db.session.add(product)
        created += 1
    db.session.commit()
    return jsonify({"created": created, "errors": errors}), 201
