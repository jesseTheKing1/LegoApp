from django.db import models

class Theme(models.Model):
    name = models.CharField(max_length=50, unique=True)
    image_url = models.URLField(blank=True)

    def __str__(self):
        return self.name


class Set(models.Model):
    number = models.CharField(max_length=50, unique=True)    # set number like "75218"
    set_name = models.CharField(max_length=120)
    image_url = models.URLField(blank=True)
    age = models.CharField(max_length=50, blank=True)
    theme = models.ForeignKey(Theme, on_delete=models.CASCADE, related_name="sets")
    piece_count = models.PositiveIntegerField(default=0)

    # Many-to-many to PartColor THROUGH a line-item model (qty, etc.)
    parts = models.ManyToManyField(
        "parts.PartColor",
        through="SetPart",
        related_name="sets",
    )

    def __str__(self):
        return f"{self.number} - {self.set_name}"


class SetPart(models.Model):
    """
    One instruction line: this set needs X of a specific PartColor.
    """
    set = models.ForeignKey(Set, on_delete=models.CASCADE)
    part_color = models.ForeignKey("parts.PartColor", on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ("set", "part_color")
