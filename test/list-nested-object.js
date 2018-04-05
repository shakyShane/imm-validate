const {validate, blank} = require('../dist');
const {equal, deepEqual} = require('assert');

it.only('can validate a list of objects that can be nested', function() {
    // const schemaType = 'string';
    // const path =      ['doors', 0, 'dimensions', 'height'];
    // const options =   ['doors', 'fields', 0, 'dimensions', 'fields', 'height'];
    // const valuePath = ['doors', 0, 'dimensions', 'height'];
    const schema = {
        doors: [{
            dimensions: {
                height: "string",
                length: "string"
            }
        }]
    };
    const options = {
        doors: {
            fields: [
                {
                    color: { required: true },
                    dimensions: {
                        fields: {
                            height: {required: true},
                            length: {required: true},
                        }
                    }
                }
            ]
        }
    };

    const values = {
        doors: [
            {color: "white", dimensions: {height: "my thing"}},
        ]
    };

    const result = (validate(schema, options, values));
    // console.log(result.fields.doors[0].dimensions);
    equal(result.errors.length, 1);
});
