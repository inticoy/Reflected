from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from chat.models import Chat


@receiver(post_save, sender=Chat)
def send_reload(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"chat_{instance.room.id}",
            {
                "type": "send_reload",
                # "message": f"{instance.message}",
                # "from_user": f"{instance.from_user.nickname}",
            },
        )
