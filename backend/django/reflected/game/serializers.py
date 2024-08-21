from rest_framework import serializers
from user.serializers import UserSerializer
from game.models import Game


class GameSerializer(serializers.ModelSerializer):
    host = UserSerializer(read_only=True)
    guest = UserSerializer(read_only=True)

    class Meta:
        model = Game
        fields = "__all__"
