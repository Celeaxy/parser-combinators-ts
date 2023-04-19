import { Parser, updateParserError, updateParserState } from "./parser";

type LowerCase = 'a'|'b'|'c'|'d'|'e'|'f'|'g'|'h'|'i'|'j'|'k'|'l'|'m'|'n'|'o'|'p'|'q'|'r'|'s'|'t'|'u'|'v'|'w'|'x'|'y'|'z';
type UpperCase = 'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H'|'I'|'J'|'K'|'L'|'M'|'N'|'O'|'P'|'Q'|'R'|'S'|'T'|'U'|'V'|'W'|'X'|'Y'|'Z';
type Letter = LowerCase | UpperCase;
type Digit = '0'|'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9';


type Character = Letter | Digit;

const characterRegex = /^./;

function isCharacter(s: string): s is Character{
    return s.length === 1
}


export function char(character: Character): Parser<unknown, Character>{
    return new Parser(state => {
        if(!state.OK) return state;

        const slicedString = state.targetString.slice(state.index)

        const match = slicedString.match(characterRegex);

        const result = match ? match[0] : '';

        if(match && isCharacter(result) && result === character){
            return updateParserState(state, result, state.index+result.length)
        }

        return updateParserError(state, `char: Unable to match a character [${character}] at index ${state.index}`)
    }, character)
}