from django.db import models

# Stores actual image bytes in PostgreSQL instead of file paths

class WebDevelopment(models.Model):
    photo = models.BinaryField()  # store image data directly
    title = models.CharField(max_length=225)
    content = models.TextField()

    def __str__(self):
        return self.title


class AI_ML(models.Model):
    photo = models.BinaryField()
    title = models.CharField(max_length=225)
    content = models.TextField()

    def __str__(self):
        return self.title


class DATA_SCIENCE(models.Model):
    photo = models.BinaryField()
    title = models.CharField(max_length=225)
    content = models.TextField()

    def __str__(self):
        return self.title    


class PythonProject(models.Model):
    photo = models.BinaryField()
    title = models.CharField(max_length=225)
    content = models.TextField()

    def __str__(self):
        return self.title


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    phone = models.CharField(max_length=13, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)  # auto timestamp

    def __str__(self):
        return f"Message from {self.name} ({self.email})"
