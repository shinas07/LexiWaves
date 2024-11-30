# Generated by Django 5.1 on 2024-11-11 13:46

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tutor', '0018_question_answer_quizattempt'),
    ]

    operations = [
        migrations.CreateModel(
            name='TutorSlot',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('start_time', models.TimeField()),
                ('end_time', models.TimeField()),
                ('slot_hourly_rate', models.DecimalField(decimal_places=2, default=0.0, max_digits=6)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('tutor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='slots', to='tutor.tutor')),
            ],
        ),
        migrations.CreateModel(
            name='TutorSlotRateHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rate', models.DecimalField(decimal_places=2, max_digits=6)),
                ('changed_at', models.DateTimeField(auto_now_add=True)),
                ('slot', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rate_history', to='tutor.tutorslot')),
            ],
        ),
    ]