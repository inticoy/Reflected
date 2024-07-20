from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from chat.models import Chat, ChatRoom

import logging

logger = logging.getLogger(__name__)


@receiver(m2m_changed, sender=ChatRoom.participants.through)
def send_new_chatroom(sender, instance, action, **kwargs):
    if action == "post_add":
        channel_layer = get_channel_layer()
        participants = instance.participants.all()
        logger.error(f"New ChatRoom created: {instance.id} {instance.participants}")
        groups = [f"chat_user_{user.id}" for user in participants]

        for group in groups:
            async_to_sync(channel_layer.group_send)(
                group,
                {
                    "type": "send_change",
                    "object": "chatroom",
                    "chatroom_id": instance.id,
                },
            )


@receiver(post_save, sender=Chat)
def send_new_chat(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        participants = instance.room.participants.all()
        groups = [f"chat_user_{user.id}" for user in participants]
        logger.error(f"New Chat created: {instance.id} {instance.room.id}")

        for group in groups:
            async_to_sync(channel_layer.group_send)(
                group,
                {
                    "type": "send_change",
                    "object": "chat",
                    "chatroom_id": instance.room.id,
                },
            )
