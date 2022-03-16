from multiprocessing import context
from django.shortcuts import render
from .models import Automovil, Moto, Desperfecto, Repuesto, Vehiculo
from django.core.serializers import serialize

# def index(request):
#     latest_question_list = Question.objects.order_by('-pub_date')[:5]
#     context = {'latest_question_list': latest_question_list}
#     return render(request, 'polls/index.html', context)

def getModelFields(model):
    return [field.name for field in model._meta.fields]

def getModelData(model, isAbstract=False):
    # modelName = model.__name__.lower()
    value = {
        "fields": getModelFields(model),
    }
    if not isAbstract:
        value["model"] = model
        value["model_json"] = serialize('json', model.objects.all())
    return value

def index(request):
    context = {
        'automovil': getModelData(Automovil),
        'moto': getModelData(Moto),
        'desperfecto': getModelData(Desperfecto),
        'repuesto': getModelData(Repuesto),
        'vehiculo': getModelData(Vehiculo, isAbstract=True),
    }
    return render(request, 'budget_app/index.html', context)