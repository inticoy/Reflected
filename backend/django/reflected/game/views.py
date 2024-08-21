from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from game.models import Game, GameStatus
from game.serializers import GameSerializer
from django.db.models import Q


class GameViewset(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        game_name = request.data.get("name")
        if not game_name:
            return Response(
                {"detail": 'Invalid or missing "name" field'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        game = Game(name=game_name, host=request.user)
        game.save()
        return Response(GameSerializer(game).data, status=status.HTTP_201_CREATED)

    def list(self, reqeust, *args, **kwargs):
        requests = Game.objects.filter(
            Q(status=GameStatus.WAITING.value) | Q(status=GameStatus.CANCELLED.value)
        ).order_by("created_at")
        return Response(GameSerializer(requests, many=True).data)
