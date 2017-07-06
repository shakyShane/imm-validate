const {format} = require('../dist');
const {equal, deepEqual} = require('assert');
it('can apply single format data 1 level', function () {
    const schema = {
        name: "string"
    };
    const options = {
        name: {
            label: "Delivery Date",
            formatters: [function (options, value) {
                return value.toUpperCase();
            }]
        }
    };
    const values = {
        name: "shane"
    };
    const result = (format(schema, options, values));
    equal(result.name, 'SHANE');
});
it('can apply mulitple formats 1 level', function () {
    const schema = {
        name: "string"
    };
    const options = {
        name: {
            label: "Delivery Date",
            formatters: [
                function (options, value) {
                    return value.toUpperCase();
                },
                function (options, value) {
                    return value + '-OSBOURNE';
                }
            ]
        }
    };
    const values = {
        name: "shane"
    };
    const result = (format(schema, options, values));
    equal(result.name, 'SHANE-OSBOURNE');
});
it('can apply formats 2 levels deep', function () {
    const schema = {
        address: {
            postcode: "string"
        }
    };
    const options = {
        address: {
            fields: {
                postcode: {
                    formatters: [
                        function (options, value) {
                            return value.toUpperCase();
                        }
                    ]
                }
            }
        }
    };
    const values = {
        address: {
            postcode: "ng183lj"
        }
    };
    const result = (format(schema, options, values));
    equal(result.address.postcode, 'NG183LJ');
});
it('can apply formatting to an item in a list', function () {
    const schema = {
        address: ["string"]
    };
    const options = {
        address: {
            fields: [
                {
                    formatters: [
                        function (options, value) {
                            return value.toUpperCase();
                        }
                    ]
                }
            ]
        }
    };
    const values = {
        address: ["ng183lj"]
    };
    const result = (format(schema, options, values));
    equal(result.address[0], 'NG183LJ');
});