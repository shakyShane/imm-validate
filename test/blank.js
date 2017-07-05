const {blank} = require('../dist');
const {equal, deepEqual} = require('assert');
it('can return a blank data structure', function () {
    const schema = {
        address: {
            postcode: "string",
            street: "string"
        },
        delivery_date: "string",
        delivery_time: "string"
    };
    const options = {
        delivery_date: {
            label: "Delivery Date",
            required: true,
        },
        delivery_time: {
            label: "Delivery Time"
        }
    }
    const values = {};
    const result = (blank(schema, options, values));
    // console.log(result);
    equal(result.hasErrors, false);
    equal(result.errors.length, 0);
    equal(result.fields.address.postcode.errors.length, 0);
    equal(result.fields.address.postcode.hasError, false);
})