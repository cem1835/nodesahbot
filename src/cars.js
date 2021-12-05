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

        await utilities.sleep(1500);

        let rows = await cars[getByFilterSym](page);

        exportedData = exportedData.concat(rows);

        console.log(`transaction in progress with ${rows.length} data.`)

        filterQueries = filterQueries.filter(x => x != query);
        return await this.getByFilters(filterQueries, exportedData);
    },
    getUpdatedDbData(dbData, serviceResult) {

        this.createIfNotExist(dbData, serviceResult);
        this.updateIfPriceChanged(dbData, serviceResult);
        this.deleteIfNotExistInDb(dbData, serviceResult);

        return dbData;
    },
    createIfNotExist(dbData, serviceResult) {

        serviceResult.forEach((car) => {

            let carInDb = dbData.find(x => x.dataId === car.dataId);

            if (carInDb == undefined)
                dbData.push({
                    dataId: car.dataId,
                    prices: [car.price],
                    creationTime: car.releaseDate,
                    priceChangeDates: [new Date().toJSON()],
                    isDeleted: false,
                    notifyFlagByPrices:1
                });
        });
    },
    updateIfPriceChanged(dbData, serviceResult) {

        serviceResult.forEach((car) => {
            let dbCar = dbData.find(x => x.dataId === car.dataId);

            if (dbCar !== undefined) {
                if (car.price !== dbCar.prices[dbCar.prices.length - 1]) {
                    dbCar.prices.push(car.price);
                    dbCar.priceChangeDates.push(new Date().toJSON());
                }
            }
        });
    },
    deleteIfNotExistInDb(dbData, serviceResult) {

        dbData.forEach((car) => {

            let serviceCar = serviceResult.find(x => x.dataId === car.dataId);

            if (serviceCar === undefined) {
                car.isDeleted = true;
            }
        });

    },
    async [getByFilterSym](page, exportedData = []) {

        if (await page.$(Limit50PassiveSelector) !== null) {

            await page.click(Limit50PassiveSelector);
            await utilities.sleep(1500);
        }



        if (exportedData.length > 0 && await page.$(NextSelector) !== null)
            await page.click(NextSelector);

        await utilities.sleep(1500);

        const rowParent = await page.$(SearchRowParentSelector);

        if(rowParent!==null){

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

            rows.forEach((row)=>{
                row.price=utilities.getSahBotHtmlToNumber(row.price);
            });

            exportedData = exportedData.concat(rows);
        }

        if (await page.$(NextSelector) == null) {
            return exportedData;
        }

        return await cars[getByFilterSym](page, exportedData);
    }
};