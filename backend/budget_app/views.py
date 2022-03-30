from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Automovil, Moto, Desperfecto, Repuesto, Vehiculo
from rest_framework import viewsets
from rest_framework import permissions
from .serializers import AutomovilSerializer, MotoSerializer, RepuestoSerializer, DesperfectoSerializer

modelList = [Automovil, Moto, Desperfecto, Repuesto, Vehiculo]

def getModelFields(model):
    fieldNames = []
    for field in model._meta.fields:
        if field.name != 'id':
            fieldNames.append(field.name)
    return fieldNames
    # return [field.name for field in model._meta.fields]

def getAllModelFields():
    allModelFields = {}
    for currentModel in modelList:
        currentModelName = currentModel.__name__.lower()
        allModelFields[currentModelName] = getModelFields(currentModel)
    return allModelFields

class Fields(APIView):
    def get(self, request, format=None):
        return Response(getAllModelFields())

class AutomovilViewSet(viewsets.ModelViewSet):
    queryset = Automovil.objects.all()
    serializer_class = AutomovilSerializer
    permission_classes = [permissions.IsAuthenticated]

class MotoViewSet(viewsets.ModelViewSet):
    queryset = Moto.objects.all()
    serializer_class = MotoSerializer
    permission_classes = [permissions.IsAuthenticated]

class RepuestoViewSet(viewsets.ModelViewSet):
    queryset = Repuesto.objects.all()
    serializer_class = RepuestoSerializer
    permission_classes = [permissions.IsAuthenticated]

class DesperfectoViewSet(viewsets.ModelViewSet):
    queryset = Desperfecto.objects.all()
    serializer_class = DesperfectoSerializer
    permission_classes = [permissions.IsAuthenticated]