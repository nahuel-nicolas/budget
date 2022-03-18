from multiprocessing import context
from django.shortcuts import render
from .models import Automovil, Moto, Desperfecto, Repuesto, Vehiculo
from django.core.serializers import serialize
from django.http import HttpResponseRedirect
from django.urls import reverse

# def index(request):
#     latest_question_list = Question.objects.order_by('-pub_date')[:5]
#     context = {'latest_question_list': latest_question_list}
#     return render(request, 'polls/index.html', context)

# modelList = [Automovil, Moto, Desperfecto, Repuesto, Vehiculo]
"""
Pass dict of fields. 
With dict of fields make an object with all the dynamic data inputs. 
Add event to dynamic data inputs. 
Separate general dynamic data, relevant replacement dynamic data, failure dynamic data
Create box enumerator
Active post button
Call jose
Css
"""
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

def saveBudget(request):
    currentVehicleObject = None
    if request.POST['vehicle_type'] == 'bike':
        currentVehicleObject = Moto(
            marca=request.POST['marca'],
            modelo=request.POST['modelo'],
            patente=request.POST['patente'],
            cilindrada=request.POST['engine_size'],
        )
        currentVehicleObject.save()
    elif request.POST['vehicle_type'] == 'car':
        currentVehicleObject = Automovil(
            marca=request.POST['marca'],
            modelo=request.POST['modelo'],
            patente=request.POST['patente'],
            tipo=request.POST['car_types'],
            cantidad_puertas=int(request.POST.get('car_doors_number')),
        )
        currentVehicleObject.save()

    failuresAmount = int(request.POST.get('failure_counter'))
    for currentFailureIdx in range(failuresAmount):
        print(currentFailureIdx, request.POST.get(f'{currentFailureIdx}_mano_de_obra'))
        currentFailure = Desperfecto(
            descripcion=request.POST['descripcion'][currentFailureIdx],
            mano_de_obra=request.POST.get(f'{currentFailureIdx}_mano_de_obra'),
            tiempo_dias=request.POST.get(f'{currentFailureIdx}_tiempo_dias'),
        )
        currentFailure.save()
        currentReplacementsFromPost = [int(repuesto_id) for repuesto_id in request.POST[f'{currentFailureIdx}_field_container']]
        for currentReplacementIdFromPost in currentReplacementsFromPost:
            currentReplacement = Repuesto.objects.get(pk=currentReplacementIdFromPost)
            currentFailure.repuestos.add(currentReplacement)
        print([77, currentVehicleObject])
        currentVehicleObject.desperfectos.add(currentFailure)
    print(request.POST)
    print("Well done!")
    return HttpResponseRedirect(reverse('budget_app:index'))