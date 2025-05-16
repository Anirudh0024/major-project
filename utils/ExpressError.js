class ExpressError extends Error{
    constructor(ststusCode,message){
        super();
        this.ststusCode=ststusCode;
        this.message=message;
    }
}

module.exports=ExpressError;