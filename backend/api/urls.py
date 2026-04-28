from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HospitalViewSet, AmbulanceViewSet, EmergencyViewSet,
    RouteTrackingViewSet, NotificationViewSet
)

router = DefaultRouter()
router.register(r'hospitals', HospitalViewSet)
router.register(r'ambulances', AmbulanceViewSet)
router.register(r'emergencies', EmergencyViewSet)
router.register(r'route-tracking', RouteTrackingViewSet)
router.register(r'notifications', NotificationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
