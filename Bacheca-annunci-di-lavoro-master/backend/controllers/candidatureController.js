// Importa il modello Candidature per interagire con la collezione delle candidature.
import Candidature from "../models/Candidature.js";
// Importa il modello PostAnnunci per verificare l'esistenza dell'annuncio a cui ci si candida.
import PostAnnunci from "../models/PostAnnunci.js";

// Controller per la creazione di una nuova candidatura.
// Funzione asincrona per gestire le richieste POST.
export const creazioneCandidature = async (req , res) => {
    try{
      // Estrae l'ID dell'annuncio (postAnnunciId) e la descrizione della candidatura dal corpo della richiesta.
      // L'email del candidato non viene più presa dal body, ma dall'utente autenticato (req.user).
      const { postAnnunciId, descrizioneCandidato } = req.body;
      // Ottiene i dati dell'utente 'applier' (candidato) autenticato, forniti da Passport.
      const applier = req.user;

      // Validazione: controlla se l'ID dell'annuncio e la descrizione della candidatura sono stati forniti.
      if (!postAnnunciId || !descrizioneCandidato) {
        return res.status(400).json({ message: 'ID annuncio e descrizione sono obbligatori.' });
      }

      // Verifica se l'annuncio di lavoro a cui ci si candida esiste effettivamente.
      const esistenzaDelLavoro = await PostAnnunci.findById(postAnnunciId);
      if (!esistenzaDelLavoro){
       // Se l'annuncio non esiste, restituisce un errore 404 (Not Found).
       return res.status(404).json({ message: "Lavoro non trovato"});
      }

      // Controlla se l'utente (applier.id) si è già candidato per questo specifico annuncio (postAnnunciId).
      const existingApplication = await Candidature.findOne({ postAnnunci: postAnnunciId, applierId: applier.id });
      if (existingApplication) {
        // Se esiste già una candidatura, restituisce un errore 409 (Conflict).
        return res.status(409).json({ message: 'Ti sei già candidato a questo annuncio.' });
      }

      // Crea una nuova istanza del modello Candidature con i dati forniti.
      const nuoveCandidature = new Candidature({
        postAnnunci : postAnnunciId,         // ID dell'annuncio.
        applierId: applier.id,             // ID dell'utente che si candida.
        emailCandidato: applier.email,     // Email dell'utente (per comodità o query dirette).
        descrizioneCandidato               // Descrizione/messaggio della candidatura.
      });
      // Salva la nuova candidatura nel database.
      const candidaturaSalvata = await nuoveCandidature.save();
      // Dopo il salvataggio, popola i riferimenti per arricchire la risposta.
      // 'postAnnunci' viene popolato con titolo e azienda dell'annuncio.
      // 'applierId' viene popolato con displayName e email del candidato.
      const populatedCandidatura = await Candidature.findById(candidaturaSalvata._id)
                                                  .populate('postAnnunci', 'titolo azienda')
                                                  .populate('applierId', 'displayName email');
      // Restituisce la candidatura salvata e popolata con uno stato 201 (Created).
      res.status(201).json(populatedCandidatura);
    } catch(e){
        // In caso di errore durante il processo, restituisce un errore 500 (Internal Server Error).
        res.status(500).json({ message: "Errore nella creazione della candidatura" , error: e.message});
    }
};

// Controller per visualizzare tutte le candidature inviate da un utente (applier) specifico.
export const visualizzazioneCandidatureFatte = async (req, res) => {
  try{
    // Ottiene l'utente 'applier' autenticato da req.user.
    const applier = req.user;
    // Cerca nel database tutte le candidature dove 'applierId' corrisponde all'ID dell'utente autenticato.
    const candidature = await Candidature.find({ applierId : applier.id })
                                        // Popola i dettagli dell'annuncio associato ('postAnnunci')
                                        // includendo titolo, azienda, località e data di pubblicazione.
                                        .populate("postAnnunci", "titolo azienda località dataPubblicazione")
                                        // Seleziona i campi specifici da restituire per ogni candidatura.
                                        .select("postAnnunci dataCandidatura descrizioneCandidato")
                                        // Ordina le candidature per data in ordine decrescente (le più recenti prima).
                                        .sort({ dataCandidatura: -1 });
    // Se l'array di candidature è vuoto (l'utente non ha inviato candidature),
    // restituisce comunque uno stato 200 (OK) con un array vuoto, il che è corretto.
    res.json(candidature);
  } catch(e) {
    // In caso di errore, restituisce un errore 500.
    res.status(500).json({message: "Errore nella visualizzazione delle tue candidature" , error: e.message});
  }
};

// Controller per visualizzare tutte le candidature per un annuncio di lavoro specifico.
// Questa funzione è tipicamente usata da un utente 'azienda'.
export const visualizzaCandidaturePerAnnuncio = async (req, res) => {
  try {
    // Estrae l'ID dell'annuncio (postAnnunciId) dai parametri della URL.
    const { postAnnunciId } = req.params;
    // Trova l'annuncio nel database usando l'ID.
    const annuncio = await PostAnnunci.findById(postAnnunciId);

    // Se l'annuncio non viene trovato.
    if (!annuncio) {
      return res.status(404).json({ message: "Annuncio non trovato" });
    }

    // Controllo di autorizzazione: verifica che l'utente autenticato (req.user.id)
    // sia lo stesso che ha creato l'annuncio (annuncio.createdBy).
    if (annuncio.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Non sei autorizzato a visualizzare i candidati per questo annuncio." });
    }

    // Trova tutte le candidature associate a questo annuncio (postAnnunciId).
    // Popola il campo 'applierId' con 'displayName' e 'email' del candidato.
    // Ordina le candidature per data in ordine decrescente.
    const candidature = await Candidature.find({ postAnnunci: postAnnunciId })
                                        .populate('applierId', 'displayName email')
                                        .sort({ dataCandidatura: -1 });
    // Restituisce un oggetto contenente i dettagli dell'annuncio e l'array delle candidature.
    // L'array 'candidature' sarà vuoto se non ci sono candidature, il che è gestito correttamente dal frontend.
    return res.json({
      annuncio: {
        _id: annuncio._id,
        titolo: annuncio.titolo,
        azienda: annuncio.azienda,
        descrizione: annuncio.descrizione,
      },
      candidature,
    });
  } catch (error) {
    // In caso di errore, restituisce un errore 500.
    return res.status(500).json({
      message: "Errore nella visualizzazione delle candidature per l'annuncio",
      error: error.message
    });
  }
};
