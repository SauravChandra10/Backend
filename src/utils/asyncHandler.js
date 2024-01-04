const asyncHandler = (requestHandler) =>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}

export {asyncHandler};

/*
const asyncHandler = ()=>{}
if we want to pass a function func
const asyncHandler = (func) => {()=>{}} or asyncHandler = () => () => {}

try catch implementation: 

const asyncHandler = (fn) => async(req,res,next) =>{
    try{
        await fn(req,res,next)
    } catch(error){
        res.send(err.code || 500).json({
            success:false,
            message:err.message 
        })
    }
}
*/