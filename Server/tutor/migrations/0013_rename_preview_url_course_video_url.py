# Generated by Django 5.1 on 2024-09-24 12:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tutor', '0012_rename_video_url_course_preview_url'),
    ]

    operations = [
        migrations.RenameField(
            model_name='course',
            old_name='preview_url',
            new_name='video_url',
        ),
    ]
