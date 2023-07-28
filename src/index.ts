import hljs from "highlight.js";
import zig from "highlightjs-zig";

const textarea = document.getElementById("code") as HTMLTextAreaElement
const langInput = document.getElementById("language") as HTMLInputElement
const button = document.getElementById("highlight") as HTMLInputElement

hljs.registerLanguage("zig", zig)

button.addEventListener("click", (evt) => {
    evt.preventDefault()
    const lang = langInput.value
    const code = textarea.value
    const highlighted = highlight(code, lang) || code

    textarea.value = highlighted
}, false)

function highlight(str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
        let out = hljs.highlight(str, { language: lang }).value
        return unescape(format(out))
    }
    return ""
}
function format(str: string) {
    str = str.replace(/ {2,}/g, "@@$&@@")
    .replace(/--/g, "@@--@@")
    .replace(/<\/span>/g, "[[/span]]")
    .replace(/hljs/g, "--hl")
    .replace(/<span class="(.*?)">/g, '[[span style="color:var($1)"]]')
    .replace(/\[\[span style="color:var\((.*?)\)"]]/g, (match: string, p1: string) => {
        const part = p1.split(/\s(.+)/)[0].replace(/_/g, "")
        return `[[span style="color:var(${part})"]]`
    })
    .replace(/\*\*(.*?)\*\*/g, "@@$1@@")
    .replace(/var\(--hl-subst\)|var\(--hl-params\)/g, "initial")
    return str
}
function unescape(str: string) {
    let doc = new DOMParser().parseFromString(str, "text/html")
    return doc.documentElement.textContent
}