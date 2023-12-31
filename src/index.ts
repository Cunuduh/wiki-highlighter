import hljs from "highlight.js/lib/core";
import scipscript from "./scipscript";
import zig from "highlightjs-zig";

const textarea = document.getElementById("code") as HTMLTextAreaElement
const langInput = document.getElementById("language") as HTMLInputElement
const button = document.getElementById("highlight") as HTMLInputElement

hljs.registerLanguage("scipscript", scipscript)
hljs.registerLanguage("zig", zig)

button.addEventListener("click", async (evt) => {
    evt.preventDefault()
    const lang = langInput.value
    const code = textarea.value
    const highlighted = await highlight(code, lang) || code
    textarea.value = highlighted
    textarea.select()
}, false)

async function highlight(str: string, lang: string) {
    if (lang) {
        if (!hljs.getLanguage(lang)) {
            const module = await tryImport(lang)
            hljs.registerLanguage(lang, module.default)
        }
        let out = hljs.highlight(str, { language: lang }).value;
        return unescape(format(out));
    }
    return "";
}
async function tryImport(lang: string) {
    try {
        return await import(
            /* webpackChunkName: "hljs-[request]" */
            /* webpackMode: "lazy" */
            `../node_modules/highlight.js/lib/languages/${lang}.js`)
    } catch (err) {
        console.error(`Failed to load language module for ${lang}:`, err);
    }
}
function format(str: string) {
    return escapeWikidot(str)
    .replace(/<\/span>/g, "[[/span]]")
    .replace(/<span class="(.*?)">/g, '[[span class="$1"]]')
}
function escapeWikidot(str: string) {
    return str
        .replace(/@@(.*?)@@/gms, "@<@@>@$1@<@@>@")
        .replace(/  +/g, "@<$&>@")
        .replace(/--(.*?)--/gm, "@<-->@$1@<-->@")
        .replace(/\[\!-- (.*?) --]/gms, "@<[!-->@$1@<--]>@")
        .replace(/^: /gm, "@<:>@")
        .replace(/^# /gm, "@<#>@")
        .replace(/^\* /gm, "@<*>@")
        .replace(/`{1,2}/g, "@<$&>@")
        .replace(/^\+{1,6}(\s|$)/g, "@<+>@$1")
        .replace(/\[\[(.*?)]]/gms, "@<[[>@$1@<]]>@")
        .replace(/\^\^(.*?)\^\^/gms, "@<^^>@$1@<^^>@")
        .replace(/^\|+/gm, "@<$&>@")
        .replace(/,,(.*?)"/gms, "@<,,>@$1@<\">@")
        .replace(/,,(.*?),,/gms, "@<,,>@$1@<,,>@")
        .replace(/>>(.*?)<</gms, "@<>>>@$1@<<<>@")
        .replace(/^>+/gm, "@<$&>@")
        .replace(/{{(.*?)}}/gms, "@<{{>@$1@<}}>@")
        .replace(/__(.*?)__/gms, "@<__>@$1@<__>@")
        .replace(/\/\/\*\*(.*?)\*\*\/\//gms, "@<//**>@$1@<**//>@")
        .replace(/\/\/(?!\*\*)(.*?)(?!\*\*)\/\//gms, "&#64;&lt;//&gt;&#64;$1&#64;&lt;//&gt;&#64;")
        .replace(/(?<!\/\/)\*\*(?!\/\/)(.*?)(?<!\/\/)\*\*(?!\/\/)/gm, "@<**>@$1@<**>@")
        .replace(/\.\.\./g, "@<...>@")
        .replace(/(?<!@@)--(?!@@)/g, "@<-->@")
        .replace(/(?<!\*\*|\/\/)\*\*(?!\*\*|\/\/)/g, "@<**>@")
}
function unescape(str: string) {
    let doc = new DOMParser().parseFromString(str, "text/html")
    return doc.documentElement.textContent
}