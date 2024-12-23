from .views import LatestCoursesView
from django.urls import path
from .views import CourseQuizView,MarkLessonWatchedView,CompletedLessonsView, CourseEnrolledStudentsView,TutorDetailByCourseView,StudyStreakViewSet, StudentDashboardStatsView, QuizValidationView, CertificateView, AllCertificateViewSet

urlpatterns = [
     path('latest-courses/', LatestCoursesView.as_view(), name='latest-courses'),
     path('mark-lesson-watched/', MarkLessonWatchedView.as_view(), name='mark-lesson-watched'),
     path('course-quiz/<int:course_id>/', CourseQuizView.as_view(), name='course-quiz'),
     path('courses/<int:course_id>/quiz/validate/', QuizValidationView.as_view(), name='quiz-validate'),
     path('submit-quiz/', CourseQuizView.as_view(), name='submit-quiz'),
     path('completed-lessons/<int:course_id>/', CompletedLessonsView.as_view(), name='completed-lessons'),
     path('students-details/',CourseEnrolledStudentsView.as_view(), name='course-enrolled-student-list'),
     path('tutor-interaction/<int:tutor_id>/', TutorDetailByCourseView.as_view(), name='tutor-detail-by-course'),
     path('study-streak/',StudyStreakViewSet.as_view()),
     path('dashboard-stats/',StudentDashboardStatsView.as_view()),
     path('certificate/<int:course_id>/',CertificateView.as_view()),
     path('all/certificates/',AllCertificateViewSet.as_view()),
]