from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from rest_framework import viewsets, permissions
from .models import BridalRoom, BridalDress, Category
from .serializers import BridalRoomSerializer, BridalDressSerializer, CategorySerializer


@extend_schema_view(
    list=extend_schema(summary="List categories", tags=["Categories"]),
    retrieve=extend_schema(summary="Get category details", tags=["Categories"]),
    create=extend_schema(summary="Create a category", tags=["Categories"]),
    update=extend_schema(summary="Update a category", tags=["Categories"]),
    partial_update=extend_schema(summary="Partially update a category", tags=["Categories"]),
    destroy=extend_schema(summary="Delete a category", tags=["Categories"]),
)
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


@extend_schema_view(
    list=extend_schema(
        summary="List bridal rooms",
        tags=["Bridal Rooms"],
        parameters=[
            OpenApiParameter("status", OpenApiTypes.STR, description="Filter by status (available, booked, maintenance)"),
        ],
    ),
    retrieve=extend_schema(summary="Get room details", tags=["Bridal Rooms"]),
    create=extend_schema(summary="Create a bridal room", tags=["Bridal Rooms"]),
    update=extend_schema(summary="Update a bridal room", tags=["Bridal Rooms"]),
    partial_update=extend_schema(summary="Partially update a bridal room", tags=["Bridal Rooms"]),
    destroy=extend_schema(summary="Delete a bridal room", tags=["Bridal Rooms"]),
)
class BridalRoomViewSet(viewsets.ModelViewSet):
    queryset = BridalRoom.objects.all()
    serializer_class = BridalRoomSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = BridalRoom.objects.all()
        status = self.request.query_params.get("status")
        if status:
            qs = qs.filter(status=status)
        return qs


@extend_schema_view(
    list=extend_schema(
        summary="List bridal dresses",
        tags=["Bridal Dresses"],
        parameters=[
            OpenApiParameter("status", OpenApiTypes.STR, description="Filter by status (available, rented, maintenance)"),
            OpenApiParameter("category", OpenApiTypes.STR, description="Filter by category name"),
        ],
    ),
    retrieve=extend_schema(summary="Get dress details", tags=["Bridal Dresses"]),
    create=extend_schema(summary="Create a bridal dress", tags=["Bridal Dresses"]),
    update=extend_schema(summary="Update a bridal dress", tags=["Bridal Dresses"]),
    partial_update=extend_schema(summary="Partially update a bridal dress", tags=["Bridal Dresses"]),
    destroy=extend_schema(summary="Delete a bridal dress", tags=["Bridal Dresses"]),
)
class BridalDressViewSet(viewsets.ModelViewSet):
    queryset = BridalDress.objects.all()
    serializer_class = BridalDressSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = BridalDress.objects.all()
        status = self.request.query_params.get("status")
        category = self.request.query_params.get("category")
        if status:
            qs = qs.filter(status=status)
        if category:
            qs = qs.filter(category__name=category)
        return qs
