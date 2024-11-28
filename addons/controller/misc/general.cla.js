class General {

    // default response
    static initial_response (type='invalid_request'){
        let message = (type === 'invalid_input') ? "invalid inputs" : "invalid request"
        let data = {
            status : false,
            message,
            message_detail : "",
            responseData : {},
            errorData : {},
        }

        return data;
    }

    static log(cont, data, type){
        console.log(cont, type, data);
    }
    
    //check if object is empty
    static isEmptyObject (obj){
        return Object.keys(obj).length < 1;
    }

    //check if array is empty
    static isEmptyArray (array){
        return Array.isArray(array) && array.length === 0;
    }

    //check if it object
    static isObject(value){
        return (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
        );
    }
    

    //check if key is in object
    static isKeyInObject (key, object){
        return object.hasOwnProperty(key);
    }

    //check if var is empty
    static isEmptyString (variable){
        return typeof variable === "string" && variable.trim().length === 0;  
    }

    //check if key is in object
    static inArray (value, array){
        return array.includes(value)
    }

    //check for invalid data
    static isValidData (data){
        if(data == 'undefined' || data == undefined || data === null || data === '' || data === false){
            return false;
        }
        return data;
    }

    //check if it is number
    static isNumber(value) {
        return Number.isFinite(value);
    }

    //check if object is empty
    static ucFirst (data){
        return data.charAt(0).toUpperCase() + data.slice(1);
    }
}

module.exports = General;