from .views import LatestCoursesView
from django.urls import path
from .views import QuizView,MarkLessonWatchedView,CompletedLessonsView, CourseEnrolledStudentsView,TutorDetailByCourseView,StudyStreakViewSet, StudyStreakStatus

urlpatterns = [
     path('latest-courses/', LatestCoursesView.as_view(), name='latest-courses'),
     path('mark-lesson-watched/', MarkLessonWatchedView.as_view(), name='mark-lesson-watched'),
     path('course-quiz/<int:course_id>/', QuizView.as_view(), name='course-quiz'),
     path('submit-quiz/', QuizView.as_view(), name='submit-quiz'),
     path('completed-lessons/<int:course_id>/', CompletedLessonsView.as_view(), name='completed-lessons'),
     path('students-details/',CourseEnrolledStudentsView.as_view(), name='course-enrolled-student-list'),
     path('tutor-interaction/<int:tutor_id>/', TutorDetailByCourseView.as_view(), name='tutor-detail-by-course'),
     path('study-streak/',StudyStreakViewSet.as_view()),
     path('check-streak/',StudyStreakStatus.as_view()),
]