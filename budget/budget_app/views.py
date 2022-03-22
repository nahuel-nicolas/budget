from multiprocessing import context
from django.shortcuts import render
from .models import Automovil, Moto, Desperfecto, Repuesto
from rest_framework import viewsets
from rest_framework import permissions
from .serializers import AutomovilSerializer, MotoSerializer, RepuestoSerializer, DesperfectoSerializer

# def index(request):
#     latest_question_list = Question.objects.order_by('-pub_date')[:5]
#     context = {'latest_question_list': latest_question_list}
#     return render(request, 'polls/index.html', context)

# def index(request):
#     context = {
#         'automoviles': Automovil.objects.all,
#         'motos': Moto.objects.all,
#     }
#     return render(request, 'budget_app/index.html', context)

class AutomovilViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Automovil.objects.all()
    serializer_class = AutomovilSerializer
    # permission_classes = [permissions.IsAuthenticated]

class MotoViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Moto.objects.all()
    serializer_class = MotoSerializer

class RepuestoViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Repuesto.objects.all()
    serializer_class = RepuestoSerializer

class DesperfectoViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Desperfecto.objects.all()
    serializer_class = DesperfectoSerializer