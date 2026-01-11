# parts/serializers.py
from rest_framework import serializers
from .models import Part, PartColor, Color

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ["id", "lego_id", "name", "hex", "is_transparent", "is_metallic"]

class PartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Part
        fields = ["id", "part_id", "name", "general_category", "specific_category"]

class PartColorSerializer(serializers.ModelSerializer):
    part = PartSerializer(read_only=True)
    part_id = serializers.PrimaryKeyRelatedField(
        queryset=Part.objects.all(),
        source="part",
        write_only=True,
    )

    color = ColorSerializer(read_only=True)
    color_id = serializers.PrimaryKeyRelatedField(
        queryset=Color.objects.all(),
        source="color",
        write_only=True,
    )

    class Meta:
        model = PartColor
        fields = [
            "id",
            "part",
            "part_id",
            "color",
            "color_id",
            "variant",
            "part_number",
            "image_url_1",
            "image_url_2",
        ]

