import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ClassChatRoom, ClassChatMessage
from accounts.models import User
from channels.db import database_sync_to_async

logger = logging.getLogger(__name__)

class ClassChatConsumer(AsyncWebsocketConsumer):
    connected_users = {}

    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'
        
        # Get authenticated user from scope
        if self.scope['user'].is_anonymous:
            logger.error("Anonymous user tried to connect, authentication required")
            await self.close()
            return
            
        self.user = self.scope['user']
        logger.info(f"User {self.user.email} attempting to connect to room {self.room_id}")
        
        # Verify room exists before proceeding
        room_exists = await self.get_room()
        if not room_exists:
            logger.error(f"Room {self.room_id} does not exist")
            await self.close()
            return
            
        # Validate user access to the room
        has_access = await self.user_can_access_room()
        if not has_access:
            logger.error(f"User {self.user.email} is not allowed to join room {self.room_id}")
            await self.close()
            return
            
        logger.info(f"User {self.user.email} authenticated and authorized for room {self.room_id}")

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # Send chat history
        messages = await self.get_messages()
        await self.send(text_data=json.dumps({
            'type': 'chat_history',
            'messages': messages
        }))

        # Track connected users
        if self.room_id not in self.connected_users:
            self.connected_users[self.room_id] = set()
        self.connected_users[self.room_id].add(self.channel_name)
        logger.info(f"User {self.user.email} connected to room {self.room_id}")

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

        # Remove user from connected_users
        if hasattr(self, 'room_id') and self.room_id in self.connected_users:
            self.connected_users[self.room_id].discard(self.channel_name)
            if not self.connected_users[self.room_id]:
                del self.connected_users[self.room_id]
        
        if hasattr(self, 'user'):
            logger.info(f"User {self.user.email} disconnected from room {self.room_id}")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_content = data['message']
            email = data['email']
            
            # Verify the email matches the authenticated user
            if email != self.user.email:
                logger.warning(f"Email mismatch in message: {email} vs authenticated {self.user.email}")
                return

            # Save message first
            saved = await self.save_message(email, message_content)
            if saved:
                logger.info(f"Message from {email} saved and broadcasting to room {self.room_id}")
                # Then broadcast to group
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': message_content,
                        'email': email,
                    }
                )
        except Exception as e:
            logger.error(f"Error in receive: {e}")

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message'],
            'email': event['email'],
        }))

    @database_sync_to_async
    def user_can_access_room(self):
        try:
            room = ClassChatRoom.objects.get(room_id=self.room_id)
            # Check if user is either the tutor or the student in this room
            return (room.tutor_id == self.user.id or room.user_id == self.user.id)
        except Exception as e:
            logger.error(f"Error checking room access: {e}")
            return False

    @database_sync_to_async
    def get_room(self):
        try:
            return ClassChatRoom.objects.filter(room_id=self.room_id).exists()
        except Exception as e:
            logger.error(f"Error checking room existence: {e}")
            return False

    @database_sync_to_async
    def get_messages(self):
        try:
            room = ClassChatRoom.objects.get(room_id=self.room_id)
            messages = ClassChatMessage.objects.filter(room=room).order_by('-timestamp')[:50]
            return [{
                'id': str(msg.id),
                'email': msg.user.email,
                'message': msg.content,
                'timestamp': msg.timestamp.isoformat()
            } for msg in reversed(messages)]
        except Exception as e:
            logger.error(f"Error getting messages: {e}")
            return []

    @database_sync_to_async
    def save_message(self, email, message):
        try:
            user = User.objects.get(email=email)
            room = ClassChatRoom.objects.get(room_id=self.room_id)
            ClassChatMessage.objects.create(
                room=room,
                user=user,
                content=message
            )
            return True
        except Exception as e:
            logger.error(f"Error saving message: {e}")
            return False