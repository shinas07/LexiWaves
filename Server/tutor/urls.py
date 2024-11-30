from django.urls import path
from .views import  TutorSignUpView, TutorVerifyEmailView, TutorLoginView, TutorDetailsView, CourseCreationViewSet, TutorCreatedCoursesView, EnrolledCoursesView,TutorDashboardView, CompletedLessonsView,CompleteLessonView,QuizCreationView, CourseDetailView, CourseAllDetails, TutorLogoutView, RevenueReportView,TutorProfileView,TutorSlotView,TutorRevenueDetailsView

urlpatterns = [
    path('signup/', TutorSignUpView.as_view(), name='tutor_signup'),
    path('verify_email/', TutorVerifyEmailView.as_view(), name='verify_email'),
    path('login/', TutorLoginView.as_view(), name='tutor-login'),
    # path('/details-checking/', TutorDetailsCheckView.as_view(), name='tutor-details-check'),
    path('details/',TutorDetailsView.as_view(), name='tutor-details'),
    path('dashboard/',TutorDashboardView.as_view(), name='tutor-dashboard'),
    path('profile/', TutorProfileView.as_view(), name='tutor-profile'),
    path('courses-create/', CourseCreationViewSet.as_view({'post': 'create'}), name='create-course'),
    path('complete-lesson/', CompleteLessonView.as_view(), name='complete-lesson'),
    path('completed-lessons/<int:course_id>/', CompletedLessonsView.as_view(), name='completed-lessons'),
    path('created-courses/', TutorCreatedCoursesView.as_view(), name='tutor_courses'),
    path('enrolled-courses-list/', EnrolledCoursesView.as_view(), name='enrolled-courses'),
    path('courses/<int:courseId>/quiz/', QuizCreationView.as_view(), name='create-quiz'),
    path('course/details/<int:pk>/', CourseDetailView.as_view(), name='course-detail'), 
    path('qiuz-course/details/<int:pk>/',CourseAllDetails.as_view(), name='all-course-details'),
    path('revenue-report/', RevenueReportView.as_view(), name='revenue_report'),
    path('slot/update/',TutorSlotView.as_view(),name='tutor-slot-update'),
    path('revenue-details/',TutorRevenueDetailsView.as_view()),
    path('logout/',TutorLogoutView.as_view(), name='tutor-logout'),
]



