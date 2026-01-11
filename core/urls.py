# core/urls.py
from django.urls import path
from .views_r2 import r2_presign_upload

urlpatterns = [
    path("r2/presign-upload/", r2_presign_upload, name="r2-presign-upload"),
]
