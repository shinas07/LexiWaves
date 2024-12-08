from django.db import models
from accounts.models import Student
from tutor.models import Tutor
from lexi_admin.models import Course
from accounts.models import User
from django.conf import settings

# Create your models here.


class VideoCallRequest(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE, related_name='send_call_request')
    tutor = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE, related_name='received_call_requests')
    course = models.ForeignKey(Course,on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'), 
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('completed', 'Completed'),
        ('expired','Expired'),
        ('cancelled','Cancelled'),
    ], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    scheduled_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Call request from {self.student.email} to {self.tutor.email}"


