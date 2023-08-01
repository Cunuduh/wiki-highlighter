import { HLJSApi, LanguageFn, Mode } from 'highlight.js';
import typescriptLang from 'highlight.js/lib/languages/typescript';

/*
Language: SCiPScript
Requires: typescript.js
Description: SCiPScript is a fictional programming language made for the SCP Foundation back-end.
*/

const scipscript: LanguageFn = (hljs: HLJSApi) => {
    const tsLanguage = typescriptLang(hljs);
    tsLanguage.contains[16].beginKeywords = "while if switch catch for match with default"; // function-like keywords
    const KEYWORDS: string[] = [
        "match",
        "when",
        "errortype",
        "default",
        "shared",
        "with",
    ]
    
    return {
        className: 'language-scipscript',
        name: 'SCiPScript',
        aliases: ['scipscript', 'scips'],
        keywords: [...KEYWORDS, ...(tsLanguage.keywords as string[])],
        contains: tsLanguage.contains,
    }
}

export default scipscript;
