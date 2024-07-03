document.addEventListener('DOMContentLoaded', () => {
    const cart = [];
    const cartElement = document.querySelector('.cart');
    const cartItemsElement = document.querySelector('.cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const productsSection = document.querySelector('.products');

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const productCard = button.closest('.product-card');
            const productId = productCard.getAttribute('data-id');
            const productName = productCard.getAttribute('data-name');
            const productPrice = parseFloat(productCard.getAttribute('data-price'));
            const productImage = productCard.getAttribute('data-image');
            addToCart(productId, productName, productPrice, productImage);
            toggleCartVisibility(); // Show cart when item is added
        });
    });

    function addToCart(id, name, price, image) {
        const existingCartItem = cart.find(item => item.id === id);
        if (existingCartItem) {
            existingCartItem.quantity++;
            document.getElementById(`quantity-${id}`).value = existingCartItem.quantity;
        } else {
            const cartItem = { id, name, price, quantity: 1, image };
            cart.push(cartItem);
            renderCartItem(cartItem);
        }
        updateCartTotal();
    }

    function renderCartItem(cartItem) {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <img src="${cartItem.image}" alt="${cartItem.name}">
            <p>${cartItem.name}</p>
            <input type="number" id="quantity-${cartItem.id}" value="${cartItem.quantity}" min="1">
            <span class="remove-item" data-id="${cartItem.id}">&times;</span>
        `;
        cartItemsElement.appendChild(cartItemElement);

        cartItemElement.querySelector('.remove-item').addEventListener('click', () => {
            removeFromCart(cartItem.id);
        });

        cartItemElement.querySelector('input').addEventListener('input', (event) => {
            updateQuantity(cartItem.id, event.target.value);
        });
    }

    function removeFromCart(id) {
        const cartItemIndex = cart.findIndex(item => item.id === id);
        if (cartItemIndex > -1) {
            cart.splice(cartItemIndex, 1);
            document.querySelector(`.cart-item .remove-item[data-id="${id}"]`).closest('.cart-item').remove();
            updateCartTotal();
            toggleCartVisibility(); // Hide cart if empty
        }
    }

    function updateQuantity(id, quantity) {
        const cartItem = cart.find(item => item.id === id);
        if (cartItem) {
            cartItem.quantity = parseInt(quantity, 10);
            updateCartTotal();
        }
    }

    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotalElement.innerText = total.toFixed(2);
    }

    function toggleCartVisibility() {
        if (cart.length > 0) {
            cartElement.classList.add('open');
        } else {
            cartElement.classList.remove('open');
        }
    }
});
