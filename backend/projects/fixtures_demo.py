from projects.models import Project

seed = [
    dict(title="Rode Coffee", slug="rode-coffee", description="Marque café premium.", url="https://example.com", tags="coffee,brand", featured=True),
    dict(title="Scorefy", slug="scorefy", description="SaaS réputation financière.", url="https://example.com", tags="saas,finance", featured=False),
]

for data in seed:
    Project.objects.update_or_create(slug=data["slug"], defaults=data)
print("OK: fixtures")
