
const userDataValidation = {
    firstname:{
        isString:{
            errorMessage:"first name must be a string"
        },
        notEmpty: {
            errorMessage:"firstname cannot be empty"
        },
        isLength:{
            options:{
                min:1,
                max:32
            }
        }
    },
    lastname:{
        isString:{
            errorMessage:"lastname name must be a string"
        },
        notEmpty: {
            errorMessage:"lastname cannot be empty"
        },
        isLength:{
            options:{
                min:2,
                max:32
            }
        }
    },
    username:{
        isString:{
            errorMessage:"lastname name must be a string"
        },
        notEmpty: {
            errorMessage:"lastname cannot be empty"
        },
        isLength:{
            options:{
                min:1,
                max:32
            }
        }
    },
    email:{
        isString:{
            errorMessage:"email name must be a string"
        },
        notEmpty: {
            errorMessage:"email cannot be empty"
        },  
    },
   /** phone:{
        isString:{
            errorMessage:"phonenumber name must be a string"
        },
        notEmpty: {
            errorMessage:"phonenumber cannot be empty"
        }, 
        isLength:{
            options:{
                min:10,
                max:14
            }
        }
    }, */
    password:{
        isString:{
            errorMessage:"password name must be a string"
        },
        notEmpty: {
            errorMessage:"password cannot be empty"
        },
    },
    role:{
        isString:{
            errorMessage:"password name must be a string"
        },
        notEmpty: {
            errorMessage:"password cannot be empty"
        },
    }
 
}

export default userDataValidation
