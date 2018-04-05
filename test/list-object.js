const {validate} = require('../dist');
const {equal} = require('assert');

it('can validate a list of objects', function() {
    const schema = {
        width: "string",
        height: "string",
        doors: [{
            length: "string",
            color: "string"
        }, {
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
    equal(result.errors.length, 2);
});
