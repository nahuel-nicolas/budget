from multiprocessing import context
from django.shortcuts import render
from .models import Automovil, Moto

# def index(request):
#     latest_question_list = Question.objects.order_by('-pub_date')[:5]
#     context = {'latest_question_list': latest_question_list}
#     return render(request, 'polls/index.html', context)

def index(request):
    context = {
        'automoviles': Automovil.objects.all,
        'motos': Moto.objects.all,
    }
    return render(request, 'budget_app/index.html', context)