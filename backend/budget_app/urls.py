from django.urls import path
from . import views

app_name = 'budget_app'
urlpatterns = [
    path('fields/', views.Fields.as_view()),
]