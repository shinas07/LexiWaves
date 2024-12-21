import pytest
from django.urls import reverse
from rest_framework import status

@pytest.mark.django_db
class TestAdminLogin:
    def test_admin_login_success(self, api_client, admin_user):
        url = reverse('lexi_admin:admin_login')
        data = {
            'email': 'admin@example.com',
            'password': 'Admin@123'
        }

        response = api_client.post(url, data)

        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data
        assert response.data['user']['first_name'] == 'Admin'
        assert response.data['user']['user_type'] == 'admin'

    def test_admin_login_missing_credentials(self, api_client):
        url = reverse('lexi_admin:admin_login')

        response1 = api_client.post(url, {'email':'Admin@gmail.com'})
        assert response1.status_code == status.HTTP_400_BAD_REQUEST

        response2 = api_client.post(url, {'password':'Admin@123'})
        assert response2.status_code == status.HTTP_400_BAD_REQUEST

        response3 = api_client.post(url, {})
        assert response3.status_code == status.HTTP_400_BAD_REQUEST

    def test_admin_login_invalid_credentials(self, api_client, admin_user):
        url = reverse('lexi_admin:admin_login')
        data = {
            'email':'admin@example.com',
            'password':"WrongPassword"
        }

        response = api_client.post(url, data)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert 'error' in response.data

    def test_non_admin_login(self, api_client, non_admin_user):
        url = reverse('lexi_admin:admin_login')
        data = {
            'email': 'user@example.com',
            'password':'User@123'
        }

        response = api_client.post(url, data)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert 'error' in response.data
        