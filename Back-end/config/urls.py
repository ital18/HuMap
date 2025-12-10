# config/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Painel Administrativo
    path('admin/', admin.site.urls),

    # App Core (Onde estão as denúncias e a API do mapa)
    path('', include('core.urls')), 

    # App Users (Onde estão Login e Cadastro)
    # A URL final será: /api/auth/cadastro/ e /api/auth/login/
    path('api/auth/', include('users.urls')), 
]

# Configuração para servir as imagens enviadas (Media) durante o desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)