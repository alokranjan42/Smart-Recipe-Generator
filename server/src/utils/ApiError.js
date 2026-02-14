class ApiError extends Error{
    constructor(
        statusCode,
        message="something went worng",
        data=null,
        errors=[],
        stack
    ){
        super(message)
        this.statusCode=statusCode
        this.message=message
        this.data=data
        this.errors=errors
        if(stack){
            Error.captureStackTrace(this,this.constructor)
        }
        

    }
}

export {ApiError}