const {validate, blank} = require('../dist');
const {equal, deepEqual} = require('assert');

it('can validate a list', function() {
    const schema = {
        address: {
            street: ["string"],
        }
    };
    const options = {
        address: {
            fields: {
                street: {
                    validators: [function(options, value, path) {
                        const [first, second] = value;
                        if (!first) {
                            return false;
                        }
                        return true;
                    }]
                }
            },
        }
    };

    const values = {
        address: {
            street: ["", "Mansfield"]
        }
    };
    const result = (validate(schema, options, values));

    equal(result.hasErrors, true);
    equal(result.errors.length, 1);
    equal(result.fields.address.street.errors.length, 1);
});