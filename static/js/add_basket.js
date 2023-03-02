$(document).ready(function(){
    var product_list = $('.tab-pane')

    var csrf_token = $('[name="csrfmiddlewaretoken"]').val()
    var url = $('.basket').attr('href')

    product_list.on('click', (e) => {
        e.preventDefault();

        var product_id = $(e.target).attr('value')
        //var url = $(e.target).attr('href')

        var data = {'product_id': product_id,
                    'csrfmiddlewaretoken': csrf_token,
                    'action': 'plus'
                    }

        sendAjaxAddBasket(data, url)
    })
})

function sendAjaxAddBasket(data, url) {
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

function render_basket(data) {
    const div = document.querySelector('.fa-shopping-basket');
    const dropdown_basket = document.querySelector('.main-cart-box li')

    html = ``
    product_list = data['basket_products']
    total_price = data['total_price']

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
    });
    html += `<div class="cart-footer fix">
                                                <h5>total :<span class="total-price f-right">${total_price}</span></h5>
                                                <div class="cart-actions">
                                                    <a class="checkout" href="checkout.html">Checkout</a>
                                                </div>
                                            </div>`

    div.innerHTML = `<span class="cart-counter">${data['quantity']}</span>`
    dropdown_basket.innerHTML = html

}