from decimal import Decimal
from django.conf import settings
from django.core import serializers

from shop.models import Product


class Cart(object):

    def __init__(self, request):
        """
        Инициализируем корзину
        """

        self.session = request.session
        cart = self.session.get(settings.CART_SESSION_ID)

        if not cart:
            # save an empty cart in the session
            cart = self.session[settings.CART_SESSION_ID] = {}

        self.cart = cart

    def add(self, product_id, quantity=1):
        """
        Добавить продукт в корзину или обновить его количество.
        """

        product = Product.objects.get(id=product_id)

        if product_id not in self.cart:
            self.cart[product_id] = {'quantity': quantity,
                                     'price': str(product.price)}
        else:
            self.cart[product_id]['quantity'] += quantity

        self.save()

    def remove(self, product_id, quantity=1):
        """
            Удаление одной единицы продукта из корзины.
        """

        self.cart[product_id]['quantity'] -= quantity
        self.save()

    def remove_from_basket(self, product_id):
        """
            Удаление одной единицы продукта из корзины.
        """

        del self.cart[product_id]
        self.save()

    def save(self):
        # Обновление сессии cart
        self.session[settings.CART_SESSION_ID] = self.cart
        # Отметить сеанс как "измененный", чтобы убедиться, что он сохранен
        self.session.modified = True

    def test(self):
        """
        Перебор элементов в корзине и получение продуктов из базы данных.
        """

        product_ids = self.cart.keys()

        # получение объектов product и добавление их в корзину
        products_list = Product.objects.filter(id__in=product_ids)

        for product in products_list:
            self.cart[str(product.id)]['name'] = product.name
            self.cart[str(product.id)]['img'] = product.image_url
            self.cart[str(product.id)]['img'] = str(product.price)

        self.save()

        # for item in self.cart.values():
        #     item['price'] = Decimal(item['price'])
        #     item['total_price'] = item['price'] * item['quantity']
        #     yield item

    def __len__(self):
        """
        Подсчет всех товаров в корзине.
        """
        return sum(item['quantity'] for item in self.cart.values())

    def get_total_price(self):
        """
        Подсчет стоимости товаров в корзине.
        """
        return sum(Decimal(item['price']) * item['quantity'] for item in
                   self.cart.values())

    def get_data(self):

        return self.cart

    def clear(self):
        # удаление корзины из сессии
        del self.session[settings.CART_SESSION_ID]
        self.session.modified = True
