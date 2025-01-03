from django.urls import path
# from . views import  SignUpView, VerifyEmailView, UserLoginView,ResendOtpView, Student ,ResendOtpView,RefreshTokenView
from . views import  SignUpView, VerifyEmailView, UserLoginView,ResendOtpView,ResendOtpView,CourseListView,CourseDetailView, CourseVideoView,CreateCheckoutSession, UserEnrolledCourses, WatchCourseView, CheckEnrollmentView, RequestotpView,ForgotPassowrdVerifyOtpView, UserProfileView, LogoutView, ChangePasswordView, UserProfileImageUploadView,UserProfileImageRemoveView,DeactivateAccountView,RefreshTokenView,GoogleSignInView
from . import views


urlpatterns = [ 
    path('google-signin/',GoogleSignInView.as_view(), name='google-signin'),
    path('signup/', SignUpView.as_view(), name='signup'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('resend-otp/', ResendOtpView.as_view(), name='resend-otp'),
    path('login/',UserLoginView.as_view(),name='login'),
    path('refresh-token/', RefreshTokenView.as_view(), name='refresh_token'),
    path('password-change-otp/',RequestotpView.as_view(), name='request-otp'),
    path('password-verify-otp/',ForgotPassowrdVerifyOtpView.as_view(), name='verify_otp'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('change-password/',ChangePasswordView.as_view(), name='change-password'),
    path('upload-profile-image/', UserProfileImageUploadView.as_view(), name='upload-profile-image'),
    path('remove-profile-image/', UserProfileImageRemoveView.as_view(), name='remove-profile-image'),
    # path('students-list/',StudentListView.as_view(),name='students-list'),
    path('courses/',CourseListView.as_view(), name='course-list'),
    path('course/details/<int:course_id>/', CourseDetailView.as_view(), name='course_detail'),
    path('courses/video/<int:pk>/', CourseVideoView.as_view(), name='course-video'),
    path('course-checkout-session/', CreateCheckoutSession.as_view(), name='create-checkout-session'),
    path('enrolled-courses/',UserEnrolledCourses.as_view(), name='enrolled-courses'),
    path('watch-course/<int:courseId>/', WatchCourseView.as_view(), name='course-watching'),
    path('check-enrollment/<int:courseId>/', CheckEnrollmentView.as_view(), name='check-enrolled-course'),
    # path('course/<int:course_id>/reviews/', CourseReviewView.as_view(), name='course-reviews'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('deactivate-account/',DeactivateAccountView.as_view(), name='user_deactivate'),
    path('webhook/stripe/', views.stripe_webhook, name='stripe-webhook'),
]

