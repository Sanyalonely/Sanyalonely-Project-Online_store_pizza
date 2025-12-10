function toggleCartStatus() {
    const cartWrapper = document.querySelector('.cart-wrapper');
    const cartEmptyBadge = document.querySelector('[data-cart-empty]');
    const orderFormWrapper = document.querySelector('.order-form-wrapper');

    if (cartWrapper.children.length > 0) {
        cartEmptyBadge.classList.add('none');
        orderFormWrapper.classList.remove('none');
    } else {
        cartEmptyBadge.classList.remove('none');
        orderFormWrapper.classList.add('none');
    }
}
function calcCartPrice() {
    const cartWrapper = document.querySelector('.cart-wrapper');
    const priceElements = cartWrapper.querySelectorAll('.price_currency');
    const totalPriceEl = document.querySelector('.total-price');

    let priceTotal = 0;

    priceElements.forEach(function (item) {
        const amountEl = item.closest('.cart-item').querySelector('[data-counter]');
        const price = parseInt(item.innerText);
        const amount = parseInt(amountEl.innerText);
        priceTotal += price * amount;
    });

    totalPriceEl.innerText = priceTotal;
}

window.addEventListener('click', function (event) {
    if (event.target.dataset.action === 'plus' || event.target.dataset.action === 'minus') {
        const counterWrapper = event.target.closest('.counter-wrapper');
        const counter = counterWrapper.querySelector('[data-counter]');

        if (event.target.dataset.action === 'plus') {
            counter.innerText = ++counter.innerText;
        }
        if (event.target.dataset.action === 'minus') {
            let currentValue = parseInt(counter.innerText);

            if (event.target.closest('.cart-wrapper') && currentValue === 1) {
                event.target.closest('.cart-item').remove();
                toggleCartStatus();
                calcCartPrice();
            } else if (currentValue > 1) {
                counter.innerText = --currentValue;
            }
        }
        if (event.target.closest('.cart-wrapper')) {
            calcCartPrice();
        }
    }
    if (event.target.hasAttribute('data-cart')) {
        const card = event.target.closest('.item-card');

        const productInfo = {
            id: card.dataset.id,
            imgSrc: card.querySelector('.product-img').getAttribute('src'),
            title: card.querySelector('.item-title').innerText,
            itemsInBox: card.querySelector('[data-items-in-box]').innerText,
            weight: card.querySelector('.price_weight').innerText,
            price: card.querySelector('.price_currency').innerText,
            counter: card.querySelector('[data-counter]').innerText,
        };

        const cartWrapper = document.querySelector('.cart-wrapper');
        const itemInCart = cartWrapper.querySelector(`[data-id="${productInfo.id}"]`);

        if (itemInCart) {
            const counterEl = itemInCart.querySelector('[data-counter]');
            counterEl.innerText = parseInt(counterEl.innerText) + parseInt(productInfo.counter);
        } else {
            const cartItemHTML = `
                <div class="cart-item" data-id="${productInfo.id}">
                    <div class="cart-item-top">
                        <div class="cart-item-img">
                            <img src="${productInfo.imgSrc}" alt="${productInfo.title}">
                        </div>
                        <div class="cart-item-desc">
                            <div class="cart-item-title">${productInfo.title}</div>
                            <div class="cart-item-weight">${productInfo.itemsInBox} / ${productInfo.weight}</div>
                            <div class="cart-item-details">
                                <div class="items counter-wrapper">
                                    <div class="items_control" data-action="minus">-</div>
                                    <div class="items_current" data-counter>${productInfo.counter}</div>
                                    <div class="items_control" data-action="plus">+</div>
                                </div>
                                <div class="price">
                                    <div class="price_currency">${productInfo.price}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
            cartWrapper.insertAdjacentHTML('beforeend', cartItemHTML);
        }

        card.querySelector('[data-counter]').innerText = '1';
        toggleCartStatus();
        calcCartPrice();
    }
});