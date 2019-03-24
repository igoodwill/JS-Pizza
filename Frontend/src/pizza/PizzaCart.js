var Templates = require('../Templates');

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [], sum;

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");
var $orderedCount = $("#ordered-count");
var $clearCart = $("#clear-cart");
var $sum = $("#sum");

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
    sum += price;

    if (existingItem) {
        existingItem.quantity++;
        existingItem.totalPrice += price;
    } else {
        setCart(cartItem, cartItem);
        cartItem.quantity = 1;
        cartItem.totalPrice = price;

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
    sum -= cartItem.totalPrice;

    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його

    Cart.forEach(item => setCart(item, undefined));
    Cart = [];
    sum = 0;
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

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);
        var $minus = $node.find(".minus");
        if (cart_item.quantity == 1) {
            $minus.attr("disabled", "disabled");
        }

        var price = getPrice(cart_item);

        $minus.click(function () {
            //Зменшуємо кількість замовлених піц
            cart_item.quantity -= 1;
            cart_item.totalPrice -= price;
            sum -= price;

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
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;