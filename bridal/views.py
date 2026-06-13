from rest_framework import viewsets, permissions
from .models import BridalRoom, BridalDress, Category
from .serializers import BridalRoomSerializer, BridalDressSerializer, CategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


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
