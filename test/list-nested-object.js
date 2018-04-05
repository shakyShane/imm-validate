const {validate, blank} = require('../dist');
const {equal, deepEqual} = require('assert');

it('can validate a list of objects that can be nested', function () {
    const schema = {
        outdoor: "boolean",
        street: ["string", "string"],
        doors: [{
            dimensions: {
                height: "string",
                length: "string",
                internal: {
                    height: "string",
                    length: "string",
                    colors: ["string", "string"]
                }
            }
        }]
    };
    const options = {
        outdoor: {
            required: true,
        },
        street: {
            fields: [
                {
                    required: false
                },
                {
                    required: true
                }
            ]
        },
        doors: {
            fields: [
                {
                    color: {required: true},
                    dimensions: {
                        fields: {
                            height: {required: true},
                            length: {required: true},
                            internal: {
                                fields: {
                                    height: {required: true},
                                    length: {required: true},
                                    colors: {
                                        fields: [{required: true}, {required: true}]
                                    }
                                }
                            }
                        },
                    }
                }
            ]
        }
    };

    const values = {
        street: ["my first"],
        doors: [
            {color: "white", dimensions: {height: "my thing"}},
        ]
    };

    const result = (validate(schema, options, values));
    equal(result.errors.length, 7);
    deepEqual(result.errors[0].path, ['outdoor']);
    deepEqual(result.errors[1].path, ['street', 1]);
    deepEqual(result.errors[2].path, ['doors', 0, 'dimensions', 'length']);
    deepEqual(result.errors[3].path, ['doors', 0, 'dimensions', 'internal', 'height']);
    deepEqual(result.errors[4].path, ['doors', 0, 'dimensions', 'internal', 'length']);
    deepEqual(result.errors[5].path, ['doors', 0, 'dimensions', 'internal', 'colors', 0]);
    deepEqual(result.errors[6].path, ['doors', 0, 'dimensions', 'internal', 'colors', 1]);
});
