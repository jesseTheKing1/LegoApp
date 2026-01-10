from django.urls import path, include
from rest_framework.routers import DefaultRouter
from parts.api import PartAdminViewSet, PartColorAdminViewSet
from sets.api import ThemeAdminViewSet, SetAdminViewSet
from accounts.api import me


router = DefaultRouter()
router.register("admin/parts", PartAdminViewSet, basename="admin-parts")
router.register("admin/part-colors", PartColorAdminViewSet, basename="admin-part-colors")
router.register("admin/themes", ThemeAdminViewSet, basename="admin-themes")
router.register("admin/sets", SetAdminViewSet, basename="admin-sets")

urlpatterns = [
    path("api/", include(router.urls)),
    path("api/me/", me),
]
