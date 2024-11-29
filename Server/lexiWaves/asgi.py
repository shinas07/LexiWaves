# """
# ASGI config for lexiWaves project.

# It exposes the ASGI callable as a module-level variable named ``application``.

# For more information on this file, see
# https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
# """
import os
from django.core.asgi import get_asgi_application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lexiWaves.settings')
django_asgi_app = get_asgi_application()


from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
# from Community_chat.routing import websocket_urlpatterns

# application = ProtocolTypeRouter({
#     'http': django_asgi_app,
#     'websocket': AuthMiddlewareStack(
#         URLRouter(
#             websocket_urlpatterns
#         )
#     ),
# })


# import os
# from django.core.asgi import get_asgi_application
# from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.auth import AuthMiddlewareStack

# Import routing from both apps
from Community_chat.routing import websocket_urlpatterns as community_chat_patterns
from ClassChat.routing import websocket_urlpatterns as class_chat_patterns

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lexiWaves.settings')
# django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': AuthMiddlewareStack(
        URLRouter(
            # Combine both WebSocket routing URLs here
            community_chat_patterns + class_chat_patterns
        )
    ),
})
