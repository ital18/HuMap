# core/models.py
from django.db import models

class Denuncia(models.Model):
    TIPO_CHOICES = [
        ('violencia', 'Violência Urbana'),
        ('saneamento', 'Saneamento Básico'),
        ('planejamento', 'Infraestrutura e Mobilidade'),
        ('meioambiente', 'Meio Ambiente'),
    ]

    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    subtema = models.CharField(max_length=100, blank=True, null=True)
    descricao = models.TextField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tipo} - {self.data_criacao}"

class AnexoDenuncia(models.Model):
    denuncia = models.ForeignKey(Denuncia, related_name='anexos', on_delete=models.CASCADE)
    arquivo = models.ImageField(upload_to='denuncias/%Y/%m/')
    uploaded_at = models.DateTimeField(auto_now_add=True)