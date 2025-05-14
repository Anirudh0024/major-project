const  mongoose=require("mongoose");
const Schema=mongoose.Schema;

// const listingSchema=new Schema({
//     tittle:{
//         type:String,
//         required:true
//     },
//     description: String,
//     image:{
//         default:"https://images.unsplash.com/photo-1743623930275-abbb3ad3be0b?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Ddefault link",
//         type:String,
//         set:(v)=> v===" " ?"https://images.unsplash.com/photo-1743623930275-abbb3ad3be0b?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Ddefault link": v,
//     },
//     price:Number,
//     location:String,
//     country:String
// })
const listingSchema = new Schema({
  tittle: {
    type: String,
    required: true
  },
  description: String,
  image: {
    filename: {
      type: String,
      default: 'default-image'
    },
    url: {
      type: String,
      default: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
  },
  price: Number,
  location: String,
  country: String
});

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;