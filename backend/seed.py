"""
Seeds the GraniteInfy database with sample users, categories, products, projects
and testimonials so the app is usable out of the box.

Run with:  python seed.py
"""
from datetime import date
from app import create_app
from extensions import db
from models import User, Category, Product, ProductImage, Project, Testimonial
from utils.helpers import slugify, generate_product_code

app = create_app()

# Free stock granite/stone imagery (Unsplash) used only as placeholder seed data.
SAMPLE_IMAGES = [
    "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800",
    "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
]

CATEGORIES = [
    ("Kitchen Countertops", "Premium slabs finished for countertop applications."),
    ("Flooring Slabs", "Large-format slabs and tiles for indoor/outdoor flooring."),
    ("Wall Cladding", "Textured and polished stone for feature walls."),
    ("Outdoor & Landscape", "Weather-resistant granite for patios and exteriors."),
]

PRODUCTS = [
    dict(name="Black Galaxy Premium", color="Black", finish="Polished", origin="Andhra Pradesh, India",
         thickness_mm=20, price_per_sqft=185, available_quantity_sqft=2400,
         applications=["Countertop", "Floor"], is_featured=True,
         description="A deep black granite speckled with golden-copper flecks, prized for luxury kitchen countertops."),
    dict(name="Kashmir White", color="White", finish="Polished", origin="Rajasthan, India",
         thickness_mm=18, price_per_sqft=140, available_quantity_sqft=1800,
         applications=["Countertop", "Wall"], is_featured=True,
         description="A soft white base with burgundy and grey veining, ideal for bright, elegant interiors."),
    dict(name="Tan Brown", color="Brown", finish="Honed", origin="Karimnagar, India",
         thickness_mm=20, price_per_sqft=95, available_quantity_sqft=3200,
         applications=["Floor", "Outdoor"],
         description="A warm brown granite with dark speckling, popular for flooring and outdoor paving."),
    dict(name="Steel Grey", color="Grey", finish="Flamed", origin="Karnataka, India",
         thickness_mm=30, price_per_sqft=75, available_quantity_sqft=90,
         applications=["Outdoor", "Wall"],
         description="A durable, slip-resistant grey granite finished for outdoor patios and pathways."),
    dict(name="Alaska White", color="White", finish="Leather", origin="Karnataka, India",
         thickness_mm=20, price_per_sqft=160, available_quantity_sqft=1200,
         applications=["Countertop", "Wall"],
         description="A luminous white-grey stone with a soft leathered texture for a matte luxury look."),
    dict(name="Absolute Black", color="Black", finish="Polished", origin="Karimnagar, India",
         thickness_mm=20, price_per_sqft=110, available_quantity_sqft=2600,
         applications=["Countertop", "Floor", "Wall"], is_featured=True,
         description="A uniform, jet-black granite that pairs well with virtually any interior palette."),
    dict(name="Ivory Brown", color="Brown", finish="Polished", origin="Andhra Pradesh, India",
         thickness_mm=18, price_per_sqft=88, available_quantity_sqft=1500,
         applications=["Countertop", "Floor"],
         description="A creamy brown backdrop with fine dark grain, versatile for kitchens and flooring."),
    dict(name="Colonial White", color="White", finish="Polished", origin="Andhra Pradesh, India",
         thickness_mm=20, price_per_sqft=102, available_quantity_sqft=45,
         applications=["Countertop", "Wall"],
         description="A classic light stone with subtle grey speckling, a dependable neutral choice."),
]

PROJECTS = [
    dict(title="Emerald Heights Residency", category="Residential", location="Hyderabad",
         granite_used="Black Galaxy Premium", area_sqft=12000, completion_date=date(2025, 3, 15),
         description="Full kitchen and flooring package across a 40-unit luxury residential complex."),
    dict(title="Grandview Business Tower", category="Commercial", location="Bengaluru",
         granite_used="Steel Grey", area_sqft=28000, completion_date=date(2024, 11, 2),
         description="Lobby flooring and exterior cladding for a 22-storey commercial tower."),
    dict(title="Silver Sands Resort", category="Hotels", location="Goa",
         granite_used="Kashmir White", area_sqft=9500, completion_date=date(2025, 6, 20),
         description="Poolside paving and lobby countertops for a beachfront resort renovation."),
]

