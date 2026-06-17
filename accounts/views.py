from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import generics, permissions
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()


@extend_schema_view(
    post=extend_schema(
        summary="Register a new user",
        description="Create a new user account with email, password, and profile details.",
        tags=["Authentication"],
    ),
)
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer


@extend_schema_view(
    get=extend_schema(
        summary="Get user profile",
        description="Retrieve the authenticated user's profile information.",
        tags=["Authentication"],
    ),
    put=extend_schema(
        summary="Update user profile",
        description="Update the authenticated user's profile information.",
        tags=["Authentication"],
    ),
    patch=extend_schema(
        summary="Partially update user profile",
        description="Partially update the authenticated user's profile information.",
        tags=["Authentication"],
    ),
)
class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
