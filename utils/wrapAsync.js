module.exports=(f)=>{
    return function(req,res,next){
        fn(req,res,next).catch(next);
    }
}