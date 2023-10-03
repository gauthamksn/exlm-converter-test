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

import Logger from '@adobe/aio-lib-core-logging';
let aioLogger = Logger("App");



import ExlClient from "./ExlClient.js"
import { createTabBlock, createNotesBlock } from "./blockGenerators.js";

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

        // return nhtml
        return dom.window.document.querySelector("body").outerHTML;
    } else {
        return { error: new Error(`No ID found for path: ${path}, see the url-mapping file for a list of available paths`) };
    }
}

export const main = async function main(params) {
    aioLogger.info({ params });
    // let path = params.__ow_path ? params.__ow_path : "/recXZZxBo4pkOnx9k";
    // path = path.slice(1)
    let path = "recXZZxBo4pkOnx9k"
    const response = renderDoc(path).then((html) => {
        return {
            statusCode: 200,
            headers: {
                "x-html2md-img-src": "https://experienceleague.adobe.com",
            },
            body: html,
        };
    }).catch((error) => {
        return { statusCode: 404, body: `Path invalid: ${error}` }
    })

    return response
}
