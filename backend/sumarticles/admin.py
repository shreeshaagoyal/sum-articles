from django.contrib import admin
from .models import Sumarticles

class SumarticlesAdmin(admin.ModelAdmin):
	list_display = ('title', 'read_time', 'summary', 'hyperlink')

# Register your models here.
admin.site.register(Sumarticles, SumarticlesAdmin)
