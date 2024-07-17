from django.urls import path

from rest_framework.routers import SimpleRouter
from . import views
from .views import ChatRoomViewSet, ChatViewSet


urlpatterns = [
    path("", views.index, name="index"),
    path("<str:room_name>/", views.room, name="room"),
]

ChatRouter = SimpleRouter(trailing_slash=False)
ChatRouter.register(r"", ChatViewSet, basename="chats")

ChatRoomRouter = SimpleRouter(trailing_slash=False)
ChatRoomRouter.register(r"", ChatRoomViewSet, basename="chatrooms")
