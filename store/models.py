from django.db import models

# 1. Main Product Model
class Product(models.Model):
    # The name of the jewelry item (e.g., "Minimalist Hoop Earrings")
    name = models.CharField(max_length=200, unique=True)
    # A short, SEO-friendly identifier (e.g., "minimalist-hoop-earrings")
    slug = models.SlugField(max_length=200, unique=True)
    # Detailed description
    description = models.TextField(blank=True)
    # Price (base price, we will use variants for actual sale price)
    price = models.DecimalField(max_digits=6, decimal_places=2) 
    # Date when the product was added (great for "New Arrivals")
    created_date = models.DateTimeField(auto_now_add=True)
    # Is the product visible on the site?
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name

# 2. Product Variant Model (For sizes, colors, etc.)
class ProductVariant(models.Model):
    # This links the variant (e.g., "Size 8") back to the main Product
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    # Example: Ring Size, Necklace Length, Gold Plated/Silver Finish
    name = models.CharField(max_length=50) 

    # How many of this specific variant do we have?
    stock_quantity = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.product.name} - {self.name}"