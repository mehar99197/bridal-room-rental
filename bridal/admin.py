from django.contrib import admin
from .models import BridalRoom, BridalDress, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "description"]
    search_fields = ["name"]


@admin.register(BridalRoom)
class BridalRoomAdmin(admin.ModelAdmin):
    list_display = ["room_number", "name", "status", "capacity", "price_per_hour", "location"]
    list_filter = ["status"]
    search_fields = ["room_number", "name", "location"]
    list_editable = ["status"]


@admin.register(BridalDress)
class BridalDressAdmin(admin.ModelAdmin):
    list_display = ["dress_number", "name", "category", "size", "color", "status", "rental_price_per_day"]
    list_filter = ["status", "category", "size"]
    search_fields = ["dress_number", "name", "color"]
    list_editable = ["status"]
