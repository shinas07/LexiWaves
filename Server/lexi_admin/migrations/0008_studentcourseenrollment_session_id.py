# Generated by Django 5.1 on 2024-11-24 11:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lexi_admin', '0007_adminrevenue'),
    ]

    operations = [
        migrations.AddField(
            model_name='studentcourseenrollment',
            name='session_id',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
