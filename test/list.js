const {validate, blank} = require('../dist');
const {equal, deepEqual} = require('assert');

it('can validate a list', function() {
    const schema = {
        address: {
            street: ["string"],
            name: "string"
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
                },
                name: {
                    validators: [
                        function name1() {
                            return false;
                        },
                        function name2() {
                            return false;
                        },
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
    equal(result.errors.length, 4);
    equal(result.hasErrors, true);
    equal(result.singularErrors.length, 2);
});
