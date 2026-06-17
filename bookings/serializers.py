from decimal import Decimal
from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source="user.email")
    room_name = serializers.ReadOnlyField(source="room.name")
    dress_name = serializers.ReadOnlyField(source="dress.name")

    class Meta:
        model = Booking
        fields = "__all__"
        read_only_fields = ["user", "created_at", "updated_at"]


class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ["room", "dress", "start_date", "end_date", "notes"]
        extra_kwargs = {
            "room": {"required": False},
            "dress": {"required": False},
        }

    def validate(self, data):
        if not data.get("room") and not data.get("dress"):
            raise serializers.ValidationError("Must specify a room or a dress to book.")
        if data["end_date"] <= data["start_date"]:
            raise serializers.ValidationError("End date must be after the start date.")
        return data

    def create(self, validated_data):
        room = validated_data.get("room")
        dress = validated_data.get("dress")
        start = validated_data["start_date"]
        end = validated_data["end_date"]
        hours = (end - start).total_seconds() / 3600
        if room:
            # Rooms are priced per hour (minimum 1 hour billed).
            total = room.price_per_hour * Decimal(str(max(1, hours)))
        elif dress:
            # Dresses are priced per day (minimum 1 day) plus a refundable deposit.
            days = max(1, hours / 24)
            total = dress.rental_price_per_day * Decimal(str(days)) + dress.deposit_amount
        else:
            total = Decimal("0")
        validated_data["total_price"] = round(total, 2)
        return super().create(validated_data)
