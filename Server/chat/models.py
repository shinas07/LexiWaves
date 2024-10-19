from django.db import models
from accounts.models import User
from lexi_admin.models import Language
from django.db.models.signals import post_save
from django.dispatch import receiver


# Create your models here.


class ChatRoom(models.Model):
    language = models.ForeignKey(Language, on_delete=models.CASCADE,null=True)
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class ChatMessage(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} in {self.room.name}: {self.content[:20]}"
    

# django signal for creating ChatRoom
@receiver(post_save, sender=Language)
def create_chat_room(sender, instance, created, **kwargs):
    if created:
        ChatRoom.objects.create(language=instance,name=instance.name)  