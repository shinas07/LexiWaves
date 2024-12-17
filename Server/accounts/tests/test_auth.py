import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User, Student, OTPVerification
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
class TestAuthentication:
    @pytest.fixture
    def user_data(self):
        return {
            'email': 'test@example.com',
            'password': 'Test@123',
            'first_name': 'Test',
            'last_name': 'User',
            'user_type': 'student'
        }
    
    @pytest.fixture
    def api_client(self):
        return APIClient()
    
    def test_signup_and_verify(self, api_client, user_data):
        url = reverse('signup')
        response = api_client.post(url, user_data, format='json') 
        assert response.status_code == status.HTTP_200_OK
        assert 'OTP sent successfully' in response.data['message']
        

        otp_obj = OTPVerification.objects.get(email=user_data['email'])

        verify_url = reverse('verify-email')
        verify_data = {
            'email': user_data['email'],
            'otp': otp_obj.otp,
            'user_data': user_data
        }
        response = api_client.post(verify_url, verify_data, format='json')  
        assert response.status_code == status.HTTP_201_CREATED

    def test_login(self, api_client, user_data):
        user = User.objects.create_user(**user_data)
        
        url = reverse('login')
        response = api_client.post(url, {
            'email': user_data['email'],
            'password': user_data['password']
        }, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert response.data['user']['user_type'] == 'student'