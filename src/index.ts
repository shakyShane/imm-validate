import {fromJS, Map, List} from 'immutable';
import {format} from "./format";
import {validate, ValidatorFn, blank} from "./validate";

const emptyMap = Map({});
const emptyList = List([]);

export function getTransformer(options: IMap, values: IMap, transformFn: Function) {

    return function validateFields(schema: IMap, initial: IMap, path: PathArray): IMap {

        return schema.reduce((map: IMap, schemaItem, key: string) => {

            const lookup = [...path, key];
            const schemaPath = lookup.filter(x => x !== 'fields');

            if (Map.isMap(schemaItem)) {
                return map.set(key, validateFields(schemaItem, fromJS({}), lookup.concat('fields')));
            }

            if (List.isList(schemaItem)) {

                const fields = options.getIn(lookup.concat('fields'), emptyList);
                const subject = map.set(key, emptyList);

                return fields.reduce((map: IMap, item: any, index: number) => {
                    const schemaValue = schemaItem.get(index);
                    const isStringField = typeof schemaValue === 'string';

                    /**
                     * If the schema field was like ["string"],
                     * just validate the item with the current options/values
                     */
                    if (isStringField) {
                        const itemValues = values.getIn(schemaPath.concat(index));
                        const itemOptions = options.getIn(lookup.concat('fields', index), emptyMap);
                        return map.setIn([key, index], transformFn(item, itemOptions, itemValues, schemaPath.concat(index)));
                    }

                    /**
                     * If a map was given like [{name: string}],
                     * then validate item separately
                     */
                    if (Map.isMap(item)) {
                        return map.setIn([key, index], item.map((value: any, key: any) => {
                            const itemOptions = options.getIn(lookup.concat('fields', index, key), emptyMap);
                            const itemValues = values.getIn(schemaPath.concat(index, key));
                            return transformFn(value, itemOptions, itemValues, schemaPath.concat(index, key))
                        }));
                    }
                    return map;
                }, subject);
            }

            const itemOptions = options.getIn(lookup, emptyMap);
            const itemValues = values.getIn(schemaPath);

            return map.set(key, transformFn(schemaItem, itemOptions, itemValues, schemaPath));
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