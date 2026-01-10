from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import Part, PartColor
from .serializers import PartSerializer, PartColorSerializer

class PartAdminViewSet(viewsets.ModelViewSet):
    queryset = Part.objects.all().order_by("part_id")
    serializer_class = PartSerializer
    permission_classes = [IsAdminUser]

class PartColorAdminViewSet(viewsets.ModelViewSet):
    queryset = PartColor.objects.select_related("part").all()
    serializer_class = PartColorSerializer
    permission_classes = [IsAdminUser]
