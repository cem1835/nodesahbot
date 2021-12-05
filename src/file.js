import * as fs from "fs"

export const fileOperations = {

    writeToFile(fileName, json) {

        fs.writeFileSync(fileName, JSON.stringify(json))

    },
    readFile(fileName){

        let fileExist = fs.existsSync(fileName);

        if(fileExist){
            const data = fs.readFileSync(fileName,'utf8');

            return JSON.parse(data);
        }

        return [];
    }
};