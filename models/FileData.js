import { Schema, model} from "mongoose";


const fileSchema = new Schema({
  "Order ID" : { type:String, unique: true},
  "Product ID" : { type:String, unique: true},
  "Customer ID" : { type:String, unique: true},
  "Product Name" : { type:String},
  "Category": { type:String},
  "Region": { type:String},
  "Date of Sale" : { type:String},
  "Quantity Sold" : { type: Number},
  "Unit Price" : { type:String},
  "Discount": { type:String},
  "Shipping Cost" : { type:String},
  "Payment Method" : { type:String},
  "Customer Name" : { type:String},
  "Customer Email" : { type:String},
  "Customer Address" : { type:String},
});

fileSchema.index({"Order ID" : 1})

const FileData = model("FileData", fileSchema)
export default FileData;
