import {fromJS, Map, List} from 'immutable';
import {format} from "./format";
import {validate, ValidatorFn, blank} from "./validate";

const emptyMap = Map({});
const emptyList = List([]);

export function getTransformer(options: IMap, values: IMap, visitor: Function) {

    return function validateFields(schema: IMap, initial: IMap, path: PathArray): IMap {

        return schema.reduce((map: IMap, schemaItem, key: string) => {

            const lookup = [...path, key];
            const schemaPath = lookup.filter(x => x !== 'fields');
            const valuePath = schemaPath;

            if (List.isList(schemaItem)) {
                return map.set(key, schemaItem.map((item: any, index: number) => {
                    if (Map.isMap(item)) {
                        return validateFields(item, fromJS({}), lookup.concat('fields', index))
                    } else {
                        console.log('ere');
                    }
                }))
            }

            if (Map.isMap(schemaItem)) {
                return map.set(key, validateFields(schemaItem, fromJS({}), lookup.concat('fields')));
            }


            const itemOptions = options.getIn(lookup, emptyMap);
            const itemValues = values.getIn(valuePath);

            return map.set(key, visitor(schemaItem, itemOptions, itemValues, schemaPath));

        }, <IMap>initial);
    }
}
export type PathArray = (string | number)[];
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
export type PlainObject = {[index: string]: any}