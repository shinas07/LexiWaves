# Generated by Django 5.1 on 2024-11-24 11:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('lexi_admin', '0008_studentcourseenrollment_session_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='adminrevenue',
            old_name='coruse',
            new_name='course',
        ),
    ]
