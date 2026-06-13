from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


class CustomUserAdmin(UserAdmin):
    list_display = ["email", "username", "phone", "is_staff", "is_superuser", "is_verified", "date_joined"]
    list_filter = ["is_staff", "is_superuser", "is_verified", "is_active"]
    search_fields = ["email", "username", "phone"]
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal info", {"fields": ("username", "phone", "address")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "is_verified", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "username", "phone", "password1", "password2"),
        }),
    )


admin.site.register(User, CustomUserAdmin)
