import json
import logging
import jwt
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ClassChatRoom, ClassChatMessage
from accounts.models import User
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.conf import settings

logger = logging.getLogger(__name__)

class ClassChatConsumer(AsyncWebsocketConsumer):
    connected_users = {}

    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.user = await self.authenticate_user()
        logger.info(f'User is connected: {self.user}')
        if self.user is None:
            await self.close()
            return
        
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'

        # Verify room exists before proceeding
        room_exists = await self.get_room()
        if not room_exists:
            logger.error(f"Room {self.room_id} does not exist")
            await self.close()
            return

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
        # Send updated user count
        # await self.update_user_count()

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

       

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_content = data.get('message')
            email = data.get('email')
        

            if message_content is None:
                logger.warning("Received data does not containg ''")
                return

            # Save message first
            saved = await self.save_message(email, message_content)
            if saved:
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

           
    async def authenticate_user(self):
        token = self.scope['query_string'].decode().split('=')[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user = await database_sync_to_async(get_user_model().objects.get)(id=payload['user_id'])


            is_authorized = await self.is_user_allowed(user)
            if not is_authorized:
                logger.warning(f"Unauthorized user {user.email} tried to access room {self.room_id}")
                await self.close()
                return None
            return user
        except jwt.ExpiredSignatureError:
            await self.close()
            return None
        except jwt.InvalidTokenError:
            await self.close()
            return None
        

    @database_sync_to_async
    def is_user_allowed(self, user):
        """Check if the user is the tutor or the assigned user for the chat room."""
        try:
            room = ClassChatRoom.objects.get(room_id=self.room_id)
            logger.info('room is ready')
            return user == room.tutor or user == room.user 
        except ClassChatRoom.DoesNotExist:
            logger.info('getting error from here')
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
 

   
