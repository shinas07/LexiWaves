from .views import LatestCoursesView
from django.urls import path

urlpatterns = [
     path('latest-courses/', LatestCoursesView.as_view(), name='latest-courses'),
]