from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'^ws/classchat/(?P<room_id>[\w\-]+)/$', consumers.ClassChatConsumer.as_asgi()),
]