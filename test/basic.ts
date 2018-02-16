import "mocha";

import { assert } from "chai";
import * as express from "express";
import * as http from "http";
import * as puppeteer from "puppeteer";
import * as serveStatic from "serve-static";

const port = 8080;
const server: Promise<http.Server> =
    new Promise(resolve => {
        const app = express();
        app.use(
            serveStatic("build", {
                "index": "index.html"
            }));
        resolve(app.listen(port));
    });
const browser: Promise<puppeteer.Browser> =
    new Promise(async resolve =>
        resolve(await puppeteer.launch()));
const page: Promise<puppeteer.Page> =
    new Promise(async resolve =>
        resolve(await (await browser).newPage()));

before(async () => {
    await server;
    await browser;
    await page;
});

after(async () => {
    (await browser).close();
    (await server).close();
});

beforeEach(async () =>
    await (await page).goto(`http://localhost:${port}/`));

const delay = (time: number) =>
    new Promise(_ => setTimeout(_, time));

const load = async () => {
    await delay(50);
    await (await page).waitForSelector("body:not(.loading)");
};

const firstNameInList = async () =>
    await (await page).evaluate(() => {
        const element = document.querySelector(".name:not(.header)");
        return element !== null ? element.textContent : "";
    });

describe("Example tests", () => {

    it("can create new widget", async () => {
        const newButton = await (await page).waitForSelector("button.new");
        await newButton.click();
        const nameInput = await (await page).waitForSelector(".name input");
        nameInput.type("Test Widget");
        const submitButton = await (await page).waitForSelector("button[type=submit]");
        await submitButton.click();
    });

    it("can sort widgets", async () => {
        const idHeaderButton = await (await page).waitForSelector(".id.header button");
        const name1 = await firstNameInList();
        await idHeaderButton.click();
        await load();
        const name2 = await firstNameInList();
        assert(name1 !== name2, "order changed");
    });

    it("can delete widget", async () => {
        const name1 = await firstNameInList();
        const deleteButton = await (await page).waitForSelector("button.delete");
        await deleteButton.click();
        await load();
        const name2 = await firstNameInList();
        assert(name1 !== name2, "widget removed");
    });

});