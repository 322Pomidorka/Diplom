function ajaxSend(url, params) {
    //Отправляем запрос
    fetch(`${url}?${params}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
        .then(response => response.json())
        .then(json => render(json))
        .catch(error => console.error(error))
}

var forms = document.querySelector('form[name=filter]');
if (forms) {
    forms.addEventListener('submit', function (e){
        //получаем данные из формы
        e.preventDefault();

        var url  = this.action;
        var params = new URLSearchParams(new FormData(this)).toString();
        params += "&page=1"
        console.log(params)
        ajaxSend(url,params);
    });
}

const blog_pagination = document.querySelector('.blog-pagination');

if (blog_pagination) {
    blog_pagination.addEventListener('click', (event) => {
        if (event.target.classList.contains('number-page')) {
            event.preventDefault()

            var params = new URLSearchParams(new FormData(forms)).toString();
            url = '/json-filter/'
            number = event.target.dataset.number
            params += `&page=${number}`
            console.log(params)
            ajaxSend(url, params)
        }
    })
}


function render(data) {
    //рендер шаблона

    const div = document.querySelector('.tab-pane');
    const blog_pagination = document.querySelector('.blog-pagination')

    html = ``

    products_list = data.products_list
    page_range = data.page_range
    console.log(data)
    if (products_list.length == 0){
        div.innerHTML = 'Таких товаров нет'
        document.querySelector('.pagination-box').innerHTML = ''
    }
    else {
        for (product in products_list) {
            html += `
                <div class="single-product">
                                    <!-- Product Image Start -->
                                    <div class="pro-img">
                                        <a href="product.html">
                                            <img class="primary-img" src="/static/img/products/1.jpg"
                                                 alt="single-product">
                                        </a>
                                    </div>
                                    <!-- Product Image End -->
                                    <!-- Product Content Start -->
                                    <div class="pro-content">
                                        <div class="product-rating">
                                            <i class="fa fa-star"></i>
                                            <i class="fa fa-star"></i>
                                            <i class="fa fa-star"></i>
                                            <i class="fa fa-star"></i>
                                            <i class="fa fa-star"></i>
                                        </div>
                                        <h4><a href="product.html">${products_list[product].name}</a></h4>
                                        <p><span class="price">${products_list[product].price}</span>
                                            <del class="prev-price">${products_list[product].price}</del>
                                        </p>
                                        <p>${products_list[product].note}</p>
                                        <div class="pro-actions">
                                            <div class="actions-secondary">
                                                <a href="wishlist.html" data-toggle="tooltip" title="Add to Wishlist"><i
                                                        class="fa fa-heart"></i></a>
                                                <a class="add-cart basket" href='/json_add_basket/' name="basket"
                                                   value=${products_list[product].id}>Add to cart</a>
                                                <a href="compare.html" data-toggle="tooltip" title="Add to Compare"><i
                                                        class="fa fa-signal"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Product Content End -->
                                </div>
            `
        }

        div.innerHTML = html

        html  = ``

        console.log(page_range)
        for (i in page_range) {
            i = 1+Number(i)
            html += `
                <li><a class="number-page" href="${i}" data-number="${i}">${i}</a></li>
            `
        }

        blog_pagination.innerHTML = html
        }

}