import * as fs from "fs"

export const fileOperations = {

    writeToFile(fileName, json) {

        let fileExist = fs.existsSync(fileName);

        fs.writeFileSync(fileName, JSON.stringify(json))

    },
    readFile(fileName){

        const data = fs.readFileSync(fileName,'utf8');

        return data;
    }
};