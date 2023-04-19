import { Parser, choice, digits,str, updateParserState, sequenceOf, updateParserResult, ParserSuccess, updateParserError } from "./parsers";
import { between } from "./parsers/between";
import { letters } from "./parsers/letters";


const digitsOrLetters = choice([digits, letters]);




const betweenBrackets = between(str('['), str(']'))


const numberParser = digits.map(value => Number(value));
const numberBetweenBrackets = betweenBrackets(numberParser);

const skipParser = (n: number) => sequenceOf([new Parser<string>(state => {
    if(!state.OK) return state;

    return updateParserState(state, state.result, state.index+n);
}), letters])

const parser = numberBetweenBrackets.chain(value => 
    skipParser(value)
);

function succeed<T>(value: T): Parser<T>{
    return new Parser(state => {
        if(!state.OK) throw new Error('succeed can only be called on succesful parsing!')
        return updateParserResult(state, value)
    })
}

function fail(errorMessage: string): Parser<any> {
    return new Parser(state => {
        if(state.OK) throw new Error('fail can only be called on failed parsing!')
        return updateParserError(state, errorMessage)
    })
}


function contextual<T>(generator: Generator<T> ){
    return succeed(null).chain(() => {
        const iterator = generator();
    })
}
console.log(parser.run('[3]abc'))