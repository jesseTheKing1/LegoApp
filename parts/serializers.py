# parts/serializers.py
from rest_framework import serializers
from .models import Part, PartColor

class PartSerializer(serializers.ModelSerializer):
    thumb_url = serializers.SerializerMethodField()

    class Meta:
        model = Part
        fields = ["id", "part_id", "name", "general_category", "specific_category", "thumb_url"]

    def get_thumb_url(self, obj):
        # safest: query PartColor table directly
        pc = (
            PartColor.objects
            .filter(part=obj)
            .exclude(image_url_1__isnull=True)
            .exclude(image_url_1="")
            .only("image_url_1")
            .first()
        )
        return pc.image_url_1 if pc else None

class PartColorSerializer(serializers.ModelSerializer):
    part = PartSerializer(read_only=True)
    part_id = serializers.PrimaryKeyRelatedField(queryset=Part.objects.all(), source="part", write_only=True)

    thumb_url = serializers.SerializerMethodField()

    class Meta:
        model = PartColor
        fields = ["id", "part", "part_id", "color_name", "variant", "image_url_1", "image_url_2", "thumb_url"]

    def get_thumb_url(self, obj: PartColor):
        return obj.image_url_1 or obj.image_url_2 or None
