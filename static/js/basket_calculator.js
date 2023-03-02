const format_number = (x) => x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ' ')

const init = () => {
    let total_cost = 0;

    [...document.querySelectorAll('.single-product')].forEach((product_item) => {
        total_cost += Number(product_item.querySelector('.input').value) * Number(product_item.querySelector('.input').dataset.price)
    })

    document.getElementById('total-price').textContent = format_number(total_cost)
    document.getElementById('total-price').dataset.value = total_cost

}

const calculateSeparateItem = (basketItem, action) => {
    const input = basketItem.querySelector('.input');
    total_cost = document.getElementById('total-price')

    const url = '/json-add-basket/'
    let csrf_token = $('[name="csrfmiddlewaretoken"]').val()
    let product_id = basketItem.querySelector('.product-id').dataset.id
    let data = {}

    switch (action) {
        case 'plus':
            input.value++;
            new_total_cost = Number(total_cost.dataset.value) + Number(input.dataset.price);

            total_cost.textContent = new_total_cost
            total_cost.dataset.value = new_total_cost

            //запрос на изменение корзины в сессии

            data = {'product_id': product_id,
                          'csrfmiddlewaretoken':csrf_token,
                          'action': action
                          }
            basketItem.querySelector('.subtotal').textContent = format_number(Number(input.value) *
                                                        Number(input.dataset.price))

            break;

        case 'remove':
            data = {'product_id': product_id,
                    'csrfmiddlewaretoken':csrf_token,
                    'action': action
                    }

            break;

        case 'minus':
            input.value--;
            new_total_cost = Number(total_cost.dataset.value) - Number(input.dataset.price);

            total_cost.textContent = new_total_cost;
            total_cost.dataset.value = new_total_cost;

            //запрос на изменение корзины в сессии
            data = {'product_id': product_id,
                    'csrfmiddlewaretoken':csrf_token,
                    'action': action
                    }
            basketItem.querySelector('.subtotal').textContent = format_number(Number(input.value) *
                                                        Number(input.dataset.price))

            break;
    }

    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        cache: true,
        success: function(data) {
            render_basket(data);
        },
        error: function() {
            console.log('error')
        }
    })


}

document.getElementById('basket-calc').addEventListener('click', event => {

    if(event.target.classList.contains('btn-remove')) {
        //удаление товара из списка корзины

        calculateSeparateItem(
            event.target.closest('.single-product'),
            'remove'
        );
    }

    if(event.target.classList.contains('btn-minus')) {
        //minus
        const input  = event.target.closest('.single-product').querySelector('.input');

        if (Number(input.value) !== 1) {
            calculateSeparateItem(
                event.target.closest('.single-product'),
                'minus'
            );
        }

    }
    if(event.target.classList.contains('btn-plus')) {
        //plus

        calculateSeparateItem(
            event.target.closest('.single-product'),
            'plus'
        );
    }
})

function render_basket(data) {
    const basket_products = document.querySelector('.basket-products');
    const div = document.querySelector('.fa-shopping-basket');
    const dropdown_basket = document.querySelector('.main-cart-box li');

    html = ``
    html_for_basket_products = ``
    let product_list = data['basket_products']

    let total_price = data['total_price']

    $.each(product_list,function(k,v){   // k ==== key, v === value
        html += `<div class="single-cart-box">
                    <div class="cart-img">
                        <a href="#"><img src="/static/img/menu/1.jpg" alt="cart-image"></a>
                    </div>
                    <div class="cart-content">
                        <h6><a href="product.html">${product_list[k].name}</a></h6>
                        <span>${product_list[k].quantity} × $${product_list[k].price}</span>
                    </div>
                    <a class="del-icone" href="#"><i class="fa fa-window-close-o"></i></a>
                 </div>`

        //--------------------
        html_for_basket_products += `<div class="single-product row justify-content-md-center">
                            <!-- Product Image Start -->
                            <div class="col col-lg-2">
                                <a href="product.html">
                                    <img class="img-fluid" src="/static/img/products/1.jpg"
                                         alt="single-product">
                                </a>
                            </div>
                            <!-- Product Image End -->
                            <!-- Product Content Start -->
                            <div class="product-info col">
                                <h4><a href="product.html" class="product-id" data-id="${k}">${product_list[k].name}</a></h4>

                            </div>
                            <div class="col-lg-2">
                                <p><span class="subtotal">${product_list[k].price}</span>
                                </p>
                            </div>
                            <div class="col-lg-3">
                                <div style="display: flex;  align-items: center;">
                                    <button type="button" class="btn btn-primary btn-minus">-</button>
                                    <input type="text" value="${product_list[k].quantity}" data-price="${product_list[k].price}"
                                           class="form-control input count-input" disabled/>
                                    <button type="button" class="btn btn-primary btn-plus">+</button>
                                </div>
                            </div>
                            <div class="col-lg-1">
                                <div>
                                    <i class="btn-remove fa fa-trash" aria-hidden="true"></i>
                                </div>
                            </div>
                            <!-- Product Content End -->
                        </div>`
    });
    html += `<div class="cart-footer fix">
                                                <h5>total :<span class="total-price f-right">${total_price}</span></h5>
                                                <div class="cart-actions">
                                                    <a class="checkout" href="checkout.html">Checkout</a>
                                                </div>
                                            </div>`

    div.innerHTML = `<span class="cart-counter">${data['quantity']}</span>`
    dropdown_basket.innerHTML = html

    if (basket_products) {
        basket_products.innerHTML = html_for_basket_products
    }
}



init()