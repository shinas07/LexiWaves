from django.urls import path
from .views import TutorApprovalView, AdminLoginView,StudentListView,ApprovedTutorListView,TutorRequests, TutorRequestDetails, TutorApprovalUpdateView, LanguageCreateView, EnrolledCoursesListView,BlockUserView

urlpatterns = [
    path('admin-login/',AdminLoginView.as_view(), name='admin-login'),
    path('students-list/', StudentListView.as_view(), name='students-list'),
    path('block-student/<int:studentId>/', BlockUserView.as_view(), name='block-student'),
    path('tutor-list/',ApprovedTutorListView.as_view(), name='tutor-list'),
    path('tutor-approval-list/',TutorApprovalView.as_view(), name='tutor-approval'),
    path('tutor-requests/', TutorRequests.as_view(), name='tutor-requests'),
    path('tutor-details/<int:tutor_id>/',TutorRequestDetails.as_view(), name='tutor-details'),
    path('tutor-approve/<int:tutor_id>/', TutorApprovalUpdateView.as_view(), name='approve-tutor'),
    path('languages/',LanguageCreateView.as_view(), name='language-create'),
    path('enrolled-courses/',EnrolledCoursesListView.as_view(), name='enrolled-courses'),


]

