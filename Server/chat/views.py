from rest_framework import generics
from .models import ChatRoom
from .serializers import ChatRoomSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
from rest_framework.response import Response
import logging

logger = logging.getLogger(__name__)




class ChatRoomListView(generics.ListCreateAPIView):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer

# Userdatafetchig
class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)  
        return Response(serializer.data)
