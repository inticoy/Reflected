from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', views.RegisterAPIView.as_view()),
    path('login/', views.AuthAPIView.as_view()),
    path("auth/refresh/", TokenRefreshView.as_view()), # jwt 토큰 재발급
]

urlpatterns = format_suffix_patterns(urlpatterns)