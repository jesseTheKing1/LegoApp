from rest_framework import serializers
from .models import Part, PartColor


class PartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Part
        fields = ["id", "part_id", "name", "general_category", "specific_category"]


class PartColorSerializer(serializers.ModelSerializer):
    # Read-only nested part details when fetching
    part = PartSerializer(read_only=True)

    # Write-only way to attach a Part by id on create/update
    part_id = serializers.PrimaryKeyRelatedField(
        queryset=Part.objects.all(),
        source="part",
        write_only=True,
    )

    class Meta:
        model = PartColor
        fields = [
            "id",
            "part",       # read
            "part_id",    # write
            "color_name",
            "variant",
            "image_url_1",
            "image_url_2",
        ]
