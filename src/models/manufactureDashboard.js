const mongoose = require("mongoose");

const manufactureDashboardSchema = new mongoose.Schema({
    manufacturerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Manufacturer",
        required: true,
    },
    totalProducts: {
        type: Number,
        default: 0,
    },
    totalOrders: {
        type: Number,
        default: 0,
    },
    totalShipments: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ManufactureDashboard = mongoose.model("ManufactureDashboard", manufactureDashboardSchema);

module.exports = ManufactureDashboard;
