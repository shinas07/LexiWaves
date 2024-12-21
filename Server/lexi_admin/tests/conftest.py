import pytest 
from rest_framework.test import APIClient
from accounts.models import User

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def admin_user():
    return User.objects.create_user(email='admin@example.com',password='Admin@123',first_name='Admin',last_name='A',user_type='admin',is_staff=True)

@pytest.fixture
def non_admin_user():
    return User.objects.create_user(email='user@gmail.com',password='User@123',first_name='User',last_name='U',user_type='student')


