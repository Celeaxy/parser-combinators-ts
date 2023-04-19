type Success<T> = {
    OK: true,
    result: T
}

type Failure = {
    OK: false
    error: string
}

type ParserContext = {
    targetString: string
    index: number
}

export type ParserSuccess<T> = ParserContext & Success<T>
export type ParserFailure = ParserContext & Failure

export type ParserState<T> = ParserSuccess<T> | ParserFailure;


export function updateParserState<T, K>(state: ParserSuccess<T>, result: K, index: number): ParserSuccess<K>{
    return {
        ...state,
        result,
        index
    }
}

export function updateParserResult<T, K>(state: ParserSuccess<T>, result: K): ParserSuccess<K>{
    return {
        ...state,
        result
    }
}

export function updateParserError(state: ParserState<any>, errorMessage: string): ParserFailure {
    return {
        ...state,
        OK: false,
        error: errorMessage
    }
}

type ParserStateTransformerFunction<T> = (state: ParserState<any>) => ParserState<T>

export class Parser<T>{
    private parserStateTransformerFunction: ParserStateTransformerFunction<T>;
    private _name?: string;

    constructor(parserStateTransformerfunction: ParserStateTransformerFunction<T>, name?: string){
        this.parserStateTransformerFunction = parserStateTransformerfunction;
        this.name = name;
    }

    get transformerFunction(): ParserStateTransformerFunction<T>{
        return this.parserStateTransformerFunction;
    }

    get name(): string | undefined{
        return this._name;
    }
    set name(value: string | undefined){
        this._name = value
    }

    run(targetString: string): ParserState<T> {
        const initialState: ParserState<any> = {
            OK: true,
            index: 0,
            result: null,
            targetString
        }
        return this.parserStateTransformerFunction(initialState)
    }

    map<V>(fn: ((value: T) => V)): Parser<V>{
        return new Parser(state => {
            const nextState = this.parserStateTransformerFunction(state);
            
            if(!nextState.OK) return nextState;

            return updateParserResult(nextState, fn(nextState.result));
        })
    }

    chain<V>(fn: ((value: T) => Parser<V>)): Parser<V>{
        return new Parser(state => {
            const nextState = this.parserStateTransformerFunction(state);

            if(!nextState.OK) return nextState;

            const nextParser = fn(nextState.result);

            return nextParser.parserStateTransformerFunction(nextState);
        })
    }
}