from django.core.paginator import Paginator
from django.db.models import Q
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from django.views import View
from django.views.generic import ListView

from main import settings
from shop.cart import Cart
from shop.models import *


def HomePage(request):
    cart_user = Cart(request)

    quantity = cart_user.__len__()

    context = {"quantity": quantity,
               "basket_products": cart_user.get_data()
               }

    return render(request, 'index.html', context)


def about(request):
    return render(request, 'about.html')


def account(request):
    return render(request, 'account.html')


def cart(request):
    return render(request, 'cart.html')


def forgot_password(request):
    return render(request, 'forgot-password.html')


def login(request):
    return render(request, 'login.html')


def product(request):
    return render(request, 'product.html')


def register(request):
    return render(request, 'register.html')

class OrderCreate(View):

    def post(self, request):
        cart = Cart(request)

        Order.objects.create(user=request.user,
                             status='3_paid',
                             amount=request.POST.get('amount'),
                             address=request.POST.get('address'),
                             city=request.POST.get('flat')
                             )

        cart.clear()
        print(request.user)
        print(request.POST.get('amount'))
        return render(request, 'index.html', {'kjfd': 'klfds'})

class Shop(ListView):
    paginate_by = 3
    model = Product

    def get(self, request):
        try:

            # получение всех товаров, категорий и брендов
            queryset = Paginator(Product.objects.all(), 2)
            page_number = request.GET.get('page')
            page_obj = queryset.get_page(page_number)

            categories_list = Type.objects.all()
            brands_list = Brand.objects.all()

            # информация о корзине
            cart_user = Cart(request)
            quantity = cart_user.__len__()

            context = {
                'products_list': list(page_obj.object_list),
                'page_range': list(page_obj.paginator.page_range),
                'categories_list': categories_list,
                'brands_list': brands_list,
                'quantity': quantity,
                'basket_products': cart_user.get_data()
            }

        except Exception as e:
            print(f"Oops! {e}")
        print(context)
        return render(request, 'shop.html', context)


class JsonFilterProductsView(ListView):

    def get_queryset(self):
        """
         фльтрация товаров
        """
        queryset = Product.objects.all()

        if self.request.GET.getlist('category'):
            queryset = queryset.filter(type_id__in=self.request.GET.getlist('category'))

        if self.request.GET.getlist('brand'):
            queryset = queryset.filter(brand_id__in=self.request.GET.getlist('brand'))

        queryset = queryset.distinct().values("name", "price", "note", "id")
        return queryset

    def get(self, request, *args, **kwargs):
        queryset = Paginator(self.get_queryset(), 2)
        page_number = request.GET.get('page')
        page_obj = queryset.get_page(page_number)

        data = {
            "products_list": list(page_obj.object_list),
            "page_range": list(page_obj.paginator.page_range)
        }

        return JsonResponse(data, safe=False)

class Json_add_basket(View):

    def post(self, request):
        """
            Добавление id товара в сессию
        """
        product_id = request.POST.get('product_id')
        cart_user = Cart(request)

        if request.POST.get('action') == 'minus':
            cart_user.remove(product_id)
        elif request.POST.get('action') == 'plus':
            cart_user.add(product_id)
        elif request.POST.get('action') == 'remove':
            cart_user.remove_from_basket(product_id)

        quantity = cart_user.__len__()
        cart_user.test()

        data = {"quantity": quantity,
                "basket_products": cart_user.get_data(),
                "total_price": cart_user.get_total_price()
                }
        # cart_user.clear()
        return JsonResponse(data)


def wishlist(request):
    return render(request, 'wishlist.html')


def checkout(request):
    cart_user = Cart(request)

    quantity = cart_user.__len__()

    context = {"quantity": quantity,
               "basket_products": cart_user.get_data(),
               "total_price": cart_user.get_total_price()
               }

    return render(request, 'checkout.html', context)
