from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from parts.api import PartAdminViewSet, PartColorAdminViewSet
from sets.api import ThemeAdminViewSet, SetAdminViewSet
from accounts.api import me

router = DefaultRouter()
router.register("admin/parts", PartAdminViewSet, basename="admin-parts")
router.register("admin/part-colors", PartColorAdminViewSet, basename="admin-part-colors")
router.register("admin/themes", ThemeAdminViewSet, basename="admin-themes")
router.register("admin/sets", SetAdminViewSet, basename="admin-sets")

urlpatterns = [
    # JWT auth endpoints (THIS FIXES YOUR 404)
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # your endpoints
    path("api/me/", me),
    path("api/", include(router.urls)),
]
