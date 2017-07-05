> a forgiving validator/formatter

You could use this to power a schema-powered form library or anything where 
you want to validate/format values are arbitrary levels of nesting.

Smallest Example possible:

```js
const {validate} = require('imm-validate');
// define schema 'shape' (types not used yet)
const schema = {
    name: "string"
}

// define options for each key in schema
const options = {
    name: {
        validators: [
            function alwaysFalse() {
                return false
            }
        ]
    }
}

// tracked values 
const values = {name: "shane"}

// convenience the tracked values against the schema/options
const result = validate(schema, options, values);

/**
 * result.fields     <- with errors at each level
 * result.error      <- all errors collated
 * result.hasErrors  <- convienience
 * result.singularErrors  <- only show first error from each property (useful
 *                           if you have multiple validators)
 */

```

