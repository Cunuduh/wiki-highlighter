import hljs from "highlight.js";
import he from "he";

const textarea = document.getElementById("code") || document.createElement("textarea")
const langInput = document.getElementById("language")
const button = document.getElementById("highlight")

button.addEventListener("click", (evt) => {
    evt.preventDefault()
    const lang = langInput.value
    const code = textarea.value
    const highlighted = highlight(code, lang)

    textarea.value = highlighted
}, false)

function highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
        try {
            let out = hljs.highlight(lang, str).value
            return he.unescape(format(out))
        } catch (__) {}
    }
    return ""
}
function format(str) {
    str = str.replace(/ {2,}/g, "@@$&@@")
    .replace(/--/g, "@@--@@")
    .replace(/<\/span>/g, "[[/span]]")
    .replace(/hljs/g, "--hl")
    .replace(/<span class="(.*?)">/g, '[[span style="color:var($1)"]]')
    .replace(/\[\[span style="color:var\((.*?)\)"]]/g, (match, p1) => {
        const part = p1.split(/\s(.+)/)[0].replace(/_/g, "")
        return `[[span style="color:var(${part})"]]`
    })
    .replace(/\*\*(.*?)\*\*/g, "@@$1@@")
    .replace(/var\(--hl-subst\)|var\(--hl-params\)/g, "initial")
    return str
}