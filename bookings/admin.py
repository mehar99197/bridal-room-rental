from django.contrib import admin
from django.utils.html import format_html
from .models import Booking


@admin.action(description="Approve selected bookings")
def approve_bookings(modeladmin, request, queryset):
    updated = queryset.filter(status="pending").update(status="confirmed")
    modeladmin.message_user(request, f"{updated} booking(s) approved.")


@admin.action(description="Reject selected bookings")
def reject_bookings(modeladmin, request, queryset):
    updated = queryset.filter(status="pending").update(status="cancelled")
    modeladmin.message_user(request, f"{updated} booking(s) rejected.")


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "item_display", "booking_type", "start_date", "end_date", "colored_status", "total_price", "created_at"]
    list_filter = ["status", "created_at"]
    search_fields = ["user__email", "user__username", "room__name", "dress__name", "room__room_number", "dress__dress_number"]
    readonly_fields = ["created_at", "updated_at"]
    actions = [approve_bookings, reject_bookings]

    def item_display(self, obj):
        if obj.room:
            return f"{obj.room.room_number} - {obj.room.name}"
        if obj.dress:
            return f"{obj.dress.dress_number} - {obj.dress.name}"
        return "N/A"
    item_display.short_description = "Item"

    def booking_type(self, obj):
        if obj.room:
            return format_html('<span class="badge bg-info">Room</span>')
        if obj.dress:
            return format_html('<span class="badge bg-warning">Dress</span>')
        return "-"
    booking_type.short_description = "Type"

    def colored_status(self, obj):
        colors = {
            "pending": "warning",
            "confirmed": "success",
            "active": "info",
            "completed": "secondary",
            "cancelled": "danger",
        }
        return format_html(
            '<span class="badge bg-{}">{}</span>',
            colors.get(obj.status, "secondary"),
            obj.get_status_display(),
        )
    colored_status.short_description = "Status"
