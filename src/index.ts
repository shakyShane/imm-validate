import {fromJS, Map, List} from 'immutable';
import {format} from "./format";
import {validate, ValidatorFn, blank} from "./validate";

const emptyMap = Map({});
const emptyList = List([]);

export function getTransformer(options: IMap, values: IMap, transformFn: Function) {

    return function validateFields(schema: IMap, initial: IMap, path: PathArray): IMap {

        return schema.reduce((map: IMap, item, key: string) => {

            const lookup = [...path, key];
            const schemaPath = lookup.filter(x => x !== 'fields');

            if (Map.isMap(item)) {
                return map.set(key, validateFields(item, fromJS({}), lookup.concat('fields')));
            }

            if (List.isList(item)) {

                const fields = options.getIn(lookup.concat('fields'), emptyList);
                const subject = map.set(key, emptyList);

                return fields.reduce((map: IMap, item: any, index: number) => {
                    const itemOptions = options.getIn(lookup.concat('fields', index), emptyMap);
                    const itemValues = values.getIn(schemaPath.concat(index));
                    return map.setIn([key, index], transformFn(item, itemOptions, itemValues, schemaPath.concat(index)));
                }, subject);
            }

            const itemOptions = options.getIn(lookup, emptyMap);
            const itemValues = values.getIn(schemaPath);

            return map.set(key, transformFn(item, itemOptions, itemValues, schemaPath));
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