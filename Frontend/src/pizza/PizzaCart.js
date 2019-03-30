var Templates = require('../Templates');
var Storage = require('basil.js');
Storage = new Storage();

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");
var $orderedCount = $("#ordered-count");
var $clearCart = $("#clear-cart");
var $sum = $("#sum");
var $order = $("#order-button");

$clearCart.click(initialiseCart);

function getPrice({ pizza, size }) {
    return pizza[size].price;
}

function getCart({ pizza, size }) {
    return pizza[size].cart;
}

function setCart({ pizza, size }, cartItem) {
    pizza[size].cart = cartItem;
}

function addToCart(cartItem) {
    //Додавання однієї піци в кошик покупок

    var existingItem = getCart(cartItem);
    var price = getPrice(cartItem);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        setCart(cartItem, cartItem);
        cartItem.quantity = 1;

        Cart.push(cartItem);
    }

    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cartItem) {
    //Видалити піцу з кошика
    var id = Cart.indexOf(getCart(cartItem));
    Cart.splice(id, 1);

    setCart(cartItem, undefined);

    //Після видалення оновити відображення
    updateCart();
}

function init() {
    var PizzaList = require('./PizzaMenu').Pizza_List;

    var arr = JSON.parse(Storage.get('cart'));
    if (arr) {
        arr.forEach(({ id, size, quantity }) => {
            var pizza = PizzaList.find(p => p.id == id);
            var cartItem = { pizza, size, quantity };
            Cart.push(cartItem);
            setCart(cartItem, cartItem);
        });
    }

    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його

    Cart.forEach(item => setCart(item, undefined));
    Cart = [];
    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.html("");
    var sum = 0;

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem({ ...cart_item, order});

        var $node = $(html_code);
        var $minus = $node.find(".minus");
        if (cart_item.quantity == 1) {
            $minus.attr("disabled", "disabled");
        }

        var price = getPrice(cart_item);
        sum += cart_item.quantity * price;

        $minus.click(function () {
            //Зменшуємо кількість замовлених піц
            cart_item.quantity -= 1;

            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".plus").click(function () {
            //Збільшуємо кількість замовлених піц
            addToCart(cart_item);
        });

        $node.find(".remove").click(function () {
            removeFromCart(cart_item);
        });

        $cart.append($node);
    }

    Cart.forEach(showOnePizzaInCart);
    $orderedCount.text(Cart.length);
    $sum.text(sum);
    $order.attr("disabled", !Cart.length);

    saveToStorage();
}

function saveToStorage() {
    var arr = [];
    Cart.forEach(item => arr.push({ id: item.pizza.id, size: item.size, quantity: item.quantity }));
    Storage.set('cart', JSON.stringify(arr));
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = init;