# Back-end/users/serializers.py
from rest_framework import serializers
from .models import User

class CadastroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True) # Campo virtual para validação
    nome = serializers.CharField(source='first_name') # Mapeia 'nome' do HTML para 'first_name' do Django

    class Meta:
        model = User
        fields = ['nome', 'email', 'password', 'confirm_password', 'cpf', 'data_nascimento', 'telefone', 'receber_notificacoes']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "As senhas não coincidem."})
        return data

    def create(self, validated_data):
        # Remove a confirmação de senha antes de salvar
        validated_data.pop('confirm_password')
        
        # Cria o usuário de forma segura (criptografando a senha)
        user = User.objects.create_user(
            username=validated_data['email'], # Usa o email como username
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            cpf=validated_data.get('cpf'),
            data_nascimento=validated_data.get('data_nascimento'),
            telefone=validated_data.get('telefone'),
            receber_notificacoes=validated_data.get('receber_notificacoes', False)
        )
        return user