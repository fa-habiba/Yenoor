"""
URL configuration for my_shop project.
"""
from django.contrib import admin
from django.urls import path, include  # <-- Added 'include'
from django.conf import settings
from django.conf.urls.static import static
from store import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('product/<slug:slug>/', views.product_detail, name='product_detail'),
    path('coming-soon/', views.coming_soon, name='coming_soon'),
    
    # Cart URLs
    path('cart/', views.cart_detail, name='cart_detail'),
    path('cart/add/<int:product_id>/', views.cart_add, name='cart_add'),
    path('cart/remove/<int:product_id>/', views.cart_remove, name='cart_remove'),
    path('cart/increment/<int:product_id>/', views.cart_increment, name='cart_increment'),
    path('cart/decrement/<int:product_id>/', views.cart_decrement, name='cart_decrement'),

    # NEW: Order URLs
    path('orders/', include('orders.urls', namespace='orders')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)