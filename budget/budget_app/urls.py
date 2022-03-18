from django.urls import path
from . import views

app_name = 'budget_app'
urlpatterns = [
    path('', views.index, name='index'),
    path('save-budget/', views.saveBudget, name='save_budget'),
]