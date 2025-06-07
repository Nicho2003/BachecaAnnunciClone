// Importa il modello PostAnnunci per interagire con la collezione degli annunci nel database.
import PostAnnunci from "../models/PostAnnunci.js";

// Controller per pubblicare un nuovo annuncio di lavoro.
// Questa funzione asincrona gestisce le richieste POST per creare annunci.
export const pubblicaLavoro = async (req, res) =>{
  try {
    // Estrae i dati dell'annuncio (titolo, azienda, descrizione, località) dal corpo della richiesta (req.body).
    const {titolo, azienda, descrizione, località} = req.body;
    // Recupera l'ID dell'utente autenticato da req.user.id.
    // req.user è popolato da Passport dopo un'autenticazione andata a buon fine.
    const userId = req.user.id;
    // Commento: Si potrebbe considerare di usare req.user.displayName come nome dell'azienda,
    // se l'utente che pubblica è l'azienda stessa e il suo displayName corrisponde al nome aziendale.

    // Validazione: controlla se tutti i campi necessari sono stati forniti.
    if (!titolo || !azienda || !descrizione || !località) {
        // Se manca qualche campo, restituisce un errore 400 (Bad Request).
        return res.status(400).json({ message: 'Tutti i campi (titolo, azienda, descrizione, località) sono obbligatori.' });
    }

    // Crea una nuova istanza del modello PostAnnunci con i dati ricevuti e l'ID dell'utente creatore.
    const newPostAnnunci = new PostAnnunci({
        titolo,
        azienda, // Nota: Valutare se il campo 'azienda' nel modello è ancora necessario
                 // se si può derivare dal profilo dell'utente (req.user).
        descrizione,
        località,
        createdBy: userId // Associa l'annuncio all'utente che lo sta creando.
    });
    // Salva il nuovo annuncio nel database.
    const annunciSalvati = await newPostAnnunci.save();
    // Dopo il salvataggio, popola il campo 'createdBy' con 'displayName' e 'email' dell'utente.
    // Questo arricchisce la risposta con dettagli utili sull'autore dell'annuncio.
    // .populate() è un metodo di Mongoose per sostituire i riferimenti ID con i documenti effettivi.
    const annuncioCompleto = await PostAnnunci.findById(annunciSalvati._id).populate('createdBy', 'displayName email');
    // Restituisce l'annuncio salvato e popolato con uno stato 201 (Created).
    res.status(201).json(annuncioCompleto);
  } catch (error){
    // In caso di errore durante il processo (es. errore del database), restituisce un errore 500 (Internal Server Error).
    res.status(500).json({message: 'Errore nella pubblicazione di un post di lavoro', error: error.message});
  }
};

// Controller per ricevere tutti gli annunci di lavoro.
// Questa funzione asincrona gestisce le richieste GET per recuperare tutti gli annunci.
export const riceviLavoro = async(req, res) => {try {
    // Trova tutti i documenti nella collezione PostAnnunci.
    // Popola il campo 'createdBy' per includere 'displayName' e 'email' dell'utente che ha pubblicato l'annuncio.
    // Ordina gli annunci per data di pubblicazione in ordine decrescente (i più recenti prima).
    const ricezioneAllLavori = await PostAnnunci.find().populate('createdBy', 'displayName email').sort({ dataPubblicazione: -1 });
    // Se non vengono trovati annunci.
    if (ricezioneAllLavori.length === 0) {
        // Restituisce uno stato 404 (Not Found) con un messaggio appropriato.
        return res.status(404).json({message: 'Nessun annuncio di lavoro trovato'});
    }
    // Se vengono trovati annunci, li restituisce in formato JSON.
    res.json(ricezioneAllLavori);
    
} catch(error){
    // In caso di errore, restituisce un errore 500.
    res.status(500).json({message:'Errore nella ricezione annunci di lavoro', error: error.message});
}};

