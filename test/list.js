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
                    fields: [
                        {
                            validators: [
                                function(options, value, path) {
                                    return {
                                        result: false,
                                        message: "The first field is required"
                                    };
                                },
                                function someOther() {
                                    return false;
                                }
                            ]
                        }
                    ]
                }
            },
        }
    };

    const values = {
        address: {
            street: [""]
        }
    };

    const result = (validate(schema, options, values));
    equal(result.hasErrors, true);
    equal(result.errors.length, 2);
    equal(result.singularErrors.length, 1);
});