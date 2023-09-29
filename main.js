import express from "express";
import { JSDOM } from "jsdom"

import { toHast as mdast2hast, defaultHandlers } from 'mdast-util-to-hast';

import { raw } from 'hast-util-raw';
import remarkGridTable from '@adobe/remark-gridtables';
import {
    mdast2hastGridTablesHandler,
    TYPE_TABLE,
} from '@adobe/mdast-util-gridtables';
import { toHtml } from 'hast-util-to-html';
import rehypeFormat from 'rehype-format';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';

import createPageBlocks from '@adobe/helix-html-pipeline/src/steps/create-page-blocks.js';
import { h } from 'hastscript';
import fixSections from '@adobe/helix-html-pipeline/src/steps/fix-sections.js';



import ExlClient from "./ExlClient.js"
import { createTabBlock, createNotesBlock } from "./blockGenerators.js";

const id = "recXZZxBo4pkOnx9k"

const exlClient = new ExlClient()

const renderDoc = async function renderDocs(id) {
    if (id) {
        const response = await exlClient.getArticle(id);
        const md = response.data.FullBody;
        const mdast = unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkGridTable)
            .parse(md.trim());

        const main = mdast2hast(mdast, {
            handlers: {
                ...defaultHandlers,
                [TYPE_TABLE]: mdast2hastGridTablesHandler(),
            },
            allowDangerousHtml: true,
        });

        // return main
        const content = {
            hast: main
        };

        fixSections({ content });
        createPageBlocks({ content });

        const hast = h('html', [
            h('body', [
                h('header', []),
                h('main', content.hast),
                h('footer', [])]),
        ]);
        raw(hast);
        rehypeFormat()(hast);
        const html = toHtml(hast, {
            upperDoctype: true,
        });

        let nhtml = html.replaceAll("&#x3C;", "<")
        nhtml = nhtml.replaceAll(`<tr style="border: 0;">`, "</table>")

        const dom = new JSDOM(nhtml)

        createTabBlock(dom)
        createNotesBlock(dom)

        return dom.window.document.querySelector("body").outerHTML;
        // return nhtml
    } else {
        return { error: new Error(`No ID found for path: ${path}, see the url-mapping file for a list of available paths`) };
    }
}

let main = renderDoc(id)



main.then((main) => {
    const app = express();

    app.get("/", (req, res) => {
        res.send("EXLM CONVERTER")
    })

    app.get("/test-notes", (req, res) => {
        res.send(main);
    });

    app.listen(5000, () => {
        console.log("Listening on the port 5000 : http://localhost:5000/test-notes");
    });
})

