# Generated by Django 5.1 on 2024-09-10 06:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tutor', '0003_tutordetails'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tutordetails',
            name='tutor',
        ),
    ]
