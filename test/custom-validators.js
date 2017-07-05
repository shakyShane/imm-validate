const v = require('../dist').default;
const assert = require('assert');
it('supports a function only', function () {
    const schema = {
        name: "string"
    }
    const options = {
        name: {
            validators: [
                function alwaysFalse() {
                    return false
                }
            ]
        }
    }
    const values = {name: "shane"}
    const result = v(schema, options, values);
    assert.equal(result.errors.length, 1);
    assert.equal(result.errors[0].message, 'This field is invalid');
    assert.equal(result.fields.name.errors.length, 1);
});
it('supports an object with fn prop', function () {
    const schema = {
        name: "string"
    }
    const options = {
        name: {
            validators: [
                {
                    fn: function nana() {
                        return false
                    }
                }
            ]
        }
    };
    const values = {name: "shane"}
    const result = v(schema, options, values);
    assert.equal(result.errors.length, 1);
    assert.equal(result.errors[0].message, 'This field is invalid');
    assert.equal(result.fields.name.errors.length, 1);
});
it('supports an object with custom error', function () {
    const schema = {
        name: "string"
    }
    const options = {
        name: {
            validators: [
                {
                    error: 'Nope',
                    fn: function nana() {
                        return false
                    }
                }
            ]
        }
    }
    const values = {name: "shane"};
    const result = v(schema, options, values);
    assert.equal(result.errors.length, 1);
    assert.equal(result.errors[0].message, 'Nope');
    assert.equal(result.fields.name.errors.length, 1);
});
it('supports an object with custom error + name', function () {
    const schema = {
        name: "string"
    }
    const options = {
        name: {
            validators: [
                {
                    name: 'custom-validator',
                    error: 'Nope',
                    fn: function nana() {
                        return false
                    }
                }
            ]
        }
    }
    const values = {name: "shane"};
    const result = v(schema, options, values);
    assert.equal(result.errors.length, 1);
    assert.equal(result.errors[0].message, 'Nope');
    assert.equal(result.errors[0].type, 'custom-validator');
});
it('supports validation via returned object', function () {
    const schema = {
        name: "string"
    }
    const options = {
        name: {
            validators: [
                function nana(options, value, path) {
                    return {
                        result: true
                    }
                }
            ]
        }
    };
    const values = {name: "shane"};
    const result = v(schema, options, values);
    assert.equal(result.errors.length, 0);
});
it('supports returning dynamic message from validator', function () {
    const schema = {
        name: "string"
    }
    const options = {
        name: {
            validators: [
                function nana(options, value, path) {
                    return {
                        result: false,
                        message: `ooh no ${path.join('.')}`,
                        prefixed: `ooh no ${path.join('.')}`,
                    }
                }
            ]
        }
    }
    const values = {name: "shane"};
    const result = v(schema, options, values);
    assert.equal(result.errors.length, 1);
    assert.equal(result.errors[0].message, 'ooh no name');
    assert.equal(result.errors[0].prefixed, 'ooh no name');
});
