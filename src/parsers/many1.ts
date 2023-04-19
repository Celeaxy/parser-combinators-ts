import { Parser, type ParserState, updateParserResult, updateParserError } from ".";

export function many1<T>(parser: Parser<T>): Parser<T[]>{
    return new Parser(state => {
        if(!state.OK) return state;

        const results: T[] = [];

        let success = state;
        let nextState: ParserState<T> = parser.transformerFunction(state)

        if(!nextState.OK){
            return updateParserError(state, `many1: Unable to match any input using ${parser.name ? '['+parser.name + '] ': ''}parser at index ${state.index}`)
        }

        while(nextState.OK){
            success = nextState;
            results.push(nextState.result)
            nextState = parser.transformerFunction(success)
        }

        return updateParserResult(success, results)
    })
}