import { HLJSApi, LanguageFn } from 'highlight.js';
import typescriptLang from 'highlight.js/lib/languages/typescript';

/*
Language: SCiPScript
Requires: typescript.js
Description: SCiPScript is a fictional programming language made for the SCP Foundation back-end.
*/

const scipscript: LanguageFn = (hljs: HLJSApi) => {
    let tsLanguage = typescriptLang(hljs);
    tsLanguage.contains[16].beginKeywords += "match with default"; // function-like keywords
    const TYPES = [ 
        "error",
        "u8",
        "u16",
        "u32",
        "u64",
        "u128",
        "i8",
        "i16",
        "i32",
        "i64",
        "i128",
        "f16",
        "f32",
        "f64",
        "f80",
        "f128",
    ]
    if (typeof tsLanguage.keywords !== 'string') {
        tsLanguage.keywords.built_in = tsLanguage.keywords.built_in.filter(keyword =>
            !/\b(?:string|number|any|unknown|bigint)\b/g.test(keyword)
        ).concat(TYPES);
    }
    if (typeof tsLanguage.contains[29].keywords !== 'string') {
        tsLanguage.contains[29].keywords = tsLanguage.contains[29].keywords.built_in.filter(keyword =>
            !/\b(?:string|number|any|unknown|bigint)\b/g.test(keyword)
        ).concat(TYPES);
    }
    const KEYWORDS: string[] = [
        "match",
        "when",
        "errorset",
        "default",
        "shared",
        "with",
    ]
    if (typeof tsLanguage.keywords !== 'string') {
        return {
            name: 'SCiPScript',
            aliases: ['scipscript', 'scips'],
            keywords: {
                $pattern: tsLanguage.keywords.$pattern,
                keyword: tsLanguage.keywords.keyword.concat(KEYWORDS).filter(keyword =>
                    !/\b(?:switch|case|throw)\b/g.test(keyword)
                ),
                literal: tsLanguage.keywords.literal,
                built_in: tsLanguage.keywords.built_in,
                "variable.language": tsLanguage.keywords["variable.language"],
            },
            contains: tsLanguage.contains,
            exports: tsLanguage.exports,
            illegal: tsLanguage.illegal,
        }
    }
    return tsLanguage
}

export default scipscript;
