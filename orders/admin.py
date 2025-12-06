from django.contrib import admin
from .models import Order, OrderItem

# This allows items to be seen INSIDE the Order page
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    raw_id_fields = ['product'] # Better for performance if you have many products

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    # Columns to show in the list view
    list_display = ['id', 'first_name', 'last_name', 'email',
                    'city', 'paid', 'created', 'updated']
    
    # Filters sidebar
    list_filter = ['paid', 'created', 'updated']
    
    # Inline items
    inlines = [OrderItemInline]