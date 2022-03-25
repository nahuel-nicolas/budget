from pyexpat import model
from django.db import models
from random import randint, choice

class Repuesto (models.Model):
    nombre = models.CharField(max_length=100)
    precio = models.IntegerField(default=0, blank=True)
    size = models.CharField(
        max_length=20,
        choices= [('L', 'Grande'), ('M', 'Mediano'), ('S', 'Pequeño')], 
        default='M', 
        blank=True,
    )
    importado = models.BooleanField(default=False, blank=True)

    def __str__(self):
        importado = 'importado' if self.importado else 'nacional'
        return f"{self.nombre} - Tamaño {self.size} - Origen {importado}"

    def save(self, *args, **kwargs):
        if self.precio == 0:
            self.precio = randint(21, 2100)
        super().save(*args, **kwargs)

class Desperfecto(models.Model):
    descripcion = models.TextField(default='Describe el desperfecto...', blank=True)
    mano_de_obra = models.IntegerField()
    tiempo_dias = models.IntegerField()
    repuestos = models.ManyToManyField(Repuesto)

class Vehiculo(models.Model):
    marca = models.CharField(max_length=200)
    modelo = models.CharField(max_length=200)
    patente = models.CharField(max_length=200)
    desperfectos = models.ManyToManyField(Desperfecto)

    class Meta:
        abstract = True

class Automovil(Vehiculo):
    AUTOMOVIL_TIPOS = [
        ('CM', 'Compacto'),
        ("MV", 'Monovolumen'),
        ("SD", 'Sedan'),
        ("UT", 'Utilitario'),
        ("LJ", 'Lujo')
    ]
    tipo = models.CharField(max_length=50, choices=AUTOMOVIL_TIPOS)
    cantidad_puertas = models.IntegerField(choices=[(2, 2), (4, 4)])

class Moto(Vehiculo):
    cilindrada = models.CharField(
        max_length=10, 
        choices=[('S', '125 cc'), ('M', '250 cc'), ('L', '500 cc')],
    )

