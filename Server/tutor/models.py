from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone
from accounts.models import User
from django.conf import settings

# Create your models here.


class Tutor(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tutor_profile')

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
    educational_institutions = models.CharField(max_length=255, blank=True, null=True) 
    work_history = models.TextField(blank=True, null=True) 
    current_position = models.CharField(max_length=255, blank=True, null=True)  
    teaching_experience = models.TextField(blank=True, null=True)  
    subjects_offered = models.CharField(max_length=255, blank=True, null=True)  
    skill_levels = models.CharField(max_length=255, blank=True, null=True)
    hourly_rate = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    personal_statement = models.TextField(blank=True, null=True)  # Personal statement (optional)
    identity_proof = models.FileField(upload_to='identity_proofs/', blank=True, null=True)  
    terms_of_service = models.BooleanField(default=False)  
    admin_approved = models.BooleanField(default=False)
    approval_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Tutor Details for {self.phone_number}"



class Course(models.Model):
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=100)
    thumbnail_url = models.TextField(max_length=1000)
    video_url  = models.TextField(max_length=1000)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.PositiveIntegerField(help_text="Duration in hours")
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    tutor = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return self.title
    

class Lesson(models.Model):
    course = models.ForeignKey(Course, related_name='lessons', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True) 
    lesson_video_url = models.TextField(max_length=1000)  
    order = models.PositiveIntegerField()  
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.title} ({self.course.title})'

class LessonCompletion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'lesson']


# Quiz Part
class Question(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='questions')
    text = models.CharField(max_length=255)

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

class QuizAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    score = models.IntegerField()
    passed = models.BooleanField(default=False)
    date_attempted = models.DateTimeField(auto_now_add=True)

class TutorSlot(models.Model):
    tutor = models.ForeignKey(Tutor, on_delete=models.CASCADE, related_name='slots')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    slot_hourly_rate = models.DecimalField(max_digits=6, decimal_places=2, default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tutor} - {self.date} ({self.start_time} - {self.end_time})"

    def update_rate(self, new_rate):
        # Save current rate in history before updating
        TutorSlotRateHistory.objects.create(slot=self, rate=self.hourly_rate)
        self.hourly_rate = new_rate
        self.save()


class TutorSlotRateHistory(models.Model):
    slot = models.ForeignKey(TutorSlot, on_delete=models.CASCADE, related_name='rate_history')
    rate = models.DecimalField(max_digits=6, decimal_places=2)
    changed_at = models.DateTimeField(auto_now_add=True)


class TutorRevenue(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    tutor = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_id = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)