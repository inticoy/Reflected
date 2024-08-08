from rest_framework import serializers
from user.serializers import UserSerializer
from user.models import User
from chat.models import Chat, ChatRoom


class ChatSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)

    class Meta:
        model = Chat
        fields = ["id", "room", "from_user", "message", "created_at"]


class ChatRoomSerializer(serializers.ModelSerializer):
    participants = serializers.SlugRelatedField(
        many=True, slug_field="nickname", queryset=User.objects.all()
    )
    latest_chat = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ["id", "participants", "created_at", "latest_chat"]

    def get_latest_chat(self, obj):
        latest_chat = obj.get_latest_chat()
        if latest_chat:
            return ChatSerializer(latest_chat).data
        return None
