from datetime import datetime, timedelta
from django.utils import timezone
from .models import StudyStreak, StudyActivity

class StreakService:
    @staticmethod
    def update_streak(user, course, duration):
        today = timezone.now().date()

        streak, created = StudyStreak.objects.get_or_create(user=user)

        activity, created = StudyActivity.objects.get_or_create(
            user=user,
            course=course,
            watched_date=today,
        )

        if not created:
            activity.watch_duration += duration
            activity.save()

        if not streak.last_study_date:
            streak.current_streak += 1
        else:
            yesterday = today - timedelta(days=1)
            if streak.last_study_date == yesterday:
                streak.current_streak += 1
            elif streak.last_study_date != today:
                streak.current_streak = 1

        if streak.current_streak > streak.max_streak:
            streak.max_streak = streak.current_streak

        streak.last_study_date = today
        streak.total_study_days += 1 if created else 0
        streak.save()

        return streak