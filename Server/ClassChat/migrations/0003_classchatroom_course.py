# Generated by Django 5.1 on 2024-11-13 12:18

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ClassChat', '0002_initial'),
        ('tutor', '0019_tutorslot_tutorslotratehistory'),
    ]

    operations = [
        migrations.AddField(
            model_name='classchatroom',
            name='course',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='chat_rooms', to='tutor.course'),
        ),
    ]
