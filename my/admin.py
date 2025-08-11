from django.contrib import admin
from .models import WebDevelopment,AI_ML,DATA_SCIENCE,pythonproject,ContactMessage
# import your model

@admin.register(WebDevelopment)
class WebDevelopmentAdmin(admin.ModelAdmin):
    list_display = ('title',)  # columns to show in admin list

@admin.register(AI_ML)
class AI_ML(admin.ModelAdmin):
    list_display = ('title',)

@admin.register(DATA_SCIENCE)
class datascience(admin.ModelAdmin):
    list_display = ('title',)
    
@admin.register(pythonproject)
class pythonproject(admin.ModelAdmin):
    list_display = ('title',)

@admin.register(ContactMessage)
class ContactMessage(admin.ModelAdmin):
    list_display = ('name',)