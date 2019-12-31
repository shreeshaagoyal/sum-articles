from django.db import models

# Create your models here.
class Sumarticles(models.Model):
	title = models.CharField(max_length=255, blank=False)
	read_time = models.IntegerField(default=0)
	summary = models.CharField(max_length=1024, default='...')
	hyperlink = models.URLField(max_length=1024, db_index=True, unique=False, blank=False)

def _str_(self):
	return self.title
