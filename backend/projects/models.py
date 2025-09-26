from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    url = models.URLField(blank=True)
    image = models.ImageField(upload_to="projects/", blank=True, null=True)
    tags = models.CharField(max_length=250, blank=True, help_text="séparés par des virgules")
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
