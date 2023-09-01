const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    image: [{ 
        type: String,
        require: true
    }]
})

const Product = mongoose.model('Product', productSchema);
// Export the model 
module.exports = Product;