from django.urls import path, re_path
from . import views

urlpatterns = [
    path("", views.ReactAppView.as_view(), name="index"),
    re_path(r"^(?!api/|admin/|media/).*$", views.ReactAppView.as_view()),
]
