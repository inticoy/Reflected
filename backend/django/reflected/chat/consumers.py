import json
import logging
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer

logger = logging.getLogger(__name__)


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_authenticated:
            self.group_name = f"chat_user_{self.user.id}"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
            self.ping_task = asyncio.create_task(self.send_ping())
            logger.info(f"WebSocket connected for chats: {self.user.nickname}")
        else:
            logger.warning("WebSocket connection rejected due to unauthenticated user")
            await self.close()

    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
            self.ping_task.cancel()
            logger.info(f"WebSocket disconnected: {self.user.nickname}")

    async def receive(self, text_data):
        pass

    async def send_change(self, event):
        type = event["type"]
        object = event["object"]
        chatroom_id = event["chatroom_id"]
        await self.send(
            text_data=json.dumps(
                {"type": type, "object": object, "chatroom_id": chatroom_id}
            )
        )

    async def send_ping(self):
        while True:
            logger.info(f"Sending ping to {self.user.nickname}")
            await self.send(text_data=json.dumps({"type": "ping"}))
            await asyncio.sleep(60)
