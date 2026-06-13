from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Booking
from .serializers import BookingSerializer, BookingCreateSerializer


class IsStaffOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.is_staff


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Booking.objects.all()
        return Booking.objects.filter(user=user)

    def get_serializer_class(self):
        if self.action == "create":
            return BookingCreateSerializer
        return BookingSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.status in ["confirmed", "pending"]:
            booking.status = "cancelled"
            booking.save()
            return Response({"status": "cancelled"})
        return Response(
            {"error": "Cannot cancel this booking"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        booking = self.get_object()
        if booking.status != "pending":
            return Response(
                {"error": "Only pending bookings can be approved"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        booking.status = "confirmed"
        booking.save()
        return Response({"status": "confirmed"})

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        booking = self.get_object()
        if booking.status != "pending":
            return Response(
                {"error": "Only pending bookings can be rejected"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        booking.status = "cancelled"
        booking.save()
        return Response({"status": "cancelled"})
