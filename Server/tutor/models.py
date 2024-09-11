from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone
from accounts.models import User

# Create your models here.


class Tutor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='tutor_profile')

    def __str__(self):
        return f"Tutor: {self.user.get_full_name()}"





class TutorOTPVerification(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    




class TutorDetails(models.Model):
    tutor = models.OneToOneField('Tutor', on_delete=models.CASCADE,null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)  
    phone_number = models.CharField(max_length=20, blank=True, null=True)  
    address = models.TextField(blank=True, null=True) 
    biography = models.TextField(blank=True, null=True) 
    degrees = models.CharField(max_length=255, blank=True, null=True)  
    certifications = models.CharField(max_length=255, blank=True, null=True) 
    educational_institutions = models.CharField(max_length=255, blank=True, null=True) 
    relevant_courses = models.CharField(max_length=255, blank=True, null=True) 
    work_history = models.TextField(blank=True, null=True) 
    current_position = models.CharField(max_length=255, blank=True, null=True)  
    teaching_experience = models.TextField(blank=True, null=True)  
    subjects_offered = models.CharField(max_length=255, blank=True, null=True)  
    skill_levels = models.CharField(max_length=255, blank=True, null=True)  
    teaching_license = models.FileField(upload_to='teaching_licenses/', blank=True, null=True) 
    hourly_rate = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    payment_methods = models.CharField(max_length=255, blank=True, null=True) 
    personal_statement = models.TextField(blank=True, null=True)  # Personal statement (optional)
    identity_proof = models.FileField(upload_to='identity_proofs/', blank=True, null=True)  
    terms_of_service = models.BooleanField(default=False)  
    privacy_policy = models.BooleanField(default=False)  
    admin_approved = models.BooleanField(default=False)
    approval_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Tutor Details for {self.phone_number}"




