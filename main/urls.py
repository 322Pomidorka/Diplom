"""main URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt

from main import views

urlpatterns = [
    path('', views.HomePage, name='index'),
    path('json-add-basket/', views.Json_add_basket.as_view(), name='json_add_basket'),
    path('about/', views.about, name='about'),
    path('account/', views.account, name='account'),
    path('cart/', views.cart, name='cart'),
    path('checkout/', views.checkout, name='checkout'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('auth/', include('authentication.urls')),
    path('product/', views.product, name='product'),
    path('shop/', views.Shop.as_view(), name='shop'),
    path('wishlist/', views.wishlist, name='wishlist'),
    path('json-filter/', views.JsonFilterProductsView.as_view(), name='json_filter'),
    path('order-create/', views.OrderCreate.as_view(), name='order_create'),
    path('admin/', admin.site.urls),

]
