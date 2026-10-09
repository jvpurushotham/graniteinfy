from flask import Blueprint, request, jsonify
from extensions import db
from models import Project, Testimonial
from middleware.auth import roles_required, FACTORY_ROLES

content_bp = Blueprint("content", __name__, url_prefix="/api")


@content_bp.route("/projects", methods=["GET"])
def list_projects():
    category = request.args.get("category")
    query = Project.query
    if category:
        query = query.filter_by(category=category)
    projects = query.order_by(Project.completion_date.desc()).all()
    return jsonify({"projects": [p.to_dict() for p in projects]}), 200


@content_bp.route("/projects", methods=["POST"])
@roles_required(*FACTORY_ROLES)
def create_project():
    data = request.get_json(force=True) or {}
    project = Project(
        title=data.get("title"), category=data.get("category"),
        location=data.get("location"), granite_used=data.get("granite_used"),
        area_sqft=data.get("area_sqft"), description=data.get("description"),
        image_url=data.get("image_url"),
    )
    db.session.add(project)
    db.session.commit()
    return jsonify({"project": project.to_dict()}), 201


@content_bp.route("/testimonials", methods=["GET"])
def list_testimonials():
    items = Testimonial.query.filter_by(is_published=True).order_by(Testimonial.created_at.desc()).all()
    return jsonify({"testimonials": [t.to_dict() for t in items]}), 200
