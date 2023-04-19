import { updateParserError, Parser, updateParserState } from "./parser";

export function str<T>(s: string): Parser<string>{
    return new Parser(state => {
        const {
            OK,
            index,
            targetString
        } = state;

        if(!OK) return state;
        
        if(targetString.slice(index).startsWith(s)){
            return updateParserState(state, s, index+s.length);
        }
        
        return updateParserError(state, `str: Could not match ${JSON.stringify(s)}!`)
    }, 'str')
}