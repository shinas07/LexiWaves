from django.db import models
from accounts.models import User
from tutor.models import Lesson

# Create your models here.

# User Watched 
class UserLesson(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    watched = models.BooleanField(default=False)
    watched_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'lesson')