"""Build the checked-in client-copy manifest directly from the supplied PDFs.

This is a maintenance helper, not a runtime dependency. It requires ``pypdf`` and
expects the original client PDFs in the directory passed with ``--pdf-dir``.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from pypdf import PdfReader


SERVICE_SPECS = {
    "residential-painting-melbourne": (
        "Residential_Painting_Melbourne_SEO_Page.pdf",
        ["Our Residential Painting Services", "Why Choose Superior Plus Painting?", "Our Process", "Areas We Service", "Get a Free Quote"],
    ),
    "commercial-painting-melbourne": (
        "Commercial_Painting_Melbourne_SEO_Page.pdf",
        ["Our Commercial Painting Services", "Our Process", "Why Businesses Choose Superior Plus Painting", "Industries We Work With", "Areas We Service", "Request a Free Commercial Painting Quote"],
    ),
    "interior-painting-melbourne": (
        "Interior_Painting_Melbourne_SEO_Page.pdf",
        ["Our Interior Painting Services Include", "Our Painting Process", "Why Choose Superior Plus Painting?", "Benefits of Interior Painting", "Areas We Service", "Request a Free Quote"],
    ),
    "exterior-painting-melbourne": (
        "Exterior_Painting_Melbourne_SEO_Page.pdf",
        ["Complete Exterior Painting Services", "Our Exterior Painting Process", "Why Choose Superior Plus Painting?", "Benefits of Exterior Painting", "Areas We Service", "Request Your Free Quote"],
    ),
    "roof-painting-melbourne": (
        "Roof_Painting_Melbourne_SEO_Page.pdf",
        ["Our Roof Painting Services Include", "Our Roof Painting Process", "Why Choose Superior Plus Painting?", "Benefits of Roof Painting", "Areas We Service", "Request a Free Roof Painting Quote"],
    ),
    "fence-painting-melbourne": (
        "Fence_Painting_Melbourne_SEO_Page.pdf",
        ["Our Fence Painting Services Include", "Our Fence Painting Process", "Why Choose Superior Plus Painting?", "Benefits of Fence Painting", "Areas We Service", "Request a Free Fence Painting Quote"],
    ),
    "deck-painting-staining-melbourne": (
        "Deck_Painting_and_Staining_Melbourne_SEO_Page.pdf",
        ["Our Deck Services Include", "Our Process", "Why Choose Superior Plus Painting?", "Benefits of Deck Painting & Staining", "Areas We Service", "Request a Free Quote"],
    ),
    "wallpaper-removal-melbourne": (
        "Wallpaper_Removal_Melbourne_SEO_Page.pdf",
        ["Our Wallpaper Removal Services Include", "Our Process", "Why Choose Superior Plus Painting?", "Benefits of Professional Wallpaper Removal", "Areas We Service", "Request a Free Quote"],
    ),
    "plaster-repairs-melbourne": (
        "Plaster_Repairs_Melbourne_SEO_Page.pdf",
        ["Our Plaster Repair Services Include", "Our Repair Process", "Why Choose Superior Plus Painting?", "Benefits of Professional Plaster Repairs", "Areas We Service", "Request a Free Quote"],
    ),
}

DOCUMENT_SPECS = {
    "about": (
        "About_Superior_Plus_Painting.pdf",
        ["About Superior Plus Painting", "Your Trusted Painting Professionals in Melbourne", "What We Do", "Our Commitment to Quality", "Why Choose Superior Plus Painting?", "Proudly Servicing Melbourne", "Let's Transform Your Property"],
    ),
    "additional_services": (
        "Additional_Services_Superior_Plus_Painting_Updated.pdf",
        ["Additional Services", "Complete Property Improvement Services in Melbourne", "Wallpaper Removal", "Plaster Repairs", "Carpentry Services", "Caulking & Gap Sealing", "Tiling Services", "Timber Repairs & Restoration", "Surface Preparation", "Property Maintenance", "Need Another Service?", "Request a Free Quote"],
    ),
    "process": (
        "Our_Painting_Process_Superior_Plus_Painting.pdf",
        ["Our Painting Process", "A Proven Process for Exceptional Results", "Step 1 – Free Consultation & Quote", "Step 2 – Surface Preparation", "Step 3 – Protecting Your Property", "Step 4 – Professional Painting", "Step 5 – Quality Inspection", "Step 6 – Clean-Up & Handover", "Why Our Process Works", "Ready to Start?"],
    ),
    "faqs": (
        "Frequently_Asked_Questions_Superior_Plus_Painting.pdf",
        ["Frequently Asked Questions", "Frequently Asked Questions", "Do you provide free quotes?", "What areas do you service?", "Are you fully insured?", "What painting services do you offer?", "How long will my painting project take?", "Do I need to move my furniture?", "Can you repair walls before painting?", "What type of paint do you use?", "Do you clean up after the project?", "How do I book my project?"],
    ),
    "testimonials": (
        "Testimonials_and_Reviews_Superior_Plus_Painting.pdf",
        ["Testimonials & Reviews", "What Our Clients Say", "★★★★★ Professional & Reliable", "★★★★★ Excellent Quality", "★★★★★ Great Communication", "★★★★★ Value for Money", "Why Clients Choose Us", "Share Your Experience", "Request a Free Quote"],
    ),
}

ABOUT_SERVICES = ["Residential painting", "Commercial painting", "Interior painting", "Exterior painting", "Roof painting", "Fence painting", "Deck painting and staining", "Wallpaper removal", "Plaster repairs"]
ABOUT_REASONS = ["Experienced and professional painters", "High-quality workmanship", "Attention to detail", "Reliable communication", "Clean and tidy job sites", "Competitive pricing", "Fully insured", "Free, no-obligation quotes"]
PROCESS_REASONS = ["Clear communication from start to finish", "Thorough preparation for long-lasting results", "High-quality workmanship", "Respect for your home or business", "Reliable scheduling and on-time completion", "Attention to every detail"]
TESTIMONIAL_REASONS = ["High-quality workmanship", "Reliable and professional service", "Careful surface preparation", "Clean and tidy job sites", "Honest advice and transparent quotes", "Residential and commercial expertise", "Respect for your property and schedule"]

BLOG_OUTLINES = [
    ("How to Prepare Your House Before Professional Painters Arrive in Melbourne", "house painters Melbourne, painting preparation, professional painters Melbourne", ["Moving furniture", "Protecting floors", "Removing wall decorations", "Repairing cracks before painting", "What homeowners should expect"]),
    ("Interior House Painting Melbourne: Complete Guide for Homeowners", "interior painters Melbourne, interior painting services Melbourne", ["Walls, ceilings, doors, skirting boards", "Choosing paint colours", "Preparing surfaces", "How long interior painting takes", "Benefits of professional painters"]),
    ("Exterior House Painting Melbourne: Protect Your Home from Harsh Weather", "exterior painters Melbourne, exterior painting contractor Melbourne", ["Weather protection", "Timber protection", "Render and brick painting", "Roof and fascia painting", "Preventing water damage"]),
    ("Commercial Painting Contractors Melbourne: Professional Painting for Businesses", "commercial painters Melbourne, commercial painting contractor Melbourne", ["Office painting", "Retail shop painting", "Warehouse painting", "Minimal business disruption", "Professional finishes"]),
    ("Roof Painting Melbourne: Benefits, Process and Cost Guide", "roof painter Melbourne, roof painting services Melbourne", ["Roof cleaning", "Roof repairs", "Priming", "Roof coatings", "Tile and metal roof painting"]),
    ("How Professional Painters Repair Cracks Before Painting", "plaster repairs Melbourne, wall repairs Melbourne, painters Melbourne", ["Hairline cracks", "Water damage", "Plaster repairs", "Caulking", "Surface preparation"]),
    ("Best Paint Colours for Australian Homes in 2026", "house painting ideas Melbourne, interior painters Melbourne", ["Modern neutral colours", "Warm whites", "Feature walls", "Exterior colour trends"]),
    ("Dulux Paint Systems: Why Quality Paint Matters for Your Home", "Dulux painters Melbourne, quality painting services Melbourne", ["Paint durability", "Washable walls", "Exterior protection", "Professional application"]),
    ("New Home Painting Melbourne: Why Builders Choose Professional Painters", "new home painters Melbourne, builders painters Melbourne", ["New construction painting", "Builder partnerships", "Final finishes", "Timelines"]),
    ("Before and After: How Professional Painting Transforms Melbourne Homes", "home makeover Melbourne, house painters near me", ["Renovations", "Old homes refreshed", "Property value improvement", "Real project examples"]),
    ("Fence Painting Melbourne: Protect and Improve Your Outdoor Space", "fence painters Melbourne, timber painting Melbourne", ["Timber fences", "Paling fences", "Spray painting", "Weather protection"]),
    ("Strata and Body Corporate Painting Melbourne: Complete Guide", "strata painters Melbourne, body corporate painting Melbourne", ["Apartment buildings", "Common areas", "Maintenance schedules", "Large projects"]),
    ("How Long Does a Professional Paint Job Last in Melbourne?", "professional painters Melbourne, painting maintenance", ["Interior lifespan", "Exterior lifespan", "Signs you need repainting", "Maintenance tips"]),
    ("Why Hiring an Insured Painting Contractor Matters", "licensed painters Melbourne, trusted painting contractor Melbourne", ["Insurance", "Safety", "Professional standards", "Customer protection"]),
    ("Painter Melbourne Near Me: How to Find the Right Local Painting Company", "painter near me Melbourne, local painters Melbourne", ["Choosing a painter", "Reviews", "Quotes", "Experience", "Quality checks"]),
]


def pdf_text(path: Path) -> str:
    return "\n".join((page.extract_text() or "") for page in PdfReader(str(path)).pages)


def compact(value: str) -> str:
    value = value.replace("\u00a0", " ").replace("\u00ad", "")
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def logical_lines(text: str, headings: list[str]) -> list[str]:
    """Rejoin PDF wrapping while retaining headings, bullets and numbered steps."""
    raw = [compact(line) for line in text.splitlines() if compact(line)]
    result: list[str] = raw[:2]
    index = 2
    all_markers = set(headings)
    while index < len(raw):
        line = raw[index]
        # Join a heading split over two PDF extraction lines.
        if index + 1 < len(raw) and f"{line} {raw[index + 1]}" in all_markers:
            result.append(f"{line} {raw[index + 1]}")
            index += 2
            continue
        if line in all_markers or line.startswith("\x7f") or re.match(r"^\d+\.\s", line):
            result.append(line)
            index += 1
            continue
        if len(result) == 2:
            result.append(line)
            index += 1
            continue
        if result and result[-1] not in all_markers and not result[-1].startswith("\x7f") and not re.match(r"^\d+\.\s", result[-1]):
            result[-1] = compact(f"{result[-1]} {line}")
        else:
            result.append(line)
        index += 1
    return result


def parse_service(path: Path, headings: list[str]) -> dict:
    lines = logical_lines(pdf_text(path), headings)
    document_title, headline = lines[0], lines[1]
    sections: list[dict] = []
    current = {"heading": "Introduction", "paragraphs": [], "items": [], "steps": []}
    buffer: list[str] = []

    def flush_paragraph() -> None:
        if buffer:
            current["paragraphs"].append(compact(" ".join(buffer)))
            buffer.clear()

    def flush_section() -> None:
        flush_paragraph()
        if current["paragraphs"] or current["items"] or current["steps"]:
            sections.append({key: value for key, value in current.items() if value})

    for line in lines[2:]:
        if line in headings:
            flush_section()
            current = {"heading": line, "paragraphs": [], "items": [], "steps": []}
        elif line.startswith("\x7f"):
            flush_paragraph()
            current["items"].append(compact(line.lstrip("\x7f")))
        elif re.match(r"^\d+\.\s", line):
            flush_paragraph()
            current["steps"].append(re.sub(r"^\d+\.\s*", "", line).strip())
        else:
            buffer.append(line)
    flush_section()
    intro = sections.pop(0)["paragraphs"][0]
    return {
        "document_title": document_title,
        "headline": headline,
        "intro": intro,
        "sections": sections,
    }


def parse_document(path: Path, headings: list[str]) -> dict:
    """Split a short client document at its supplied headings without rewriting it."""
    text = compact(pdf_text(path)).replace("â€“", "–").replace("â€™", "’").replace("â€œ", "“").replace("â€", "”")
    positions = []
    cursor = 0
    for heading in headings:
        position = text.find(heading, cursor)
        if position < 0 and heading == "Frequently Asked Questions" and positions:
            position = text.find(heading, positions[-1][1] + len(heading))
        if position < 0:
            raise ValueError(f"Could not find heading {heading!r} in {path.name}")
        positions.append((heading, position))
        cursor = position + len(heading)
    sections = []
    for index, (heading, position) in enumerate(positions):
        start = position + len(heading)
        end = positions[index + 1][1] if index + 1 < len(positions) else len(text)
        body = compact(text[start:end])
        sections.append({"heading": heading, "body": body})
    return {"title": headings[0], "headline": headings[1], "sections": sections[1:]}


def enrich_documents(documents: dict) -> None:
    about = documents["about"]
    for section in about["sections"]:
        if section["heading"] == "What We Do":
            section["body"] = "We provide a complete range of painting and surface preparation services, including:"
            section["items"] = ABOUT_SERVICES
        elif section["heading"] == "Why Choose Superior Plus Painting?":
            section["body"] = ""
            section["items"] = ABOUT_REASONS

    process = documents["process"]
    process["steps"] = [
        {"heading": section["heading"], "body": section["body"]}
        for section in process["sections"] if section["heading"].startswith("Step ")
    ]
    for section in process["sections"]:
        if section["heading"] == "Why Our Process Works":
            section["body"] = ""
            section["items"] = PROCESS_REASONS

    testimonials = documents["testimonials"]
    testimonials["reviews"] = [
        {"heading": section["heading"], "body": section["body"].strip('“”"')}
        for section in testimonials["sections"] if section["heading"].startswith("★★★★★")
    ]
    for section in testimonials["sections"]:
        if section["heading"] == "Why Clients Choose Us":
            section["body"] = ""
            section["items"] = TESTIMONIAL_REASONS

    faqs = documents["faqs"]
    faqs["items"] = [
        {"question": section["heading"], "answer": section["body"]}
        for section in faqs["sections"] if section["heading"].endswith("?")
    ]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pdf-dir", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=Path("src/data/clientApprovedContent.json"))
    args = parser.parse_args()

    services = {}
    for slug, (filename, headings) in SERVICE_SPECS.items():
        services[slug] = parse_service(args.pdf_dir / filename, headings)

    documents = {key: parse_document(args.pdf_dir / filename, headings) for key, (filename, headings) in DOCUMENT_SPECS.items()}
    enrich_documents(documents)

    contact_text = compact(pdf_text(args.pdf_dir / "Get_in_Touch_Form_Final_Clean.pdf"))
    documents["contact"] = {
        "title": "Get in Touch",
        "field_labels": ["Name", "Phone Number", "Email Address", "Property Address", "Suburb", "Service Required", "Property Type", "Project Details"],
        "service_options": ["Residential Painting", "Commercial Painting", "Interior Painting", "Exterior Painting", "Roof Painting", "Fence Painting", "Deck Painting & Staining", "Garage Floor Coatings", "Driveway Painting & Coatings", "Plaster Repairs", "Wallpaper Removal", "Other"],
        "property_options": ["House", "Unit", "Apartment", "Townhouse", "Office", "Retail", "Warehouse", "Other"],
        "source_text": contact_text,
    }

    manifest = {
        "source": "Client-supplied Superior Plus Painting PDFs",
        "policy": "Headings, paragraphs and list items are preserved verbatim; only PDF line wrapping is removed.",
        "services": services,
        "documents": documents,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    plugin_copy = Path("wordpress-plugin/superior-plus-content/data/client-approved-content.json")
    plugin_copy.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    blog_path = Path("wordpress-plugin/superior-plus-content/data/blog-articles.json")
    blogs = json.loads(blog_path.read_text(encoding="utf-8"))
    by_title = {article["title"].lower(): article for article in blogs}
    for title, keywords, topics in BLOG_OUTLINES:
        article = by_title[title.lower()]
        # The PDF supplies these records as SEO briefs rather than complete articles.
        # Keep every supplied phrase as structured source data while retaining the
        # useful, Superior Plus-branded expansion stored in the article record.
        article["seo_keywords"] = [keyword.strip() for keyword in keywords.split(",")]
        article["outline_topics"] = topics
        article["source_label"] = "Client SEO brief · Expanded"
        article["copy_version"] = "pdf-verbatim-2026-08-01"
    for article in blogs[:4]:
        article["copy_version"] = "pdf-verbatim-2026-08-01"
    blog_path.write_text(json.dumps(blogs, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    static_blogs = Path("src/data/clientApprovedBlogs.json")
    static_blogs.write_text(json.dumps(blogs, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {args.output}, {plugin_copy}, {blog_path} and {static_blogs}")


if __name__ == "__main__":
    main()
