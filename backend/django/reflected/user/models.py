from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from enum import Enum


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, social_id, social_type, username=None, nickname=None, friend_code=None):
        user = self.model(
            username=username,
            nickname=nickname,
            social_id=social_id,
            social_type=social_type,
            friend_code=friend_code
        )
        user.set_unusable_password()

        user.save(using=self._db)
        return user

    def create_superuser(self, username, password):
        user = self.model(
            username=username,
        )
        user.set_password(password)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    # set username to login
    USERNAME_FIELD = 'username'

    username = models.CharField(
        max_length=20,
        unique=True,
        null=True,
        blank=True
    )
    nickname = models.CharField(
        max_length=20,
        unique=True,
        null=True,
    )

    profile_image = models.ImageField()
    total_matches = models.IntegerField(default=0)
    win_matches = models.IntegerField(default=0)

    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    def __str__(self):
        return self.username

class OAuthProvider(Enum):
    Google = 0
    FT = 1

class OauthList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='oauth_user')
    provider = models.IntegerField(default=OAuthProvider.Google)
    oauth_id = models.CharField(max_length=20)
