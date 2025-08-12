from django.contrib import admin
from .models import WebDevelopment,AI_ML,DATA_SCIENCE,PythonProject,ContactMessage
# import your model

admin.site.register(WebDevelopment)
admin.site.register(AI_ML)
admin.site.register(DATA_SCIENCE)
admin.site.register(PythonProject)
admin.site.register(ContactMessage)