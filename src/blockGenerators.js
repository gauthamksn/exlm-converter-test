export function createTabBlock(dom) {
    let tabs = dom.window.document.querySelectorAll("sp-tab")
    let tabsPanels = dom.window.document.querySelectorAll("sp-tab-panel")

    let tabHtml = ""
    tabs.forEach((tab, i) => {
        tabHtml += `<div><div>${tab.getAttribute("label")}</div><div>${tabsPanels[i].textContent}</div></div>`
    })
    dom.window.document.querySelector("sp-tabs").parentNode.classList = "tabs"
    dom.window.document.querySelector("sp-tabs").parentNode.innerHTML = tabHtml;
}

export function createNotesBlock(dom) {

    let notes = dom.window.document.querySelectorAll(".extension")
    notes.forEach((note) => {
        note.classList.remove("extension")
        note.classList = `notes ${note.classList}`
        let notesHtml = `<div><div>${note.children[0].textContent}</div><div/><div><div>${note.children[1] ? note.children[1].textContent : " "}</div></div>`
        note.innerHTML = notesHtml;
    })
}