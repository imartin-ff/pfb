$(document).ready(function(){
    if(JSON.parse(localStorage.getItem('cart'))){
        $('.cart .count').text(JSON.parse(localStorage.getItem('cart')).length)
    }else{
        $('.cart .count').text(0);
    }
    function elemPosition(elem) {
        return elem.position();
    }

    $('.header__menu').prepend('<span class="float-line"></span>');
    
    function floatLineStartPositon(){
        $('.float-line').stop().animate({
            'left': `${elemPosition($('.header__menu li.active')).left}px`,
            'width': $('.header__menu li.active').width()
        }, 200);
    }

    function floatLineChangePosition(elem){
        $('.float-line').stop().animate({
            'left': `${elemPosition(elem).left}px`,
            'width': elem.width()
        }, 200);
    }


    $('.header__menu li').each(function(){
        $(this).mouseenter(function(){
            floatLineChangePosition($(this));
        })

        $(this).mouseleave(function(){
            floatLineStartPositon();
        })
       
    })



    floatLineStartPositon();
   


    let isMenuOpen = false;

    const $btnBurger = document.querySelector('.ico-btn');
    const $burgerMenu = document.querySelector('.header__menu')
    // Event Listeners
    $btnBurger.addEventListener('click', onBtnBurgerClicked)

    // Functions
    function onBtnBurgerClicked(e){
        isMenuOpen = !isMenuOpen;
        $btnBurger.classList.toggle('is-active');
        $burgerMenu.classList.toggle('open');
    }

    $.ionTabs("#products-tab");


    const documentSlider = document.querySelector('.documents__slider');
    if(documentSlider){
        const swiper = new Swiper(documentSlider, {
            slidesPerView: 3,
            spaceBetween: 20,
            pagination: {
                el: '.swiper-pagination',
                type: 'bullets',
                clickable: true,
            },
            wrapperClass: 'documents__slider-wrapper',
            slideClass: 'documents-slide',
            
            breakpoints: {
                0:{
                    slidesPerView: 1, 
                },
              480:{
                slidesPerView: 2, 
              },
              768:{
                slidesPerView: 3, 
              }
            
            }
          })
    }

    const pageType = $('.cart-page').length > 0;
    
    const countersActivating = () => {
        $('.counter').each(function(){
            let plusBtn = $(this).children('.plus');
            let minusBtn = $(this).children('.minus');
            let counter = $(this).children('.counter-field');
     
            plusBtn.on('click', function(){
                 counter.val(parseInt(counter.val()) + 1);
            })
     
            minusBtn.on('click', function(){
                if(counter.val() >= 1){
                     counter.val(parseInt(counter.val()) - 1);
                }else{
                    if(pageType){
                        counter.closest('.counter-wrapper').remove();
                        let cart = JSON.parse(localStorage.getItem('cart'));
                        let i = cart.findIndex(item => item.id === parseInt(counter.closest('.counter-wrapper').data('id')));
                        cart[i].types[counter.closest('.counter-wrapper').data('type')] = 0;
                        localStorage.setItem('cart', JSON.stringify(cart));
                        if($('.cart-items').children().length == 0){
                            localStorage.removeItem('cart');
                        }
                    }
                }
             })
         })
    }

    countersActivating();
   
    
    const cartBtn = $("#cart-btn");
    if(cartBtn.length > 0){
       cartBtn.on('click', function(e){

           e.preventDefault();

           let productID = $('.product-card').data('id');

           let productName = $('.product-name').text();

           let product = {
                id: productID,
                name: productName,
                types:{
                    bottle: $('#bottle').val(),
                    box: $('#box').val(),
                    kega: $('#kega').val(),
                }
           }

           let cart = JSON.parse(localStorage.getItem('cart'));

           if(cart != null) {
                let i = cart.findIndex(item => item.id === product.id);
                if(cart[i]){ 
                    cart[i] = product;
                }else {
                    cart.push(product);
                };
                localStorage.setItem('cart', JSON.stringify(cart));
           } else {
               cart = [];
               cart.push(product);
                localStorage.setItem('cart', JSON.stringify(cart));
           }

           $('.cart .count').text(JSON.parse(localStorage.getItem('cart')).length)
       })

    }

    const returnCorrectProductType = (productType) => {
        if(productType == 'bottle') return 'Бутылка 0,5';
        if(productType == 'box') return 'Ящик (20 бутылок)';
        if(productType == 'kega') return 'Кега 5л';
    }

    const pushProduct = (productID, productName, productType, productTypeCount) => {
        correctType = returnCorrectProductType(productType);
     
        return `
            <div class="counter-wrapper" data-id="${productID}" data-type=${productType}>
                <div class="counter-name"><span class="cart__product-name">${productName} </span><span class="cart__product-type">${correctType}</span></div>

                <div class="counter">
                    <button class="minus" aria-label="Отнять">
                    -
                    </button>
                    <input type="number" name="bottle" id="bottle" class="counter-field" value="${productTypeCount}">
                    <button class="plus" aria-label="Добавить">
                    +
                    </button>
                </div>
            </div>
        `
    }
    const cartContainer = $('.cart-items');
    if(cartContainer.length > 0){
        let cart = JSON.parse(localStorage.getItem('cart'));
        cart.forEach(element => {
            console.log(element.types);
            for(key in element.types){
                if(element.types[key] > 0){
                    $('.cart-items').append(pushProduct(element.id, element.name, key, element.types[key]));
                }
            }
        });

        countersActivating();
    }

   
})

