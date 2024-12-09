# Generated by Django 5.1 on 2024-11-15 11:26

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('video_call', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='videocallrequest',
            name='student',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='send_call_request', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='videocallrequest',
            name='tutor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_call_requests', to=settings.AUTH_USER_MODEL),
        ),
    ]
