from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "phone", "address"]

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "phone", "address", "avatar", "is_verified", "is_staff"]
        # Identity & privilege fields are display-only — a profile update may
        # only change phone, address, and the avatar image.
        read_only_fields = ["id", "username", "email", "is_verified", "is_staff"]
