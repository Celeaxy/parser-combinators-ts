import { Parser, updateParserError} from "./parser";


export function choice<T>(parsers : Parser<T>[]): Parser<T>{
    return new Parser(state => {
        if(!state.OK) return state;

        for(let parser of parsers){
            const nextState = parser.transformerFunction(state)
            if(nextState.OK){
                return nextState;
            }
        }
        const parserNames = parsers.map(parser => parser.name).filter(name => name !== undefined)
        return updateParserError(state, `choice: Unable to match parsers ${parserNames.length? '[' + parserNames.join(', ') + '] ' : ''}at index ${state.index}.`)
    }, 'choice')
}