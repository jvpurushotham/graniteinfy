import re
import random
import string


def slugify(text):
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    return text.strip("-")


def unique_slug(base_text, existing_check_fn):
    """existing_check_fn(slug) -> bool, returns True if slug already taken"""
    slug = slugify(base_text)
    candidate = slug
    counter = 1
    while existing_check_fn(candidate):
        candidate = f"{slug}-{counter}"
        counter += 1
    return candidate


def generate_product_code(prefix="GRN"):
    suffix = "".join(random.choices(string.digits, k=5))
    return f"{prefix}-{suffix}"


def is_valid_email(email):
    return bool(re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email or ""))
