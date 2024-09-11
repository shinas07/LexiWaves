from django.urls import path
from . views import SignUpView, VerifyEmailView, UserLoginView,ResendOtpView, StudentListView


urlpatterns = [ 
    path('signup/', SignUpView.as_view(), name='signup'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('resend-otp/', ResendOtpView.as_view(), name='resend-otp'),
    path('login/',UserLoginView.as_view(),name='login'),
    path('students-list/',StudentListView.as_view(),name='students-list'),
]