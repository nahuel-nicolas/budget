# Generated by Django 4.0.3 on 2022-03-15 18:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('budget_app', '0003_desperfecto_nombre'),
    ]

    operations = [
        migrations.AddField(
            model_name='respuesto',
            name='importado',
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AddField(
            model_name='respuesto',
            name='motocicletas',
            field=models.BooleanField(blank=True, default=True),
        ),
        migrations.AddField(
            model_name='respuesto',
            name='size',
            field=models.CharField(blank=True, choices=[('L', 'grande'), ('M', 'mediano'), ('S', 'pequeño')], default='mediano', max_length=20),
        ),
    ]
