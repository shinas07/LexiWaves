from django.urls import path
from .views import  TutorSignUpView, TutorVerifyEmailView, TutorLoginView, TutorDetailsView, CourseCreationViewSet, TutorCreatedCoursesView, EnrolledCoursesView,TutorDashboardView

urlpatterns = [
    path('signup/', TutorSignUpView.as_view(), name='tutor_signup'),
    path('verify_email/', TutorVerifyEmailView.as_view(), name='verify_email'),
    path('login/', TutorLoginView.as_view(), name='tutor-login'),
    # path('/details-checking/', TutorDetailsCheckView.as_view(), name='tutor-details-check'),
    path('details/',TutorDetailsView.as_view(), name='tutor-details'),
    path('dashboard/',TutorDashboardView.as_view(), name='tutor-dashboard'),
    path('courses-create/', CourseCreationViewSet.as_view({'post': 'create'}), name='create-course'),
     path('created-courses/', TutorCreatedCoursesView.as_view(), name='tutor_courses'),
      path('enrolled-courses-list/', EnrolledCoursesView.as_view(), name='enrolled-courses'),
]

