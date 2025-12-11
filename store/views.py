from django.shortcuts import render, get_object_or_404
from .models import Product
#to import cart class
from django.shortcuts import render, get_object_or_404, redirect
from django.views.decorators.http import require_POST
from .models import Product
from .cart import Cart # Import the class we just created
def home(request):
    """
    Shows all available products on the homepage.
    """
    products = Product.objects.filter(is_available=True)
    context = {
        'products': products,
    }
    return render(request, 'home.html', context)

def product_detail(request, slug):
    """
    Shows a single product's details.
    """
    # get_object_or_404 is a safe way to get a product or show a "Page Not Found" error
    product = get_object_or_404(Product, slug=slug, is_available=True)
    
    context = {
        'product': product,
    }
    return render(request, 'product_detail.html', context)

# ... (existing home and product_detail views)

@require_POST
def cart_add(request, product_id):
    """
    Process the 'Add to Cart' button.
    """
    cart = Cart(request)
    product = get_object_or_404(Product, id=product_id)
    # For now, we default to quantity 1. Later we can add a form to select quantity.
    cart.add(product=product, quantity=1)
    
    # Stay on the same page or go to cart? Let's go to the cart page for confirmation.
    return redirect('cart_detail')

def cart_remove(request, product_id):
    """
    Remove an item from the cart.
    """
    cart = Cart(request)
    product = get_object_or_404(Product, id=product_id)
    cart.remove(product)
    return redirect('cart_detail')

def cart_detail(request):
    """
    Display the cart page.
    """
    cart = Cart(request)
    return render(request, 'cart_detail.html', {'cart': cart})

def cart_increment(request, product_id):
    """
    Increase quantity by 1
    """
    cart = Cart(request)
    product = get_object_or_404(Product, id=product_id)
    cart.add(product=product) # Default adds 1
    return redirect('cart_detail')

def cart_decrement(request, product_id):
    """
    Decrease quantity by 1
    """
    cart = Cart(request)
    product = get_object_or_404(Product, id=product_id)
    cart.decrement(product=product)
    return redirect('cart_detail')

def coming_soon(request):
    """
    Renders the 3D Coming Soon page with interactive games.
    """
    return render(request, 'coming_soon.html')