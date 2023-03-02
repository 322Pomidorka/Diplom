from django.contrib import admin

from shop import models

admin.site.register(models.Product)
admin.site.register(models.Brand)
admin.site.register(models.Type)
admin.site.register(models.Order)
admin.site.register(models.OrderItem)
admin.site.register(models.Payment)
