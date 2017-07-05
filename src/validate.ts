import {fromJS, Map, List} from 'immutable';
import {format} from "./format";
import {
    getTransformer,
    IMap,
    IncomingOptions,
    IncomingSchema,
    IncomingValues,
    MaybeMap,
    simpleObject,
} from "./index";

const emptyList = List([]);
const emptyMap = Map([]);

const defaultValidators = {
    required: {
        name: 'required',
        fn: required,
        error: 'This is a required field'
    }
};

export function validate(schema: IncomingSchema, options: IncomingOptions, values: IncomingValues): ValidationResults {
    const I_schema  = fromJS(schema);
    const I_options = fromJS(options);
    const I_values  = fromJS(values);

    const fields = getTransformer(I_options, I_values, validateItem)(I_schema, fromJS({}), []);
    const errors = flattenErrors(fields);
    const singularErrors = flattenErrors(fields, 1);

    return {
        fields: fields.toJS(),
        errors: errors.toJS(),
        hasErrors: errors.size > 0,
        singularErrors: singularErrors.toJS()
    };
}

/**
 * Export an object in the correct shape, but without any validators running
 */
export function blank(schema: IncomingSchema, options: IncomingOptions, values: IncomingValues): ValidationResults {
    const I_schema  = fromJS(schema);
    const I_options = fromJS(options);
    const I_values  = fromJS(values);

    const fields = getTransformer(I_options, I_values, blankItem)(I_schema, fromJS({}), []);

    return {
        fields: fields.toJS(),
        errors: [],
        hasErrors: false,
        singularErrors: []
    };
}

function validateItem(item: MaybeMap, options: IMap, value: any, path: string[]): IMap {
    const map = Map.isMap(item) ? item : Map({});
    const itemValidators = getValidators(options);
    const errors = collectErrors(itemValidators, options, value, path);

    return map.merge(fromJS({
        value,
        errors,
        hasError: errors.size > 0
    }))
}

export function blankItem(item: MaybeMap, options: IMap, value: any, path: string[]): IMap {
    const map = Map.isMap(item) ? item : Map({});
    return map
        .set('errors', emptyList)
        .set('hasError', false)
}

function collectErrors(validators: List<IValidator>, options: IMap, value: any, path: string[]) {
    return validators.reduce((list: List<ValidationError>, validator: IValidator) => {
        const fn: ValidatorFn = validator.get('fn');
        const result = fn(options, value, path);
        return list.concat(createResult(validator, options, result, path));
    }, List([]))
}

function getValidators(options: IMap): List<IValidator> {
    if (options.get('validators', emptyList).size > 0) {
        return options
            .get('validators')
            .map((validator: IValidator) => {

                const defaultV = fromJS({
                    name: (validator as any).name || 'unknown [Function]',
                    fn: validator,
                    error:  'This field is invalid'
                });

                if (typeof validator === "function") {
                    return defaultV;
                }

                return defaultV.merge(validator);
            })
    }
    return fromJS(defaultValidators)
        .filter((validator: IValidator) => {
            // if required: true, for example in options
            return options.get(validator.get('name'));
        });
}

function required(options: IMap, value: any, path: string[]) {
    const result = (value);
    return result;
}

function createResult(validator: IValidator, options: IMap, result: ValidatorResult, path: string[]) {
    const message = options.get('error', validator.get('error'));
    const prefixed = options.get('label')
        ? `${options.get('label')}: ${message}`
        : message;

    const defaultResult = fromJS({
        message,
        type: validator.get('name'),
        prefixed,
        path,
    });

    if (isObjectObject(result)) {
        if (!(result as any).result) {
            return List([defaultResult.merge(fromJS(result))]);
        } else {
            return emptyList;
        }
    }

    return result
        ? emptyList
        : List([defaultResult]);
}

function flattenErrors(fields: IMap, limit = 10): List<IValidationError> {
    return fields.reduce((list: any, item: any) => {
        if (Map.isMap(item)) {
            if (item.has('errors')) { // top level if 'errors' key exists
                return list.concat(item.get('errors').take(limit));
            }
            return list.concat(flattenErrors(item, limit).take(limit));
        }
        return list;
    }, List<IValidationError>([]));
}

function isObjectObject(o: any): boolean {
    return isObject(o) && Object.prototype.toString.call(o) === '[object Object]';
}

function isObject(val: any): boolean {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

export type ValidatorResult = boolean|ValidationError;

export interface ValidationResults {
    fields: simpleObject
    errors: ValidationError[]
    hasErrors: boolean
    singularErrors: ValidationError[]
}

export interface ValidationError {
    result?: boolean;
    message?: string;
    type?: string;
    prefixed?: string;
}

export interface Result {
    value: any;
    errors: List<ValidationError>
}

export interface Validator {
    result?: boolean
    name: string;
    error:  string;
    fn(): ValidatorResult;
}

export type ValidatorFn = (options: IMap, value: any, path: string[]) => ValidatorResult;
export type IValidator = Map<keyof Validator, any>
export type IValidationError = Map<keyof ValidationError, any>