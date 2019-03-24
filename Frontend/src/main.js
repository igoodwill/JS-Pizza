/**
 * Created by chaika on 25.01.16.
 */

$(function () {
    //This code will execute when the page is ready
    var PizzaCart = require('./pizza/PizzaCart');
    var PizzaMenu = require('./pizza/PizzaMenu');

    PizzaMenu.initialiseMenu();
    PizzaCart.initialiseCart();
});