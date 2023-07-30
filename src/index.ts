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
    textarea.select()
}, false)

function highlight(str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
        let out = hljs.highlight(str, { language: lang }).value
        return unescape(format(out))
    }
    return ""
}

function format(str: string) {
    return escapeWikidot(str)
    .replace(/<\/span>/g, "[[/span]]")
    .replace(/hljs/g, "hl")
    .replace(/<span class="(.*?)">/g, '[[span class="$1"]]')
    .replace(/\[\[span class="(.*?)"]]/g, (match: string, p1: string) => {
        const part = p1.split(/\s(.+)/)[0].replace(/_/g, "")
        return `[[span class="${part}"]]`
    })
}
function escapeWikidot(str: string) {
    return str
    .replace(/^\s{2,}/gm, "@@$&@@")
    .replace(/--(.*?)--/gm, "@@--@@$1@@--@@")
    .replace(/\[\!-- (.*?) --]/gms, "@@[!--@@ $1 @@--]@@")
    .replace(/^: /gm, "@@:@@")
    .replace(/^# /gm, "@@#@@")
    .replace(/^\* /gm, "@@*@@")
    .replace(/`{1,2}/g, "@@$&@@")
    .replace(/^\+{1,6}(\s|$)/g, "$1@@+$2")
    .replace(/\[\[(.*?)]]/gms, "@@[[@$1]]@@")
    .replace(/\^\^(.*?)\^\^/gms, "@@^^$1^^@@")
    .replace(/^\|+/gm, "@@$&@@")
    .replace(/,,(.*?)"/gms, "@@,,$1\"@@")
    .replace(/,,(.*?),,/gms, "@@,,$1,,@@")
    .replace(/>>(.*?)<</gms, "@@>>$1<<@@")
    .replace(/^>+/gm, "@@$&@@")
    .replace(/{{(.*?)}}/gms, "@@{{@@$1@@}}@@")
    .replace(/__(.*?)__/gms, "@@__@@$1@@__@@")
    .replace(/\/\/\*\*(.*?)\*\*\/\//gms, "@@//**@@$1@@**//@@")
    .replace(/(?<!@@)\/\/(.*?)\/\/(?!@@)/gms, "@@//@@$1@@//@@")
    .replace(/(?<!\/\/)\*\*(?!\/\/)(.*?)(?<!\/\/)\*\*(?!\/\/)/gm, "@@**$1**@@")
    .replace(/\.\.\./g, "@@...@@")
    .replace(/(?<!@@)--(?!@@)/g, "@@--@@")
    .replace(/(?<!\*\*|\/\/)\*\*(?!\*\*|\/\/)/g, "@@**@@")
}
function unescape(str: string) {
    let doc = new DOMParser().parseFromString(str, "text/html")
    return doc.documentElement.textContent
}