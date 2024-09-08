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

    objects = TutorManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['firstname', 'lastname']

    def __str__(self):
        return f"{self.firstname} {self.lastname}"
    

class TutorOTPVerification(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    

