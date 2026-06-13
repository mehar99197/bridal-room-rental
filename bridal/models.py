from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class BridalRoom(models.Model):
    STATUS_CHOICES = [
        ("available", "Available"),
        ("booked", "Booked"),
        ("maintenance", "Maintenance"),
    ]

    room_number = models.CharField(max_length=20, unique=True, blank=True, null=True, help_text="Room number/identifier")
    name = models.CharField(max_length=200)
    description = models.TextField()
    capacity = models.IntegerField(help_text="Maximum number of guests")
    price_per_hour = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=255)
    amenities = models.TextField(blank=True, help_text="Comma separated amenities")
    image = models.ImageField(upload_to="rooms/", blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="available")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        num = f"{self.room_number} - " if self.room_number else ""
        return f"{num}{self.name}"


class BridalDress(models.Model):
    STATUS_CHOICES = [
        ("available", "Available"),
        ("rented", "Rented"),
        ("maintenance", "Maintenance"),
    ]
    SIZE_CHOICES = [(str(i), str(i)) for i in range(2, 16)]

    dress_number = models.CharField(max_length=20, unique=True, blank=True, null=True, help_text="Dress number/identifier")
    name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="dresses")
    size = models.CharField(max_length=10, choices=SIZE_CHOICES)
    color = models.CharField(max_length=50)
    rental_price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    deposit_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    image = models.ImageField(upload_to="dresses/", blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="available")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        num = f"{self.dress_number} - " if self.dress_number else ""
        return f"{num}{self.name} ({self.size})"
