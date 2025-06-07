// backend/models/PostAnnunci.js
// Importa Mongoose per la definizione dello schema e del modello.
import mongoose from "mongoose";

// Definisce lo schema per il modello PostAnnunci.
// Questo schema rappresenta la struttura di un annuncio di lavoro nel database.
const postAnnunciSchema = new mongoose.Schema({
    // titolo: Titolo dell'annuncio di lavoro. È una stringa ed è obbligatorio.
    titolo: {
        type: String,       // Tipo di dato
        required: true      // Campo obbligatorio
    },
    // azienda: Nome dell'azienda che pubblica l'annuncio. Stringa obbligatoria.
    // Nota: come suggerito nel commento, questo campo potrebbe diventare ridondante se si decide
    // di utilizzare il campo `displayName` del modello `User` (collegato tramite `createdBy`)
    // per rappresentare l'azienda che ha pubblicato l'annuncio.
    azienda: {
        type: String,
        required: true
    },
    // descrizione: Descrizione dettagliata del lavoro offerto. Stringa obbligatoria.
    descrizione: {
        type: String,
        required: true
    },
    // località: Luogo di lavoro. Stringa obbligatoria.
    località:{
        type: String,
        required: true
    },
    // dataPubblicazione: Data in cui l'annuncio è stato pubblicato.
    // È di tipo Date e ha un valore predefinito che corrisponde al momento della creazione del documento.
    dataPubblicazione: {
        type: Date,
        default: Date.now  // Valore predefinito: data e ora correnti
    },
    // createdBy: ID dell'utente (di tipo 'azienda') che ha creato l'annuncio.
    // È un ObjectId che fa riferimento a un documento nel modello 'User'. Campo obbligatorio.
    // Questo permette di collegare ogni annuncio all'utente che lo ha pubblicato.
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, // Tipo speciale per gli ID di MongoDB
        ref: 'User',                          // Riferimento al modello 'User'
        required: true                        // Campo obbligatorio
    }
});

// Crea il modello 'PostAnnunci' basato sullo schema postAnnunciSchema.
// "PostAnnunci" sarà il nome della collezione nel database (generalmente pluralizzato in "postannuncis" o simile da Mongoose).
const PostAnnunci = mongoose.model("PostAnnunci", postAnnunciSchema);
// Esporta il modello PostAnnunci per renderlo disponibile per l'uso in altre parti dell'applicazione (es. nei controller).
export default PostAnnunci;