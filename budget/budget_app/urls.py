from django.urls import path
from . import views

app_name = 'budget_app'
urlpatterns = [
    path('', views.index, name='index'),
]