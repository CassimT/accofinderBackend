const paymentDataValidation = {
    amount:{
        isString: {
            errorMessage:"Amount must be a string",
        },
        notEmpty:true,
        errorMessage:"Amount cannot be empty",
        isInt:true,
        isLength:{
            options:{
                min:0,
            },
        }
    },
    phone:{
        isString:{
                errorMessage:"phone must be a string"
        },
       isLength:{
        options:{
            min:10,
            max:14
        },
        errorMessage:"Invalide phonnumber Length"
       },
        notEmpty: {
            errorMessage:"Phone cannot be empty"
        },
        
    }

}

export default paymentDataValidation;