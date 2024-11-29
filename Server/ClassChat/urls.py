
from django.urls import path
from .views import CheckOrCreateRoomView,TutorStudentsListView,AllCourseChatBoxesView

urlpatterns = [
    path('room/<int:tutor_id>/<int:course_id>/', CheckOrCreateRoomView.as_view(), name='check_or_create_room'),
    path('students/list/',TutorStudentsListView.as_view(),name='students-list'),
    path('chat-boxes/<int:student_id>/', AllCourseChatBoxesView.as_view(), name='chat-boxes'),
  

]

