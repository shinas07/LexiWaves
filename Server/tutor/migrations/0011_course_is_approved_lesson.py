# Generated by Django 5.1 on 2024-09-24 05:13

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tutor', '0010_alter_course_thumbnail_url_alter_course_video_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='is_approved',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='Lesson',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True, null=True)),
                ('video_url', models.TextField(max_length=1000)),
                ('order', models.PositiveIntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lessons', to='tutor.course')),
            ],
        ),
    ]
