from rest_framework import serializers
from .models import Part, PartColor, Color

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ["id", "lego_id", "name", "hex", "is_transparent", "is_metallic"]

class PartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Part
        fields = [
            "id",
            "part_id",
            "name",
            "general_category",
            "specific_category",
            "image_url_1", 
        ]

class PartColorSerializer(serializers.ModelSerializer):
    part = PartSerializer(read_only=True)
    part_id = serializers.PrimaryKeyRelatedField(queryset=Part.objects.all(), source="part", write_only=True)

    thumb_url = serializers.SerializerMethodField()

    class Meta:
        model = PartColor
        fields = ["id", "part", "part_id", "color_name", "variant", "image_url_1", "image_url_2", "thumb_url"]

    def get_thumb_url(self, obj: PartColor):
        return obj.image_url_1 or obj.image_url_2 or None
