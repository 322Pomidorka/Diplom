$(document).ready(function(){
    var data = {'product_id': '123',
                'csrfmiddlewaretoken': 'fasdf'
                }

    $.ajax({
        url: 'te/',
        type: 'GET',
        success: function(data) {
            render_home(data);

        },
        error: function() {
            console.log('error')
        }
    })
})


function render_home(data) {
    <h1>fdsafsa</h1>
}