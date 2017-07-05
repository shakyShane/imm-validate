import {getTransformer, IMap, IncomingOptions, IncomingSchema, IncomingValues, MaybeMap} from "./index";
import {fromJS, List, Map} from "immutable";

const emptyList = List([]);

export function format(schema: IncomingSchema, options: IncomingOptions, values: IncomingValues): IncomingSchema {
    const I_schema  = fromJS(schema);
    const I_options = fromJS(options);
    const I_values  = fromJS(values);

    const fields = getTransformer(I_options, I_values, applyFormatters)(I_schema, fromJS({}), []);

    return fields.toJS();
}

function applyFormatters(item: MaybeMap, options: IMap, value: any, path: string[]) {
    const map = Map.isMap(item) ? item : Map({});
    const formatters = options.get('formatters', emptyList);
    return formatters.reduce((acc: any, fn: FormatFn) => {
        return fn.call(null, options, acc);
    }, value);
}

export type FormatFn = (options: IMap, value: any) => any
