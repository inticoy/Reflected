from rest_framework.routers import DefaultRouter
from game.views import GameViewset

GameRouter = DefaultRouter(trailing_slash=False)
GameRouter.register(r"", GameViewset, basename="games")
