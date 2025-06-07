// backend/models/Candidature.js
// Importa Mongoose per la definizione dello schema e del modello.
import mongoose from "mongoose";

// Definisce lo schema per il modello Candidature.
// Questo schema rappresenta una candidatura inviata da un utente per un annuncio di lavoro.
const candidatureSchema = new mongoose.Schema({
    // postAnnunci: Riferimento all'annuncio di lavoro per il quale è stata inviata la candidatura.
    // È un ObjectId che fa riferimento a un documento nel modello 'PostAnnunci'. Campo obbligatorio.
    postAnnunci : {
        type: mongoose.Schema.Types.ObjectId, // Tipo ObjectId di MongoDB
        ref: "PostAnnunci",                   // Riferimento al modello 'PostAnnunci'
        required: true                        // Campo obbligatorio
    },
    // applierId: Riferimento all'utente (candidato) che ha inviato la candidatura.
    // È un ObjectId che fa riferimento a un documento nel modello 'User'. Campo obbligatorio.
    applierId: {
        type: mongoose.Schema.Types.ObjectId, // Tipo ObjectId di MongoDB
        ref: 'User',                          // Riferimento al modello 'User'
        required: true                        // Campo obbligatorio
    },
    // emailCandidato: Email del candidato.
    // Mantenuto per retrocompatibilità o per query dirette senza 'populate',
    // ma l'identificazione primaria dell'utente avviene tramite 'applierId'.
    emailCandidato: {
        type: String,
        required: true
    },
    // descrizioneCandidato: Testo della candidatura o messaggio di presentazione inviato dal candidato.
    // È una stringa ed è obbligatoria.
    descrizioneCandidato : {
        type : String, 
        required : true
    },
    // dataCandidatura: Data in cui è stata inviata la candidatura.
    // È di tipo Date e ha un valore predefinito che corrisponde al momento della creazione del documento.
    dataCandidatura: {
        type: Date,
        default: Date.now // Valore predefinito: data e ora correnti
    }
    // Commento per possibile aggiunta futura:
    // Aggiungere statoCandidatura (es. 'Inviata', 'In Revisione', 'Accettata', 'Rifiutata') in futuro
 });
 
 // Crea il modello 'Candidature' basato sullo schema candidatureSchema.
 // "Candidature" sarà il nome della collezione nel database.
 const Candidature = mongoose.model("Candidature", candidatureSchema);
 // Esporta il modello Candidature per renderlo disponibile per l'uso in altre parti dell'applicazione.
 export default Candidature;