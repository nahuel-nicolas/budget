from django.db import models

class Respuesto (models.Model):
    nombre = models.CharField(max_length=100)
    precio = models.IntegerField()

class Desperfecto(models.Model):
    descripcion = models.TextField()
    mano_de_obra = models.IntegerField()
    tiempo = models.TimeField()
    respuestos = models.ManyToManyField(Respuesto)

class Vehiculo(models.Model):
    marca = models.CharField(max_length=200)
    modelo = models.CharField(max_length=200)
    patente = models.CharField(max_length=200)
    desperfectos = models.ManyToManyField(Desperfecto)

    class Meta:
        abstract = True

class Automovil(Vehiculo):
    # COMPACTO = 'CM'
    # SEDAN = "SD"
    # MONOVOLUMEN = "MV"
    # UTILITARIO = "UT"
    # LUJO = "LJ"
    # AUTOMOVIL_TIPOS = [
    #     (COMPACTO, 'Compacto'),
    #     (SEDAN, 'Sedan'),
    #     (MONOVOLUMEN, 'Monovolumen'),
    #     (UTILITARIO, 'Utilitario'),
    #     (LUJO, 'Lujo')
    # ]
    tipo = models.CharField(max_length=50)
    cantidad_puertas = models.IntegerField()

class Moto(Vehiculo):
    cilindrada = models.CharField(max_length=10)


