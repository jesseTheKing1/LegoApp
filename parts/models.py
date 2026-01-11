from django.db import models

class Part(models.Model):
    part_id = models.CharField(max_length=50, unique=True)   # shape id (e.g., "3001")
    name = models.CharField(max_length=120)
    general_category = models.CharField(max_length=80, blank=True)
    specific_category = models.CharField(max_length=80, blank=True)

    def __str__(self):
        return f"{self.part_id} - {self.name}"


class PartColor(models.Model):
    # This is the “instruction line item identity”: shape + color (+ optional variant like decal)
    part = models.ForeignKey(Part, on_delete=models.CASCADE, related_name="colors")
    color_name = models.CharField(max_length=50)
    color_hex = models.CharField(max_length=7, blank=True)  # optional
    variant = models.CharField(max_length=50, blank=True, default="")  # decal/print/etc
    part_number = models.CharField(max_length=50, blank=True)  # if you have a specific combined id

    image_url_1 = models.URLField(blank=True, null=True)
    image_url_2 = models.URLField(blank=True, null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["part", "color_name", "variant"],
                name="uniq_part_color_variant"
            )
        ]

    def __str__(self):
        v = f" ({self.variant})" if self.variant else ""
        return f"{self.part.part_id} - {self.color_name}{v}"
