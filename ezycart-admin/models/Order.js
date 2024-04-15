import {Schema, model, models} from 'mongoose';

const OrderSchema = new Schema({
    order_items: Object,
    name: String,
    email: String,
    pincode: String,
    address: String,
    country: String,
    paid: Boolean,
    order_id: String,
},{
    timestamps:true,
});


export const Order = models?.Order || model('Order',OrderSchema);
