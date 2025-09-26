# api/views.py
from django.http import JsonResponse
def ping(request):
    return JsonResponse({"pong": True})

# api/urls.py
from django.urls import path
from .views import ping
urlpatterns = [path("ping/", ping)]

# backend/urls.py (ajoute)
from django.urls import path, include
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
