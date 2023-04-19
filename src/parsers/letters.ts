import { Parser, updateParserError, updateParserState } from "./parser";

const lettersRegex = /^[A-Za-z]+/

export const letters = new Parser(state => {
    if(!state.OK) return state;

    const {targetString, index} = state;

    const slicedString = targetString.slice(index);

    if(slicedString.length === 0){
        return updateParserError(state, 'Unexpected end of input!');
    }
    
    const match = slicedString.match(lettersRegex);

    if(match === null){
        return updateParserError(state, 'letters: Could not match any letters!');
    }

    const result = match[0];

    return updateParserState(state, result, index+result.length)    
}, 'letters')