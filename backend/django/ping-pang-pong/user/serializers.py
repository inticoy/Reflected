from rest_framework import serializers

from .models import User, OauthList

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'nickname', 'username', 'profile_image', 'total_matches', 'win_matches')
        # fields ='__all__'
        read_only_fields = ('total_matches', 'win_matches')


class OauthListSerializer(serializers.ModelSerializer):
    class Meta:
        model = OauthList
        fields = ('user', 'provider', 'oauth_id')