# core/urls.py
from django.urls import path
from .views import DenunciaListCreateView

urlpatterns = [
    path('api/denuncias/', DenunciaListCreateView.as_view(), name='lista-denuncias'),
]