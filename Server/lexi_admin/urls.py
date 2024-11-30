from django.urls import path
from .views import TutorApprovalView, AdminLoginView,StudentListView,ApprovedTutorListView,TutorRequests, TutorRequestDetails, TutorApprovalUpdateView, LanguageCreateView, EnrolledCoursesListView,BlockUserView,ApprovedCoursesListView,NewCourseCountView,NewCoursesView, CourseApprovalView,AdminLogoutView,AdminDashboardView,AdminReportsView,AdminRevenueView

urlpatterns = [
    path('admin-login/',AdminLoginView.as_view(), name='admin_login'),
    path('dashboard-view/',AdminDashboardView.as_view()),
    path('students-list/', StudentListView.as_view(), name='students_list'),
    path('block-student/<int:studentId>/', BlockUserView.as_view(), name='block_student'),
    path('tutor-list/',ApprovedTutorListView.as_view(), name='tutor_list'),
    path('tutor-approval-list/',TutorApprovalView.as_view(), name='tutor_approval'),
    path('tutor-requests/', TutorRequests.as_view(), name='tutor_requests'),
    path('tutor-details/<int:tutor_id>/',TutorRequestDetails.as_view(), name='tutor_details'),
    path('tutor-approve/<int:tutor_id>/', TutorApprovalUpdateView.as_view(), name='approve_tutor'),
    path('languages/',LanguageCreateView.as_view(), name='language_create'),
    path('approved-courses/', ApprovedCoursesListView.as_view(), name='approved_courses_list'),
    path('enrolled-courses/',EnrolledCoursesListView.as_view(), name='enrolled_courses'),
    path('new-course-count/', NewCourseCountView.as_view(), name='new-course-count'),
    path('admin-courses-request/', NewCoursesView.as_view(), name='new-courses'),
    path('course-approval/<int:pk>/', CourseApprovalView.as_view(), name='course-approval'),
    path('reports/', AdminReportsView.as_view(), name='admin-reports'),
    path('logout/',AdminLogoutView.as_view()),
     path('revenue-details/', AdminRevenueView.as_view(), name='admin-revenue-details'),
]



