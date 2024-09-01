import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "reflected.settings")
# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()


from django.urls import re_path, path

from chat.consumers import ChatConsumer
from game.consumers import SingleGameConsumer, GameConsumer
from notification.consumers import NotificationConsumer

from .middleware import TokenAuthMiddleware

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": TokenAuthMiddleware(
            URLRouter(
                [
                    path("ws/notifications/", NotificationConsumer.as_asgi()),
                    path("ws/chats/", ChatConsumer.as_asgi()),
                    path("ws/games/single/", SingleGameConsumer.as_asgi()),
                    path("ws/games/multi/<int:game_id>/", GameConsumer.as_asgi()),
                ]
            )
        ),
    }
)
