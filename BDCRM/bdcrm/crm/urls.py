from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from crm import views 

router = routers.DefaultRouter()
router.register(r'leads', views.LeadViewSet)
router.register(r'courses', views.CourseViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]