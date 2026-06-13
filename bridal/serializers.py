from rest_framework import serializers
from .models import BridalRoom, BridalDress, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "description"]


class BridalRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = BridalRoom
        fields = "__all__"
        read_only_fields = ["created_at"]


class BridalDressSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source="category.name", read_only=True)

    class Meta:
        model = BridalDress
        fields = "__all__"
        read_only_fields = ["created_at"]
