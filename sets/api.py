from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import Set, Theme
from .serializers import SetSerializer, ThemeSerializer

class ThemeAdminViewSet(viewsets.ModelViewSet):
    queryset = Theme.objects.all().order_by("name")
    serializer_class = ThemeSerializer
    permission_classes = [IsAdminUser]

class SetAdminViewSet(viewsets.ModelViewSet):
    queryset = Set.objects.all().order_by("number")
    serializer_class = SetSerializer
    permission_classes = [IsAdminUser]