TESTIMONIALS = [
    dict(name="Rohan Mehta", role="Interior Designer, Mumbai", rating=5,
         message="GraniteInfy's catalog made sourcing slabs for my clients dramatically faster — the spec sheets are excellent."),
    dict(name="Sunita Rao", role="Wholesale Dealer, Chennai", rating=5,
         message="Dealer pricing and the quote workflow have simplified our procurement process significantly."),
    dict(name="Arjun Kapoor", role="Builder, Pune", rating=4,
         message="Good range of finishes and reliable stock availability information."),
]


def run():
    with app.app_context():
        db.drop_all()
        db.create_all()

        # --- Users ---
        owner = User(name="Vikram Shah", email="owner@graniteinfy.com", role="factory_owner", is_verified=True)
        owner.set_password("Owner@123")

        manager = User(name="Priya Nair", email="manager@graniteinfy.com", role="factory_manager", is_verified=True)
        manager.set_password("Manager@123")

        sales = User(name="Karan Malhotra", email="sales@graniteinfy.com", role="sales_manager", is_verified=True)
        sales.set_password("Sales@123")

        retailer1 = User(name="Deepak Traders", email="retailer@graniteinfy.com", role="retailer",
                          is_verified=True, dealer_status="approved", company_name="Deepak Stone Traders",
                          business_address="MG Road, Bengaluru", dealer_discount_percent=12.5)
        retailer1.set_password("Retailer@123")

        retailer2 = User(name="Suresh Granite World", email="pending.retailer@graniteinfy.com", role="retailer",
                          dealer_status="pending", company_name="Granite World Pvt Ltd",
                          business_address="Anna Salai, Chennai")
        retailer2.set_password("Retailer@123")

        customer = User(name="Ananya Iyer", email="customer@graniteinfy.com", role="customer", is_verified=True)
        customer.set_password("Customer@123")

        db.session.add_all([owner, manager, sales, retailer1, retailer2, customer])
        db.session.commit()

        # --- Categories ---
        cat_objs = {}
        for name, desc in CATEGORIES:
            c = Category(name=name, slug=slugify(name), description=desc)
            db.session.add(c)
            cat_objs[name] = c
        db.session.commit()

        cat_cycle = list(cat_objs.values())

        # --- Products ---
        for i, p in enumerate(PRODUCTS):
            product = Product(
                name=p["name"],
                slug=slugify(p["name"]),
                product_code=generate_product_code(),
                category_id=cat_cycle[i % len(cat_cycle)].id,
                color=p["color"], finish=p["finish"], origin=p["origin"],
                thickness_mm=p["thickness_mm"], length_mm=3000, width_mm=1800,
                weight_kg_per_sqft=17.5,
                description=p["description"],
                applications=",".join(p["applications"]),
                price_per_sqft=p["price_per_sqft"], show_price_publicly=True,
                available_quantity_sqft=p["available_quantity_sqft"],
                minimum_order_sqft=50,
                is_featured=p.get("is_featured", False),
                view_count=(50 - i * 3) if (50 - i * 3) > 0 else 5,
            )
            db.session.add(product)
            db.session.flush()
            for j, img in enumerate(SAMPLE_IMAGES):
                db.session.add(ProductImage(product_id=product.id, url=img, is_primary=(j == 0), sort_order=j))
        db.session.commit()

        # --- Projects ---
        for p in PROJECTS:
            db.session.add(Project(**p))
        db.session.commit()

        # --- Testimonials ---
        for t in TESTIMONIALS:
            db.session.add(Testimonial(**t))
        db.session.commit()

        print("Database seeded successfully.")
        print("\nSample login credentials:")
        print("  Factory Owner   -> owner@graniteinfy.com / Owner@123")
        print("  Factory Manager -> manager@graniteinfy.com / Manager@123")
        print("  Sales Manager   -> sales@graniteinfy.com / Sales@123")
        print("  Retailer        -> retailer@graniteinfy.com / Retailer@123")
        print("  Customer        -> customer@graniteinfy.com / Customer@123")


if __name__ == "__main__":
    run()
