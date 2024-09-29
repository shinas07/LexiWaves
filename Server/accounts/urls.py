from django.urls import path
<<<<<<< Updated upstream
from . views import  SignUpView, VerifyEmailView, UserLoginView,ResendOtpView, Student ,ResendOtpView,GoogleLogin

=======
from . views import  SignUpView, VerifyEmailView, UserLoginView,ResendOtpView,ResendOtpView,GoogleLogin,CrouseListView,CourseDetailView, CourseVideoView,CreateCheckoutSession, UserEnrolledCourses, WatchCourseView, CheckEnrollmentView
>>>>>>> Stashed changes

urlpatterns = [ 
    path('signup/', SignUpView.as_view(), name='signup'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('resend-otp/', ResendOtpView.as_view(), name='resend-otp'),
    path('login/',UserLoginView.as_view(),name='login'),
<<<<<<< Updated upstream
    # path('students-list/',StudentListView.as_view(),name='students-list'),
=======
    path('courses/',CrouseListView.as_view(), name='course-list'),
    path('course/<int:course_id>/', CourseDetailView.as_view(), name='course_detail'),
    path('courses/video/<int:pk>/', CourseVideoView.as_view(), name='course-video'),
    path('course-checkout-session/', CreateCheckoutSession.as_view(), name='create-checkout-session'),
    path('enrolled-courses/',UserEnrolledCourses.as_view(), name='enrolled-courses'),
    path('watch-course/<int:courseId>/', WatchCourseView.as_view(), name='course-watching'),
    path('check-enrollment/<int:courseId>/', CheckEnrollmentView.as_view(), name='check-enrolled-course'),
    # path('course/<int:course_id>/reviews/', CourseReviewView.as_view(), name='course-reviews'),


>>>>>>> Stashed changes
 

]

