# Generated by Django 3.1.8 on 2021-10-03 03:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('codenames', '0004_auto_20211003_0341'),
    ]

    operations = [
        migrations.AddField(
            model_name='userinfo',
            name='task',
            field=models.CharField(choices=[('S', 'Spymaster'), ('O', 'Operator')], default='', max_length=1),
            preserve_default=False,
        ),
    ]
