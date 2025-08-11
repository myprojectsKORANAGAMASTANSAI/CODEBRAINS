from django.urls import path,include
from . import views
urlpatterns = [
    path("",views.home,name="home"),
    path('web_development/', views.web_development, name='web_development'),
    path("AI_ML/",views.AI_ML,name="AI_ML"),
    path("DATA-SCIENCE/",views.data_science,name="DATA-SCIENCE"),
    path("pythonprojects/",views.pythonproject,name="pythonprojects"),
    path("contact_us/",views.contact_us,name="contact_us"),
    
    #views
    
    path("web_development_view/",views.web_development_view,name="web_development_view"),
    
    
    
    #contact_us
    path("contact_us_web_develpoment/",views.contact_us_web_develpoment,name="contact_us_web_develpoment"),
    path("contact_us_AIML/",views.contact_us_AIML,name="contact_us_AIML"),
    path("contact_us_datascience/",views.contact_us_datascience,name="contact_us_datascience"),
    path("contact_us_pythonproject/",views.contact_us_python,name="contact_us_pythonproject"),
    
    
    #thankyou
    path('thankyou/',views.thankyou,name='thankyou')
    
]
