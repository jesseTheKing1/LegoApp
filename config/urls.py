from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from parts.api import PartAdminViewSet, PartColorAdminViewSet, ColorAdminViewSet
from sets.api import ThemeAdminViewSet, SetAdminViewSet
from accounts.api import me

router = DefaultRouter()
router.register("admin/parts", PartAdminViewSet, basename="admin-parts")
router.register("admin/part-colors", PartColorAdminViewSet, basename="admin-part-colors")
router.register("admin/themes", ThemeAdminViewSet, basename="admin-themes")
router.register("admin/sets", SetAdminViewSet, basename="admin-sets")
router.register("admin/colors/", ColorAdminViewSet, basename="admin-colors")
urlpatterns = [
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    path("api/me/", me),
    path("api/", include(router.urls)),
    path("api/", include("core.urls")),
]