// Controller per ricevere un singolo annuncio di lavoro tramite il suo ID.
// L'ID dell'annuncio è passato come parametro nella URL (req.params.id).
export const riceviLavoroDaId = async(req,res)=>{ try {
    // Trova l'annuncio nel database usando l'ID fornito.
    // Popola anche qui il campo 'createdBy'.
    const ricezioneAnnuncio = await PostAnnunci.findById(req.params.id).populate('createdBy', 'displayName email');
    // Se l'annuncio non viene trovato.
    if (!ricezioneAnnuncio){
        // Restituisce uno stato 404.
        return res.status(404).json({message:'Annuncio di lavoro non trovato'});
    }
    // Se trovato, restituisce l'annuncio in formato JSON.
    res.json(ricezioneAnnuncio);
} catch(error){
    // In caso di errore (es. ID malformato o errore del database), restituisce un errore 500.
    res.status(500).json({message:'Errore nella ricezione annuncio di lavoro', error: error.message});
}};

// Controller per rimuovere un annuncio di lavoro tramite il suo ID.
export const rimuoviLavoroDaId = async(req, res) => {
    try{
        // Trova l'annuncio da eliminare usando l'ID fornito.
        const annuncio = await PostAnnunci.findById(req.params.id);
        // Se l'annuncio non viene trovato.
        if (!annuncio) {
            return res.status(404).json({message:'Annuncio non trovato'});
        }
        // Controllo di autorizzazione: verifica che l'utente che richiede la cancellazione
        // sia lo stesso che ha creato l'annuncio. req.user.id è l'ID dell'utente autenticato.
        // annuncio.createdBy contiene l'ID del creatore dell'annuncio.
        // È necessario convertirli in stringa per un confronto affidabile.
        if (annuncio.createdBy.toString() !== req.user.id) {
            // Se l'utente non è autorizzato, restituisce un errore 403 (Forbidden).
            return res.status(403).json({message: 'Non sei autorizzato a eliminare questo annuncio.'});
        }
        // Se l'utente è autorizzato, elimina l'annuncio.
        const annunciEliminati = await PostAnnunci.findByIdAndDelete(req.params.id);
        // Commento: Il controllo successivo '!annunciEliminati' è ridondante se 'annuncio' è già stato trovato.
        // Se findByIdAndDelete non trovasse nulla (già gestito dal primo if), restituirebbe null.
        // Restituisce un messaggio di successo e l'ID dell'annuncio eliminato.
        res.json({message: 'Annuncio eliminato con successo', id: annunciEliminati._id });
    } catch(error){
        // In caso di errore, restituisce un errore 500.
        res.status(500).json({message:'Errore nella rimozione del lavoro', error: error.message });
    }
};

// Controller per ricevere tutti gli annunci di lavoro pubblicati da un'azienda specifica (l'utente autenticato).
export const riceviLavoroDaAzienda = async (req, res) => {
  try {
    // Ottiene l'ID dell'utente (azienda) autenticato dalla richiesta (req.user.id).
    const userId = req.user.id;
    // Cerca tutti gli annunci nel database dove il campo 'createdBy' corrisponde all'ID dell'utente.
    // Popola i dettagli del creatore (opzionale, ma può essere utile per conferma).
    // Ordina gli annunci per data di pubblicazione decrescente.
    const annunciAzienda = await PostAnnunci.find({ createdBy: userId })
                                          .populate('createdBy', 'displayName email')
                                          .sort({ dataPubblicazione: -1 });

    // Se non vengono trovati annunci per l'azienda o l'array è vuoto.
    if (!annunciAzienda || annunciAzienda.length === 0) {
      // Restituisce uno stato 404 con un messaggio specifico.
      return res.status(404).json({ message: 'Nessun annuncio trovato per la tua azienda.' });
    }
    // Se trovati, restituisce gli annunci dell'azienda in formato JSON.
    res.json(annunciAzienda);
  } catch (error) {
    // In caso di errore, restituisce un errore 500.
    res.status(500).json({ message: 'Errore nella ricezione degli annunci della tua azienda', error: error.message });
  }
};
