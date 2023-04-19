import { Parser, ParserState, updateParserError, updateParserResult} from "./parser";


export function sequenceOf<T>(parsers : Parser<T>[]){
    return new Parser(
        state => {
            if(!state.OK) return state;

            const results: T[] = []

            let currentState: ParserState<T> | null = null
            let success = state;

            for(let parser of parsers){
                currentState = currentState !== null ?  parser.transformerFunction(currentState) : parser.transformerFunction(state);
                if(!currentState.OK){
                    return updateParserError(state, `sequenceof: Unable to match ${parser.name ? '['+parser.name + '] ': ''}parser at index ${currentState.index}`)
                }
                success = currentState
                results.push(currentState.result);
            }

            return updateParserResult(success, results)
        },
        'sequenceOf'
    )
}