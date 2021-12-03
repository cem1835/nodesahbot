import {SearchRowParentSelector, RowsSelector, Url, Limit50PassiveSelector, NextSelector} from "./consts.js"
import {browser} from "./browser.js"
import {utilities} from "./utilities.js";

const getByFilterSym = Symbol("getByFilter");

export const cars = {

    async getByFilters(filterQueries = [], exportedData = []) {

        if (filterQueries.length == 0)
            return exportedData;

        await browser.init();
        let browserInstance = browser.getInstance();

        const [page] = await browserInstance.pages();

        const query = filterQueries[0];

        await page.goto(`${Url}/${query}`);

        await  utilities.sleep(1500);

        let rows = await cars[getByFilterSym](page);

        exportedData = exportedData.concat(rows);

        console.log(`transaction in progress with ${exportedData.length} data.`)

        filterQueries = filterQueries.filter(x => x != query);
        return await this.getByFilters(filterQueries, exportedData);
    },
    async [getByFilterSym](page, exportedData = []) {

        if (await page.$(Limit50PassiveSelector) !== null){

            await page.click(Limit50PassiveSelector);
            await utilities.sleep(1500);
        }

        if (await page.$(NextSelector) == null) {
            return exportedData;
        }


        if (exportedData.length > 0)
            await page.click(NextSelector);

        await utilities.sleep(1000);

        const rowParent = await page.$(SearchRowParentSelector);
        const rows = await rowParent.$$eval(RowsSelector,
            el => el.map(row => ({
                    dataId: row.getAttribute("data-id"),
                    model: row.children[1].innerHTML.trim(),
                    title: row.children[2].innerHTML.trim(),
                    year: row.children[3].innerHTML.trim(),
                    km: row.children[4].innerHTML.trim(),
                    color: row.children[5].innerHTML.trim(),
                    price: row.children[6].innerHTML.trim(),
                    releaseDate: row.children[7].innerHTML.trim(),
                    city: row.children[8].innerHTML.trim(),
                })
            ));

        exportedData = exportedData.concat(rows);

        return await cars[getByFilterSym](page, exportedData);
    }
};