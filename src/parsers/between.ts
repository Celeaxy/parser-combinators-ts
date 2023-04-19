import { Parser } from "./parser";
import { sequenceOf } from ".";

export function between<T, K>(left: Parser<T>, right: Parser<K>): <V>(content: Parser<V>) => Parser<V>{
    return <V>(content: Parser<V>) => sequenceOf<T | K | V>([
            left,
            content,
            right
        ]).map(result => result[1] as V);
}