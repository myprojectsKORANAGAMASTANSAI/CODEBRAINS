from django.shortcuts import render,redirect
from . import models
from django.core.mail import send_mail
from .models import ContactMessage
# Create your views here.


def home(request):
    
    return render(request,"index.html")

def web_development(request):
    projects = models.WebDevelopment.objects.all()  
    return render(request, "full_stack_projects.html", {"projects": projects})
    
    

def AI_ML(request):
    projects = models.AI_ML.objects.all()  
    return render(request, "AI_ML.HTML", {"projects": projects})
    

def data_science(request):
    projects = models.DATA_SCIENCE.objects.all()  
    return render(request, "DATA-SCIENCE.html", {"projects": projects})
    
def pythonproject(request):
    projects = models.pythonproject.objects.all()  
    return render(request, "pythonprojects.html", {"projects": projects})
    

def web_development_view(request):
    projects = models.WebDevelopment.objects.all()  
    return render(request, "full_stack_projects.html", {"projects": projects})




def contact_us(request):
    if request.method == "POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        message = request.POST.get("message")
        phone=request.POST.get("phone")

        # Save to DB
        ContactMessage.objects.create(name=name, email=email, message=message,phone=phone)

        return redirect('/')  # You can make a success page or redirect back

    return render(request, 'index.html')


def contact_us_web_develpoment(request):
    if request.method == "POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        message = request.POST.get("message")
        phone=request.POST.get("phone")

        # Save to DB
        ContactMessage.objects.create(name=name, email=email, message=message,phone=phone)

        return redirect('web_development')  # You can make a success page or redirect back

    return render(request, 'full_stack_projects.html')

def contact_us_AIML(request):
    if request.method == "POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        message = request.POST.get("message")
        phone=request.POST.get("phone")

        # Save to DB
        ContactMessage.objects.create(name=name, email=email, message=message,phone=phone)

        return redirect('AI_ML')  # You can make a success page or redirect back

    return render(request, 'AI_ML.html')

def contact_us_datascience(request):
    if request.method == "POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        message = request.POST.get("message")
        phone=request.POST.get("phone")

        # Save to DB
        ContactMessage.objects.create(name=name, email=email, message=message,phone=phone)

        return redirect('DATA-SCIENCE')  # You can make a success page or redirect back

    return render(request, 'DATA-SCIENCE.html')


def contact_us_python(request):
    if request.method == "POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        message = request.POST.get("message")
        phone=request.POST.get("phone")

        # Save to DB
        ContactMessage.objects.create(name=name, email=email, message=message,phone=phone)

        return redirect('pythonprojects')  # You can make a success page or redirect back

    return render(request, 'pythonprojects.html')

