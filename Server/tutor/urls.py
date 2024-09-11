from django.urls import path
from .views import  TutorSignUpView, TutorVerifyEmailView, TutorLoginView, TutorDetails

urlpatterns = [
    path('signup/', TutorSignUpView.as_view(), name='tutor_signup'),
    path('verify_email/', TutorVerifyEmailView.as_view(), name='verify_email'),
    path('login/', TutorLoginView.as_view(), name='tutor-login'),
    path('details/',TutorDetails.as_view(), name='tutor-details'),
  
    
]

