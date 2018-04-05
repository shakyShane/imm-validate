const {validate, blank} = require('../dist');
const {equal, deepEqual} = require('assert');

it('can validate a list of objects', function() {
    const schema = {
        width: "string",
        height: "string",
        doors: [{
            length: "string",
            color: "string"
        }]
    };
    const options = {
        doors: {
            fields: [
                {
                    length: {
                        required: true,
                    }
                },
                {
                    color: {
                        required: true,
                    }
                }
            ]
        }
    };

    const values = {
        width: null,
        doors: [
            {length: null, color: "white"},
            {length: "1", color: null},
        ]
    };

    const result = (validate(schema, options, values));
    console.log(result.errors[0]);
    // equal(result.errors.length, 2);
});
