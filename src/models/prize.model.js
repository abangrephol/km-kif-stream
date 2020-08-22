const mongoose = require('mongoose');

const PrizeSchema = new mongoose.Schema({
    perusahaan: {
        type: String,
        required: true
    },
    kategori: {
        type: String,
        required: true
    },
    nama: {
        type: String,
        required: true
    },
    nik: {
        type: String,
        required: true
    },
    winPrize: {
        type: Boolean,
        default: false
    },
});

const PrizeModel = mongoose.model('Prize', PrizeSchema);

module.exports = PrizeModel;