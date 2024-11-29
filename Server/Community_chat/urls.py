from django.urls import path
from .views import ChatRoomListView,UserDetailView



urlpatterns = [
    path('coummunity-chat-rooms/', ChatRoomListView.as_view(), name='language-list'),
    path('user-details/',UserDetailView.as_view(),name='user-details' ),

   
]