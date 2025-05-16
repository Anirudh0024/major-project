module.exports=(f)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    }
}