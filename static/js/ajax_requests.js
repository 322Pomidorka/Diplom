const sendAjax = (data,url) => {
    $.ajax({
            url: url,
            type: 'GET',
            success: function(data) {
                render_basket(data);

            },
            error: function() {
                console.log('error')
            }
        })
}

$(document).ready(function(){
    document.addEventListener('click', event => {
        event.preventDefault();

        if 'a' == event.target.tagName.toLowerCase() {
            console.log('jjfkd')
        }
    })
})
