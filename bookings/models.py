from django.db import models
from django.conf import settings


class Booking(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("active", "Active"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bookings")
    room = models.ForeignKey("bridal.BridalRoom", on_delete=models.SET_NULL, null=True, blank=True, related_name="bookings")
    dress = models.ForeignKey("bridal.BridalDress", on_delete=models.SET_NULL, null=True, blank=True, related_name="bookings")
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.start_date.date()}"
