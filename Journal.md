# Development Journal

## [05/12/25] - Initial Assessment
- Analyzed existing codebase.
- Established `Blueprint.md` for project roadmap.
- Identified need for Media configuration (Product Images).

## [05/12/25] - Phase 2: Media Configuration
- Installed `Pillow`.
- Configured `MEDIA_URL` and `MEDIA_ROOT` in `settings.py`.
- Updated `urls.py` to serve static media.
- Added `image` field to `Product` model.
- Ran migrations.

## [05/12/25] - Environment Fix & Phase 2 Setup
- Encountered `ModuleNotFoundError` for Django.
- Created and activated new Virtual Environment (`venv`).
- Installed `django` and `pillow`.
- Successfully ran `makemigrations` and `migrate`.
- Database schema now supports Product Images.

## [05/12/25] - Fixed Path Mismatch
- Detected mismatch between project path (`GitHub\Yenoor`) and venv path (`Ye_Noor`).
- Re-created local virtual environment.
- Re-installed `django` and `pillow`.
- Successfully ran migrations.

## [05/12/25] - Phase 2: Frontend Images
- Updated `home.html` to dynamically display `product.image.url`.
- Updated `main.css` to style product images with `object-fit: cover`.
- Verified image upload via Admin panel.

## [05/12/25] - Phase 2: Product Detail Page
- Created `product_detail` view in `store/views.py`.
- Added URL path `/product/<slug>/` in `urls.py`.
- Created `product_detail.html` template.
- Styled detail page in `main.css`.
- Linked Homepage cards to Detail pages.

## [06/12/25] - Phase 3: Cart Engine
- Created `store/cart.py` logic.
- Added `cart_add`, `cart_remove`, `cart_detail` views.
- Wired up URLs.
- Created `cart_detail.html` template.
- Connected "Add to Cart" button on detail page.
## [06/12/25] - Phase 3: Cart Refinement
- Added `decrement` logic to `cart.py`.
- Added `cart_increment` and `cart_decrement` views.
- Updated `cart_detail.html` with +/- buttons.
- Styled buttons in `main.css`.
- Updated `base.html` to link the header Shopping Bag icon to `cart_detail` URL. ##global cart access

## [06/12/25] - Phase 3 Complete: Context Processors
- Created `store/context_processors.py` to make cart global.
- Registered processor in `settings.py`.
- Added dynamic item count badge to `base.html`.
- Styled badge in `main.css`.
- **PHASE 3 COMPLETE.**

## [06/12/25] - Phase 4: Order Models
- Created new app `orders`.
- Registered `orders` in `settings.py`.
- Defined `Order` and `OrderItem` models.
- Migrated database.

## [06/12/25] - Phase 4: Checkout Implementation
- Created `OrderCreateForm`.
- Created `order_create` view (handles logic & saving).
- Created `orders/urls.py` and linked to main URLs.
- Built `create.html` (Checkout) and `created.html` (Success) templates.
- Styled the checkout process.

## [06/12/25] - Phase 4: Admin Dashboard
- Configured `orders/admin.py`.
- Added `OrderItemInline` to view products within an order.
- Verified orders are visible and manageable in the Admin Panel.