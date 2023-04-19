import { Parser, updateParserError, updateParserState } from "./parser"

const endOfLineRegex = /^(\r\n|\r|\n)$/

export const endOfLine = new Parser(
    state => {
        if(!state.OK) return state;
        const {targetString, index} = state;

        const slicedString = targetString.slice(index);

        const match = slicedString.match(endOfLineRegex);

        if(!match){
            return updateParserError(state, `endOfLine: Unable to match end of line at index ${index}`);
        }
        const result = match[0];

        return updateParserState(state, result, index+result.length)
    },
    'endOfLine'
)