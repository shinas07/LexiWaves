import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatRoom, ChatMessage
from accounts.models import User
from channels.db import database_sync_to_async

logger = logging.getLogger(__name__)

class ChatConsumer(AsyncWebsocketConsumer):
    connected_users = {}

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        messages = await self.get_messages()
        await self.send(text_data=json.dumps({
            'type': 'chat_history',
            'messages': messages
        }))

        # Add user to connected_users
        if self.room_name not in self.connected_users:
            self.connected_users[self.room_name] = set()
        self.connected_users[self.room_name].add(self.channel_name)

        # Send updated user count
        await self.update_user_count()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        # Remove user from connected_users
        if self.room_name in self.connected_users:
            self.connected_users[self.room_name].discard(self.channel_name)
            if not self.connected_users[self.room_name]:
                del self.connected_users[self.room_name]

        # Send updated user count
        await self.update_user_count()

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        email = text_data_json['email']
        username = text_data_json['username']

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'email': email,
                'username': username
            }
        )
        await self.save_message(email, username, message)

    async def chat_message(self, event):
        message = event['message']
        email = event['email']
        username = event['username']

        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': message,
            'email': email,
            'username': username
        }))

    async def update_user_count(self):
        count = len(self.connected_users.get(self.room_name, set()))
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_count',
                'count': count
            }
        )

    async def user_count(self, event):
        count = event['count']
        await self.send(text_data=json.dumps({
            'type': 'user_count',
            'count': count
        }))

    @database_sync_to_async
    def get_messages(self):
        messages = ChatMessage.objects.filter(room__name=self.room_name).order_by('-timestamp')[:50]
        return [{
            'email': msg.user.email,
            'username': f"{msg.user.first_name} {msg.user.last_name}",
            'message': msg.content,
            'timestamp': msg.timestamp.isoformat()
        } for msg in reversed(messages)]

    @database_sync_to_async
    def save_message(self, email, username, message):
        user = User.objects.get(email=email)
        room = ChatRoom.objects.get(name=self.room_name)
        ChatMessage.objects.create(room=room, user=user, content=message)