this.pay = function () {
 amount = Number(document.getElementById('total-price').dataset.value)
 address = document.getElementById('address').value
 csrf_token = $('[name="csrfmiddlewaretoken"]').val()
 flat = document.getElementById('flat').value

 var data = {
    'amount': amount,
    'address': address,
    'flat': flat,
    'csrfmiddlewaretoken': csrf_token
 }

 var widget = new cp.CloudPayments();
    widget.pay('charge', // или 'charge'
        { //options
            publicId: 'test_api_00000000000000000000002', //id из личного кабинета
            description: 'Оплата товаров в 21345', //назначение
            amount: amount, //сумма
            currency: 'RUB', //валюта
            accountId: 'user@example.com', //идентификатор плательщика (необязательно)
            invoiceId: '1234567', //номер заказа  (необязательно)
            email: 'user@example.com', //email плательщика (необязательно)
            skin: "mini", //дизайн виджета (необязательно)
            autoClose: 3, //время в секундах до авто-закрытия виджета (необязательный)
            data: {
                myProp: 'myProp value'
            }
        },
        {
            onSuccess: function (options) { // success
                $.ajax({
                    url: '/order-create/',
                    type: 'POST',
                    data: data,
                    cache: true,
                    success: function(data) {
                        console.log(data)
                    },
                    error: function() {
                        console.log('error')
                    }
                })
            },
            onFail: function (reason, options) { // fail
                console.log('bad')
            },
            onComplete: function (paymentResult, options) { //Вызывается как только виджет получает от api.cloudpayments ответ с результатом транзакции.
                //например вызов вашей аналитики Facebook Pixel
            }
        }
    )
};

$('#payment').click(pay);