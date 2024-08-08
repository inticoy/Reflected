from django.db import models
from django.conf import settings


class ChatRoom(models.Model):
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="chat_rooms"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def get_latest_chat(self):
        return self.chats.order_by("-created_at").first()


class Chat(models.Model):
    room = models.ForeignKey(ChatRoom, related_name="chats", on_delete=models.CASCADE)
    from_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="sent_chats",
        on_delete=models.CASCADE,
    )
    message = models.CharField(max_length=10000)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.from_user}: {self.message}"
