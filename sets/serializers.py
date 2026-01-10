from rest_framework import serializers
from .models import Theme, Set, SetPart
from parts.serializers import PartColorSerializer
from parts.models import PartColor


class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = ["id", "name", "image_url"]


class SetPartSerializer(serializers.ModelSerializer):
    # Read-only detailed part_color
    part_color = PartColorSerializer(read_only=True)

    # Write-only id to connect the part_color
    part_color_id = serializers.PrimaryKeyRelatedField(
        queryset=PartColor.objects.all(),
        source="part_color",
        write_only=True,
    )

    class Meta:
        model = SetPart
        fields = ["id", "part_color", "part_color_id", "quantity"]


class SetSerializer(serializers.ModelSerializer):
    theme = ThemeSerializer(read_only=True)
    theme_id = serializers.PrimaryKeyRelatedField(
        queryset=Theme.objects.all(),
        source="theme",
        write_only=True,
    )

    # This will serialize the through-model rows
    parts_detail = SetPartSerializer(source="setpart_set", many=True, read_only=True)

    class Meta:
        model = Set
        fields = [
            "id",
            "number",
            "set_name",
            "image_url",
            "age",
            "piece_count",
            "theme",        # read
            "theme_id",     # write
            "parts_detail", # read the parts+qty list
        ]
