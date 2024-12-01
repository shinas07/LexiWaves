import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User, Student

@pytest.mark.django_db
class TestAuthentication:
    @pytest.fixture
    def user_data(self):
        return{
            'email':'test@example.com',
            'password': 'Test@123',
            'first_name': 'Test',
            'last_name' : 'User',
        }
    
    @pytest.fixture
    def api_client(self):
        return APIClient()
    
    def test_signup(self, api_cilent, user_data):
        url = reverse('signup')
        response = api_cilent(url, user_data)
        assert response.status_code == status.HTTP_200_OK
        assert 'OTP sent successfully' in response.data['message']

    def test_login(self, api_client, user_data):
        user = User.objects.create_user(**user_data, user_type='student')
        Student.objects.create(user=user)

        url = reverse('login')
        response = api_client.post(url,{
            'email': user_data['email'],
            'password': user_data['password']
        })
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data