from django.db import models

# Create your models here.

from django.db import models

class WebDevelopment(models.Model):
    photo = models.ImageField(upload_to='web_development_photos/')  # specify upload folder
    title = models.CharField(max_length=225)
    content = models.TextField()  # use TextField for longer content

    def __str__(self):
        return self.title

class AI_ML(models.Model):
    photo = models.ImageField(upload_to='aiml/')  # specify upload folder
    title = models.CharField(max_length=225)
    content = models.TextField()  # use TextField for longer content

    def __str__(self):
        return self.title

class DATA_SCIENCE(models.Model):
    photo = models.ImageField(upload_to='ds&da/')  # specify upload folder
    title = models.CharField(max_length=225)
    content = models.TextField()  # use TextField for longer content

    def __str__(self):
        return self.title    

class pythonproject(models.Model):
    photo = models.ImageField(upload_to='pythonproject/')  # specify upload folder
    title = models.CharField(max_length=225)
    content = models.TextField()  # use TextField for longer content

    def __str__(self):
        return self.title
    
# models.py
from django.db import models

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    phone = models.CharField(max_length=13, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)  # auto timestamp when created

    def __str__(self):
        return f"Message from {self.name} ({self.email})"
