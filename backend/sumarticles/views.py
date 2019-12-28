from django.shortcuts import render
from rest_framework import viewsets
from .serializers import SumarticlesSerializer
from .models import Sumarticles

# Create your views here.
class SumarticlesView(viewsets.ModelViewSet):
	serializer_class = SumarticlesSerializer
	queryset = Sumarticles.objects.all()
