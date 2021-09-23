var mongoose = require('mongoose')
var Schema = mongoose.Schema

var productSchema = new Schema({
    name: String,
    price: Number,
    stock: Number,
    department: [{ type: mongoose.Schema.Types.ObjectId, ref: 'department' }]
}, {versionKey: false})

module.exports = mongoose.model("Product", productSchema)

