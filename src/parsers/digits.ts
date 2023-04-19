import { Parser, updateParserError, updateParserState } from "./parser";

const digitsRegex = /^\d+/

export const digits = new Parser(state => {
    if(!state.OK) return state;

    const {targetString, index} = state;

    const slicedString = targetString.slice(index);

    if(slicedString.length === 0){
        return updateParserError(state, 'digits: Unexpected end of input!');
    }
    
    const match = slicedString.match(digitsRegex);

    if(match === null){
        return updateParserError(state, 'digits: Could not match any digits!');
    }

    const result = match[0];

    return updateParserState(state, result, index+result.length)    
}, 'digits')