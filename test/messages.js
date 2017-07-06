const v = require('../dist').default;
const assert = require('assert');
it('adds missing messages', function () {
    const schema = {
        delivery_date: "string",
    };
    const options = {
        delivery_date: {
            label: "Delivery Date",
            validators: [function() {
                return {
                    result: false,
                    message: 'You missed this'
                }
            }]
        }
    }
    const values = {
        delivery_date: ""
    };

    const result = (v(schema, options, values));

    assert.equal(result.fields.delivery_date.errors[0].message, 'You missed this');
    assert.equal(result.fields.delivery_date.errors[0].prefixed, 'Delivery Date: You missed this');
});