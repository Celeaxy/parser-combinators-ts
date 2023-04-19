import { Parser, updateParserState, updateParserResult, ParserState } from ".";

export function many<T>(parser: Parser<T>): Parser<T[]>{
    return new Parser(state => {
        if(!state.OK) return state;

        const results: T[] = [];

        let success = state;
        let nextState: ParserState<T> = parser.transformerFunction(state)

        while(nextState.OK){
            success = nextState;
            results.push(nextState.result)
            nextState = parser.transformerFunction(success)
        }

        return updateParserResult(success, results)
    }, 'many')
}
