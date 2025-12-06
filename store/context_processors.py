from .cart import Cart

def cart(request):
    """
    Make the cart object available to all templates.
    """
    return {'cart': Cart(request)}