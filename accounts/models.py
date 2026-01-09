from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Keep it minimal now. Add fields later.
    # Example future fields:
    # phone = models.CharField(max_length=30, blank=True)
    pass
