from rest_framework import serializers
from .models import Sumarticles

class SumarticlesSerializer(serializers.ModelSerializer):
	class Meta:
		model = Sumarticles
		fields = ('id', 'title', 'read_time', 'summary', 'hyperlink')