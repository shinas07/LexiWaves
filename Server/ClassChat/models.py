
# Create your models here.
from django.db import models
from accounts.models import User
import uuid
from tutor.models import Course

class ClassChatRoom(models.Model):
    room_id = models.UUIDField(default=uuid.uuid4, unique=True)
    tutor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tutor_chat_rooms')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_chat_rooms')
    course = models.ForeignKey(Course,on_delete=models.CASCADE, related_name='chat_rooms',null=True, blank=True, default=None)
    created_at = models.DateTimeField(auto_now_add=True)


class ClassChatMessage(models.Model):
    room = models.ForeignKey(ClassChatRoom, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)