from django.db import models
from django.conf import settings
from tutor.models import Lesson
from tutor.models import Course
from datetime import date, timedelta
from django.utils import timezone
import uuid
from accounts.models import User
# Create your models here.

# User Watched 
class UserLesson(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    watched = models.BooleanField(default=False)
    watched_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'lesson')

# Study Steak table

class StudyActivity(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE, related_name='watch_history')
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    watch_duration = models.IntegerField(default=0)  # in seconds
    watched_date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-watched_date']

class StudyStreak(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='study_streak')
    current_streak = models.PositiveIntegerField(default=0)
    max_streak = models.PositiveBigIntegerField(default=0)
    last_study_date = models.DateField(null=True, blank=True) 
    total_study_days = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True) 

    # def update_streak(self):
    #     from datetime import date, timedelta
    #     today = date.today()
    #     yesterday = today - timedelta(days=1)

    #     if self.last_watch_date == today:
    #         # Already updated today
    #         return
        
    #     if self.last_watch_date == yesterday:
    #         # Continuous streak
    #         self.current_streak += 1
    #         self.longest_streak = max(self.current_streak, self.longest_streak)
    #     elif self.last_watch_date != today:
    #         # Streak broken
    #         self.current_streak = 1

    #     self.last_watch_date = today
    #     self.save()

    # def __str__(self):
    #     return f"{self.user.username}'s streak: {self.current_streak} days"

class Certificate(models.Model):
   certificate_id = models.UUIDField(default=uuid.uuid4, editable=False,unique=True)
   user = models.ForeignKey(User, on_delete=models.CASCADE)
   course = models.ForeignKey(Course, on_delete=models.CASCADE)
   issue_date = models.DateTimeField(default=timezone.now)
   is_valid = models.BooleanField(default=True)
   
   class Meta:
       unique_together = ('user', 'course')
       
   def __str__(self):
       return f"Certificate-{self.certificate_id[:8]} - {self.user.email} - {self.course.title}"