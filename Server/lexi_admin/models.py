from django.db import models
from accounts.models import User
from tutor.models import Course
from django.conf import settings


class Admin(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='admin_profile')

    
class Language(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    
    def __str__(self):
        return self.name
    


# Course Payment And details Data
class StudentCourseEnrollment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    payment_status = models.CharField(max_length=20, default='pending')
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    session_id = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self) -> str:
        return f'{self.user.first_name} enrolled in {self.course.title}'
    

class AdminRevenue(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    commission = models.DecimalField(max_digits=10, decimal_places=2, default=0,null=True)  
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_id = models.CharField(max_length=100)
    create_at = models.DateTimeField(auto_now_add=True)