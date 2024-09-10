from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone

# Create your models here.

class TutorManager(BaseUserManager):
    def create_tutor(self, email, firstname, lastname, password=None):
        if not email:
            raise ValueError('Tutors must have an email address')
        tutor = self.model(
            email=self.normalize_email(email),
            firstname=firstname,
            lastname=lastname,
        )
        tutor.set_password(password)
        tutor.save(using=self._db)
        return tutor
    

class Tutor(AbstractBaseUser):
    email = models.EmailField(unique=True)
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    admin_approved = models.BooleanField(default=False, null=True,blank=True)
    objects = TutorManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['firstname', 'lastname']

    def __str__(self):
        return f"{self.firstname} {self.lastname}"
    

class TutorOTPVerification(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    




class TutorDetails(models.Model):
    # tutor = models.OneToOneField('Tutor', on_delete=models.CASCADE)
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




