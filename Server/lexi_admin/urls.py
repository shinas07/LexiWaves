from django.urls import path
from .views import TutorApprovalView

urlpatterns = [
    path('tutor-approval-list/',TutorApprovalView.as_view(), name='tutor-approval'),

]