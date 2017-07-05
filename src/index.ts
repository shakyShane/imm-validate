import {fromJS, Map, List} from 'immutable';
import {format} from "./format";
import {validate, ValidatorFn, blank} from "./validate";

export function getTransformer(options: IMap, values: IMap, transformFn: Function) {
    return function validateFields(input: IMap, initial: IMap, path: string[]): IMap {
        return input.reduce((map: IMap, item, key: string) => {

            const lookup = [...path, key];

            if (Map.isMap(item)) {
                return map.set(key, validateFields(item, fromJS({}), lookup.concat('fields')));
            }

            const itemOptions = options.getIn(lookup, Map({}));
            const itemValues = values.getIn(lookup.filter(x => x !== 'fields'));

            return map.set(key, transformFn(item, itemOptions, itemValues, lookup.filter(x => x !== 'fields')));
        }, <IMap>initial);
    }
}
export default validate;
export {
    format,
    validate,
    blank,
    blank as blankValidate
}

export interface IncomingSchema {
    [index: string]: any
    fields?: IncomingSchema
    required?: boolean
    validators?: ValidatorFn[]
}

export type IncomingOptions = {[index: string]: IncomingOptions};
export type IncomingValues = {[index: string]: IncomingValues};
export type IMap = Map<string, any>;
export type MaybeMap = IMap|any;
export type simpleObject = {[index: string]: any}