// export function createTabBlock(dom) {
//     let tabs = dom.window.document.querySelectorAll("sp-tab")
//     let tabsPanels = dom.window.document.querySelectorAll("sp-tab-panel")

//     let tabHtml = "<tr><td>tabs-md</td><td></td></tr>"
//     // let finalTabHtml = ``
//     tabs.forEach((tab, i) => {
//         tabHtml += `<tr><td>${tab.getAttribute("label")}</td><td>${tabsPanels[i].textContent}</td></tr>`
//     })

//     let table = dom.window.document.createElement("table")
//     table.innerHTML = tabHtml;

//     dom.window.document.querySelector("sp-tabs").parentNode.classList = "tabs-md"
//     // dom.window.document.querySelector("sp-tabs").innerHTML = tabHtml;
//     dom.window.document.querySelector("sp-tabs").replaceWith(table)
// }

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

