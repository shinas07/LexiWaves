# This imports the Celery instance we created in celery.py
from .celery import app as celery_app

# This makes the celery_app available when anyone imports from your project
__all__ = ('celery_app',)