from enum import Enum
from django.db import models
from django.conf import settings


class GameStatus(Enum):
    WAITING = 0
    IN_PROGRESS = 1
    COMPLETED = 2
    CANCELLED = 3


class Game(models.Model):
    name = models.CharField(max_length=20)
    host = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="own_games", on_delete=models.CASCADE
    )
    guest = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="games",
        on_delete=models.CASCADE,
        null=True,
    )
    status = models.IntegerField(
        choices=[(tag.value, tag.name) for tag in GameStatus],
        default=GameStatus.WAITING.value,
    )
    host_score = models.IntegerField(default=0)
    guest_score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
