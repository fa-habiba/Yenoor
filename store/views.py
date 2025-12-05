from django.shortcuts import render
from .models import Product # Import the Product model

def home(request):
    # 1. Query the database: Get all Product objects where is_available is True
    available_products = Product.objects.filter(is_available=True)
    
    # 2. Package the data: Create a dictionary (called 'context') to send to the template
    context = {
        'products': available_products,
        'product_count': available_products.count(),
    }
    
    # 3. Render: Pass the request, the template name, and the packaged data (context)
    return render(request, 'home.html', context)