# Generated by Django 5.1 on 2024-12-10 04:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0009_user_google_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='google_id',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
