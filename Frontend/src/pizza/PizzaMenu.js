var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List;

var $currentType = $("#type");
var $count = $("#count");
var $types = $("#types");

const types = [
    {
        type: "Мясні",
        filter: {
            require: ["meat", "chicken"]
        }
    }, {
        type: "З ананасами",
        filter: {
            require: ["pineapple"]
        }
    }, {
        type: "З грибами",
        filter: {
            require: ["mushroom"]
        }
    }, {
        type: "З морепродуктами",
        filter: {
            require: ["ocean"]
        }
    }, {
        type: "Вега",
        filter: {
            forbid: ["meat", "chicken", "ocean"]
        }
    }
];

function findActiveType() {
    return $types.find(".active");
}

function changeType(typeHtml, type) {
    if ($currentType.text() != type) {
        var currentType = findActiveType();
        currentType.removeClass("active");
        typeHtml.addClass("active");
        $currentType.text(type);
    }
}

function addType({ type, filter }) {
    var typeHtml = $(`<li>${type}</li>`);
    typeHtml.click(function () {
        changeType(typeHtml, type);
        filterPizza(filter);
    });

    $types.append(typeHtml);
}

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({ pizza: pizza });

        var $node = $(html_code);

        ["small_size", "big_size"].forEach(function (size) {
            var buyButton = $node.find(`.${size}`);
            buyButton.click(function () {
                var cartItem = { pizza, size };
                PizzaCart.addToCart(cartItem);
            });
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
    $count.text(list.length);
}

function filterByContent(content, { forbid, require }) {
    if (forbid) {
        for (var i = 0; i < forbid.length; i++) {
            if (forbid[i] in content) {
                return false;
            }
        }
    }

    if (require) {
        for (var i = 0; i < require.length; i++) {
            if (require[i] in content) {
                return true;
            }
        }
    } else {
        return true;
    }

    return false;
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = Pizza_List.filter(pizza => filterByContent(pizza.content, filter));

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function initialiseMenu(list) {
    Pizza_List = list;
    exports.Pizza_List = Pizza_List;

    //Показуємо усі піци
    showPizzaList(Pizza_List);

    types.forEach(addType);
    var $allType = findActiveType();
    $allType.click(function () {
        changeType($allType, $allType.text());
        showPizzaList(Pizza_List);
    });
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;
