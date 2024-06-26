const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const commentSchema=new Schema({
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users'
    }

},{
        timestamps:true
});

var dishSchema=new Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    comments:[commentSchema]
},{
        timestamps:true
});
var dishes=mongoose.model('dish',dishSchema);
module.exports=dishes;