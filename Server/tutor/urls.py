from django.urls import path
from .views import  TutorSignUpView, TutorVerifyEmailView, TutorLoginView, TutorDetailsView, CourseCreationViewSet,TokenRefreshView, TutorCreatedCoursesView

urlpatterns = [
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('signup/', TutorSignUpView.as_view(), name='tutor_signup'),
    path('verify_email/', TutorVerifyEmailView.as_view(), name='verify_email'),
    path('login/', TutorLoginView.as_view(), name='tutor-login'),
    # path('/details-checking/', TutorDetailsCheckView.as_view(), name='tutor-details-check'),
    path('details/',TutorDetailsView.as_view(), name='tutor-details'),
    path('courses-create/', CourseCreationViewSet.as_view({'post': 'create'}), name='create-course'),
     path('created-courses/', TutorCreatedCoursesView.as_view(), name='tutor_courses'),
]

