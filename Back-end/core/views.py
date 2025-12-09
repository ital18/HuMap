# core/views.py
from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Denuncia
from .serializers import DenunciaSerializer

class DenunciaListCreateView(generics.ListCreateAPIView):
    queryset = Denuncia.objects.all().order_by('-data_criacao')
    serializer_class = DenunciaSerializer
    parser_classes = (MultiPartParser, FormParser) # Essencial para upload de arquivos