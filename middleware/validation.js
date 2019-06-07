// Validation Schema
// Accepts an array of objects
// Each object has a schema
// Example validationSchema Array Item:
// {
//     name: String,
//     required: Boolean,
//     type: String (param || query || body),
//     default: Boolean || String || Number,
//     dataType: Boolean || String || Number | UUID,
//     table: String,
//     unique: Boolean
// }

//Curry the Validation Schema to the actual custom middleware function
const validateUserInput = (validationSchema) => {

    //Returns Express middleware
    return (req, res, next) => {

        //If the proper validationSchema type was not submitted to the middleware
        if (typeof validationSchema !== 'array') {
            //Then the backend is misconfigured
            res.status(500).send({
                message: 'Internal Server Error'
            });
        }

        //Else a Validation Schema was sent to the middleware
        else {

            //Boolean toggles off if input is invalid
            let valid = true;

            //For each schema entry
            for (let i = 0; i < validationSchema.length && valid; i++) {

                const validationObject = validationSchema[i];

                //Some query/params/body properties are optional
                //If the property required and missing then thrown an error
                if (req[validationObject[type]][[validationObject][name]] === undefined && validationSchema[i].required) {
                    res.status(422).send({
                        message: `${[validationObject][name]} is required`
                    });
                    valid = false;
                }
                //If the property exists on the query/params/body
                //Then validate its value
                else if(req[validationObject[type]][[validationObject][name]] !== undefined) {

                }
            }
        }
    };
}

module.exports = validateUserInput;