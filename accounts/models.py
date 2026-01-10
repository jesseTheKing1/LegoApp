from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Single favorite theme (simple)
    favorite_theme = models.ForeignKey(
        "sets.Theme",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="favorited_as_top_by",
    )

    # Optional: allow multiple favorites too (comment in if you want)
    favorite_themes = models.ManyToManyField(
        "sets.Theme",
        blank=True,
        related_name="favorited_by_users",
    )

    def __str__(self):
        return self.username
