import pytest
import uuid
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()



@pytest.mark.django_db
class TestClassChatRoom:

    @pytest.fixture(scope='class')
    def create_users(self):
        # Create a tutor and a student
        tutor = User.objects.create_user(
            email='tutor@example.com', 
            password='tutorpass', 
            user_type='tutor'
        )
        student = User.objects.create_user(
            email='student@example.com', 
            password='studentpass', 
            user_type='student'
        )
        return tutor, student


# def test_simple_asswetion():
#     assert True