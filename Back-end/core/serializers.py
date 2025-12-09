# core/serializers.py
from rest_framework import serializers
from .models import Denuncia, AnexoDenuncia

class AnexoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnexoDenuncia
        fields = ['id', 'arquivo']

class DenunciaSerializer(serializers.ModelSerializer):
    anexos = AnexoSerializer(many=True, read_only=True)
    # Campo para receber lista de arquivos no upload
    imagens = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

    class Meta:
        model = Denuncia
        fields = ['id', 'tipo', 'subtema', 'descricao', 'latitude', 'longitude', 'data_criacao', 'anexos', 'imagens']

    def create(self, validated_data):
        imagens_data = validated_data.pop('imagens', [])
        denuncia = Denuncia.objects.create(**validated_data)
        
        for imagem in imagens_data:
            AnexoDenuncia.objects.create(denuncia=denuncia, arquivo=imagem)
        
        return denuncia