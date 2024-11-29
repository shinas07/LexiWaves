from django.urls import path
from . import views

urlpatterns = [
    path('request/',views.UserVideoCallRequestView.as_view()),
    path('check-request/',views.CheckVideoRequestView.as_view()),
    path('student-requests/<int:student_id>/', views.StudentVideoRequestsView.as_view()),
    path('student/call-request/<int:student_id>/', views.VideoCallRequestView.as_view()),
    path('handle-request/<int:request_id>/',views.handle_video_call_request, name='handle-video-request'),
    path('agora-token/<int:request_id>/',views.AgoraVideoCallTokenView.as_view()),
    path('end/<str:request_id>/', views.EndVideoCallView.as_view(), name='end-video-call'),
    path('mark-expired/<str:request_id>/', views.MarkVideoCallExpiredView.as_view(), name='mark-video-call-expired'),
]
