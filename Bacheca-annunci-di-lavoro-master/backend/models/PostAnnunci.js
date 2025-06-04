import mongoose from "mongoose";

const postAnnunciSchema = new mongoose.Schema({
    titolo: {
        type: String,
        required: true
    },
    azienda: {
        type: String,
        required: true
    },
    descrizione: {
        type: String,
        required: true
    },
    località:{
        type: String,
        required: true
    },
    dataPubblicazione: {
        type: Date,
        default: Date.now
    }
});


const PostAnnunci = mongoose.model("PostAnnunci", postAnnunciSchema);
export default PostAnnunci;