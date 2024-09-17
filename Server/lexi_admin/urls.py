from django.urls import path
from .views import TutorApprovalView, AdminLoginView,StudentListView,ApprovedTutorListView,TutorRequests, TutorRequestDetails, TutorApprovalUpdateView

urlpatterns = [
    path('admin-login/',AdminLoginView.as_view(), name='admin-login'),
    path('students-list/', StudentListView.as_view(), name='students-list'),
    path('tutor-list/',ApprovedTutorListView.as_view(), name='tutor-list'),
    path('tutor-approval-list/',TutorApprovalView.as_view(), name='tutor-approval'),
    path('tutor-requests/', TutorRequests.as_view(), name='tutor-requests'),
    path('tutor-details/<int:tutor_id>/',TutorRequestDetails.as_view(), name='tutor-details'),
    path('tutor-details/approve/<int:tutorId>/', TutorApprovalUpdateView.as_view(), name='update-tutor-approval'),
]

