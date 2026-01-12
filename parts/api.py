from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import Part, PartColor, Color
from .serializers import PartSerializer, PartColorSerializer, ColorSerializer

class PartAdminViewSet(viewsets.ModelViewSet):
    queryset = Part.objects.all().order_by("part_id")
    serializer_class = PartSerializer
    permission_classes = [IsAdminUser]

class PartColorAdminViewSet(viewsets.ModelViewSet):
    queryset = PartColor.objects.select_related("part").all()
    serializer_class = PartColorSerializer
    permission_classes = [IsAdminUser]

class ColorAdminViewSet(viewsets.ModelViewSet):
    queryset = Color.objects.all().order_by("lego_id", "name")
    serializer_class = ColorSerializer
    permission_classes = [IsAdminUser]
