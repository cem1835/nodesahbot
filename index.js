import {cars} from "./src/cars.js";
import {filters} from "./src/filters.js";
import {fileOperations} from "./src/file.js";
import {utilities} from "./src/utilities.js";

let main = {

    async init() {

        for (const arg of process.argv){

            if(arg.startsWith("car=")){

                const model= arg.substr(4);

                console.log("starting car: " + model );

                const result = await cars.getByFilters(filters[`get${model}filter`]());

                console.log(`found ${result.length} ${model}`);

                const fileName=`db/cars/${utilities.getCurrentDateForFileFormat()}${model}.json`;
                fileOperations.writeToFile(fileName,result);

                console.log(`writed ${result.length} ${model}`);
            }
        }

    }
};
main.init();
