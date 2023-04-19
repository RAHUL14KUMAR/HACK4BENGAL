const express = require("express");
const dishes=require('../schema/dishSchema');
const protect = require("../middlewares/authMiddleware");

const dishrouter=express.Router();

dishrouter.get("/dishes",async(req,res)=>{
    try{
        const dish= await dishes.find({}).populate('comments.author')
        if(dish){
            res.status(200).json({data:dish});
            console.log("we get the find dish");
        }else{
            res.status(400).send("data cant find");
        }
    }catch(error){
        res.status(500).json({message:error.message});
        console.log("we get the error from get dishes");
    }
});

dishrouter.post("/dishes",protect,async(req,res)=>{
    try{
        const dish=await dishes.create(req.body);
        if(dish){
            res.status(200).json({dish});
            console.log('dishes is created',dish);
        }    
    }catch(error){
        res.status(500).json({message:error.message});
        console.log("we get the error from post dishes");
    }
});

dishrouter.put('/dishes',protect,(req,res)=>{
    try{
        res.status(403).send('put operation not supprted on the /dishes')
        console.log("we are in put opertion of dish");
    }catch(error){
        res.status(500).json({message:error.message});
        console.log("we get the error from put dishes");
    }
})
dishrouter.delete('/dishes',protect,async(req,res)=>{
    try{
        const resp=await dishes.delete({})
        if(resp){
            res.status(200).send(resp);
            console.log("we are in delete dishes");
        }
    }catch(error){
        res.status(500).json({message:error.message});
        console.log("we get the error from delete dishes");
    }
})

dishrouter.route('/dishes/:dishid')
.get(async(req,res)=>{
    try{
        const id=req.params.dishid;
        const dish=await dishes.findById(id).populate('comments.author');
        if(dish){
            res.status(200).json({data:dish})
            console.log("we are in get dish id");
        }
    }catch(error){
        res.status(500).json({message:error.message});
        console.log("we get the error from get dishes dishid");
    }

})
.put(protect,async(req,res)=>{
    try{
        const id=req.params.dishid;
        const dish=await dishes.findByIdAndUpdate(id,{$set:req.body},{new:true})
        if(dish){
            res.status(200).json({data:dish});
            console.log("we are in put dish id");
        }
    }catch(error){
        res.status(500).json({error:error.message});
        console.log("get error from put dishid");
    }
})
.post(protect,(req,res)=>{
    res.statusCode=403;
    res.end('post opertion is not supported on /dishes/'+req.params.dishid);
})
.delete(protect,async(req,res)=>{
    try{
        const resp=await dishes.findByIdAndRemove(req.params.dishid);
        if(resp){
            res.statusCode=200;
            res.setHeader('Content-Type','application/json')
            res.json(resp)
            console.log("get error from delete dish id");
        }
    }catch(error){
        res.status(500).json({error:error.message});
        console.log("get error from put dishid");
    }
    
});

dishrouter.route("/dishes/:dishid/comments")
.get(async(req,res)=>{
    try{
        const dish=await dishes.findById(req.params.dishid).populate('comments.author');
        if(dish){
            res.status(200).json(dish.comments);
            console.log("we are in get comments");
        }else{
            res.status(404).json({message:"we cant get the comments"})
        }

    }catch(error){
        res.status(500).json({error:error.message});
        console.log("get error from get dishid comments");
    }
})
.post(protect,async(req,res)=>{
    try{
        const id=req.params.dishid;
        const dish=await dishes.findById(id);
        if(dish){
            req.body.author=req.user._id;
            dish.comments.push(req.body);
            const dishy=dish.save()
            if(dishy){
                const dishe=await dishes.findById(id).populate('comments.author')
                if(dishe){
                    res.status(200).json({data:dishe});
                }
            }
        }else{
            res.status(403).json({message:"dish not exists"});
        }

    }catch(error){
        console.log(error)
        res.status(500).json({error:error.message});
        console.log("get error from post dishid comments");
    }
})

dishrouter.route("/dishes/:dishid/comments/:commentid")
.get(async(req,res)=>{
    try{
        const id=req.params.dishid;
        const dish=await dishes.findById(id);
        if(dish){
            if(dish.comments.id(req.params.commentid) !=null){
                res.status(200).json(dish.comments.id(req.params.commentid));
            }
        }
        else{
            res.status(400).json("dishes not found");
        }
    }catch(error){
        res.status(500).json({error:error.message});
        console.log("we get the error from commment id");
    }
    
})
.post(protect,(req,res)=>{
    res.statusCode=403;
    res.end('post opertion is not supporetd on /dishes/'+req.params.dishid+'/comments/'+req.params.commentid)
})
.put(protect,async(req,res)=>{
    try{
        const id=req.params.dishid;
        const dish=await dishes.findById(id);
        console.log(dish);
        if(dish){
            // const ids=req.params.commentid;
            if(dish.comments.id(req.params.commentid)!=null){
                if(req.body.rating){
                    dish.comments.id(req.params.commentid).rating=req.body.rating;
                }
                if(req.body.comment){
                    dish.comments.id(req.params.commentid).comment=req.body.comment;
                }
            }
            const dish=await dish.save();
            if(dish){
                const dis=await dishes.findById(id).populate('comments.author');
                if(dis){
                    res.status(200).json(dis);
                }
            }
        }else{
            res.status(400).send("we can't find the dish");
        }

    }catch(error){
        res.status(500).json({error:error.message});
    }
})
module.exports = dishrouter;
