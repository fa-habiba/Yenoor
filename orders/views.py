from django.shortcuts import render
from .models import OrderItem
from .forms import OrderCreateForm
from store.cart import Cart

def order_create(request):
    cart = Cart(request)
    if request.method == 'POST':
        form = OrderCreateForm(request.POST)
        if form.is_valid():
            # 1. Save the Order info (address, name, etc.)
            order = form.save()
            
            # 2. Save each Cart item as an OrderItem
            for item in cart:
                OrderItem.objects.create(
                    order=order,
                    product=item['product'],
                    price=item['price'],
                    quantity=item['quantity']
                )
            
            # 3. Clear the cart
            cart.clear()
            
            # 4. Render the success page
            return render(request, 'created.html', {'order': order})
            
    else:
        # If it's a GET request, just show the empty form
        form = OrderCreateForm()
        
    return render(request, 'create.html', {'cart': cart, 'form': form})