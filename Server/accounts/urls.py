from django.urls import path
from . views import  SignUpView, VerifyEmailView, UserLoginView,ResendOtpView, Student ,ResendOtpView,RefreshTokenView
from . views import  SignUpView, VerifyEmailView, UserLoginView,ResendOtpView,ResendOtpView,CrouseListView,CourseDetailView, CourseVideoView,CreateCheckoutSession, UserEnrolledCourses, WatchCourseView, CheckEnrollmentView, RequestotpView,ForgotPassowrdVerifyOtpView

urlpatterns = [ 

    path('signup/', SignUpView.as_view(), name='signup'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('resend-otp/', ResendOtpView.as_view(), name='resend-otp'),
    path('login/',UserLoginView.as_view(),name='login'),
    path('refresh-token/', RefreshTokenView.as_view(), name='refresh_token'),
    path('password-change-otp/',RequestotpView.as_view(), name='request-otp'),
    path('password-verify-otp/',ForgotPassowrdVerifyOtpView.as_view(), name='verify_otp'),
    

    # path('students-list/',StudentListView.as_view(),name='students-list'),
    

    path('courses/',CrouseListView.as_view(), name='course-list'),
    path('course/<int:course_id>/', CourseDetailView.as_view(), name='course_detail'),
    path('courses/video/<int:pk>/', CourseVideoView.as_view(), name='course-video'),
    path('course-checkout-session/', CreateCheckoutSession.as_view(), name='create-checkout-session'),
    path('enrolled-courses/',UserEnrolledCourses.as_view(), name='enrolled-courses'),
    path('watch-course/<int:courseId>/', WatchCourseView.as_view(), name='course-watching'),
    path('check-enrollment/<int:courseId>/', CheckEnrollmentView.as_view(), name='check-enrolled-course'),
    # path('course/<int:course_id>/reviews/', CourseReviewView.as_view(), name='course-reviews'),
]

