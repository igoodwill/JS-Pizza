var api = require('./API');

$(function () {

    var inputs = ['Name', 'Phone', 'Address'].reduce((res, key) => {
        return {
            ...res,
            [key.toLowerCase()]: (name => {
                var group = $(`.${name.toLowerCase()}-group`);
                var field = group.find(`#input${name}`);
                var error = group.find('.help-box');

                return { group, field, error };
            })(key)
        };
    }, {});

    function validate({ group, field, error }) {
        if (field[0].validity.valid) {
            group.removeClass('has-error');
            group.addClass('has-success');
            error.attr('hidden', 'hidden');
        } else {
            group.removeClass('has-success');
            group.addClass('has-error');
            error.removeAttr('hidden');
        }
    }

    Object.keys(inputs).forEach(key => {
        var input = inputs[key];
        input.field.on('input', () => validate(input));
    });

    $('#next').click(() => {
        var result = Object.keys(inputs).reduce((res, key) => {
            var input = inputs[key];
            var field = input.field[0];

            validate(input);
            if (res && field.validity.valid) {
                return { ...res, [key]: field.value };
            }
        }, {})

        console.log(result)
        if (result) {
            api.createOrder(result);
        }
    });

});