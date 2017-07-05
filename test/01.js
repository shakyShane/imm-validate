const v = require('../dist').default;
const assert = require('assert');
it('validates 1 level', function () {
    const schema = {
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
    const values = {
        delivery_date: "",
        delivery_time: "time01"
    };
    const result = (v(schema, options, values));
    assert.equal(result.hasErrors, true);
    assert.equal(result.fields.delivery_date.errors.length, 1);
    assert.equal(result.fields.delivery_date.errors[0].message, 'This is a required field');
    assert.deepEqual(result.errors[0].path, ['delivery_date']);
});
it('validates 2 levels', function () {
    const schema = {
        address: {
            postcode: "string",
            street: "string",
        },
        delivery_date: "string",
        delivery_time: "string"
    };
    const options = {
        address: {
            fields: {
                postcode: {required: true}
            }
        }
    };
    const values = {
        delivery_date: "sup"
    };
    const result = (v(schema, options, values));
    assert.equal(result.hasErrors, true);
    assert.equal(result.fields.address.postcode.errors.length, 1);
    assert.equal(result.fields.address.postcode.errors[0].message, 'This is a required field');
    assert.deepEqual(result.errors[0].path, ['address', 'postcode']);
});
it('validates 3 levels', function () {
    const schema = {
        address: {
            postcode: {
                pieces: "array"
            },
        },
        delivery_date: "string",
        delivery_time: "string"
    };
    const options = {
        address: {
            fields: {
                postcode: {
                    fields: {
                        pieces: {
                            required: true
                        }
                    }
                }
            }
        }
    };
    const values = {
        delivery_date: "sup"
    };
    
    const result = (v(schema, options, values));
    assert.equal(result.hasErrors, true);
    assert.equal(result.fields.address.postcode.pieces.errors.length, 1);
    assert.equal(result.fields.address.postcode.pieces.errors[0].message, 'This is a required field');
    assert.deepEqual(result.errors[0].path, ['address', 'postcode', 'pieces']);
});
