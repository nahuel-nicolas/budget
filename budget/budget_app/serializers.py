from .models import Repuesto, Desperfecto, Moto, Automovil, Vehiculo
from rest_framework import serializers


class MotoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Moto
        fields = '__all__'

class RepuestoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Repuesto
        fields = '__all__'

class DesperfectoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Desperfecto
        fields = '__all__'

class AutomovilSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Automovil
        fields = '__all__'