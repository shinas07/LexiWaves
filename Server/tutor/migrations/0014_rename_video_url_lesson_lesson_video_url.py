# Generated by Django 5.1 on 2024-09-24 12:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tutor', '0013_rename_preview_url_course_video_url'),
    ]

    operations = [
        migrations.RenameField(
            model_name='lesson',
            old_name='video_url',
            new_name='lesson_video_url',
        ),
    ]
