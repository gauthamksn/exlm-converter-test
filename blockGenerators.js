export function createTabBlock(dom) {
    let tabs = dom.window.document.querySelectorAll("sp-tab")
    let tabsPanels = dom.window.document.querySelectorAll("sp-tab-panel")

    let tabHtml = ""
    tabs.forEach((tab, i) => {
        tabHtml += `<div><div>${tab.getAttribute("label")}</div><div>${tabsPanels[i].textContent}</div></div>`
    })
    dom.window.document.querySelector("sp-tabs").parentNode.classList = "tabs-md"
    dom.window.document.querySelector("sp-tabs").parentNode.innerHTML = tabHtml;
}