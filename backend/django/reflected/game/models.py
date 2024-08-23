from enum import Enum
from django.db import models
from django.conf import settings
from django.utils import timezone


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
    code = models.CharField(max_length=6, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.code:
            self.code = self.generate_code()
        super(Game, self).save(*args, **kwargs)

    def generate_code(self):
        if not self.created_at:
            self.created_at = timezone.now()

        date_str = self.created_at.strftime("%y%m%d")
        date_hash = int(date_str) % 36**3
        date_code = base36_encode(date_hash).zfill(3)

        if not self.id:
            try:
                last_game = Game.objects.latest("id")
                next_id = last_game.id + 1
            except Game.DoesNotExist:
                next_id = 1
        else:
            next_id = self.id

        id_hash = next_id % 36**3
        id_code = base36_encode(id_hash).zfill(3)
        return f"{date_code}{id_code}"


def base36_encode(number):
    alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    base36 = ""
    while number:
        number, i = divmod(number, 36)
        base36 = alphabet[i] + base36
    return base36 or alphabet[0]
