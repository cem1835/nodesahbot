export const utilities = {

    getByChildrenClass(element, className) {
        return Array.from(element.children).filter(x => x.getAttribute("class") == className)[0]
    },
    sleep(miliSeconds) {
        return new Promise(function (resolve) {
            setTimeout(resolve, miliSeconds)
        });
    },
    getCurrentDateForFileFormat() {
        const date = new Date();

        return date.getFullYear() + "_" + (date.getMonth() + 1) + "_" + date.getDate() + "_" + date.getHours() + "_" + date.getMinutes();
    },
    getSahBotHtmlToNumber(price){
        const str =price.replace("<div>","").replace("TL","").replace("</div>","").trim().replace(".","").replace(",","");
        return parseInt(str);
    }
};