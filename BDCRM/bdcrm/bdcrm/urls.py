from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from crm import views 

router = routers.DefaultRouter()
router.register(r'leads', views.LeadViewSet)
router.register(r'activities', views.ActivityViewSet) # New
router.register(r'tasks', views.TaskViewSet)          # New
router.register(r'tags', views.TagViewSet)            # New
router.register(r'companies', views.CompanyViewSet)   # New
router.register(r'courses', views.CourseViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]