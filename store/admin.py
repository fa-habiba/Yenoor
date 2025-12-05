from django.contrib import admin
from .models import Product, ProductVariant

# This allows us to edit Variants directly on the Product page
class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1 # Show 1 extra empty variant field

# This is the main Product Admin configuration
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # What fields to show on the main list page
    list_display = ('name', 'price', 'is_available', 'created_date')
    # Allow searching by name
    search_fields = ('name', 'description')
    # Automatically populate the slug from the name
    prepopulated_fields = {'slug': ('name',)} 
    # Link the variants to the product page
    inlines = [ProductVariantInline]