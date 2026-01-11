# parts/serializers.py
from rest_framework import serializers
from .models import Part, PartColor

class PartSerializer(serializers.ModelSerializer):
    thumb_url = serializers.SerializerMethodField()

    class Meta:
        model = Part
        fields = ["id", "part_id", "name", "general_category", "specific_category", "thumb_url"]

    def get_thumb_url(self, obj: Part):
        # pick any PartColor with an image
        pc = (
            obj.partcolor_set
              .filter(image_url_1__isnull=False)
              .exclude(image_url_1="")
              .first()
        )
        if pc and pc.image_url_1:
            return pc.image_url_1

        pc2 = (
            obj.partcolor_set
              .filter(image_url_2__isnull=False)
              .exclude(image_url_2="")
              .first()
        )
        return pc2.image_url_2 if pc2 else None


class PartColorSerializer(serializers.ModelSerializer):
    part = PartSerializer(read_only=True)
    part_id = serializers.PrimaryKeyRelatedField(queryset=Part.objects.all(), source="part", write_only=True)

    thumb_url = serializers.SerializerMethodField()

    class Meta:
        model = PartColor
        fields = ["id", "part", "part_id", "color_name", "variant", "image_url_1", "image_url_2", "thumb_url"]

    def get_thumb_url(self, obj: PartColor):
        return obj.image_url_1 or obj.image_url_2 or None
