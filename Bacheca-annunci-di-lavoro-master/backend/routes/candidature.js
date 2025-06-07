// Importa Express per la creazione del router.
import express from 'express';
// Importa le funzioni controller per la gestione delle candidature.
import {
    creazioneCandidature,             // Controller per la creazione di una nuova candidatura.
    visualizzazioneCandidatureFatte,  // Controller per visualizzare le candidature inviate da un utente.
    visualizzaCandidaturePerAnnuncio  // Controller per visualizzare le candidature ricevute per un annuncio specifico.
} from "../controllers/candidatureController.js" ;
// Importa i middleware di autenticazione e autorizzazione.
import { ensureAuthenticated, ensureAuthorized } from '../middleware/authMiddleware.js';

// Crea un nuovo router Express.
const router = express.Router();

// Definizione delle rotte per le candidature:

// Rotta POST per creare una nuova candidatura.
// - ensureAuthenticated: Richiede che l'utente sia autenticato.
// - ensureAuthorized(['applier']): Richiede che l'utente autenticato sia di tipo 'applier' (candidato).
// - creazioneCandidature: Funzione controller che gestisce la logica di creazione della candidatura.
// Nota: Ulteriori logiche, come l'associazione dell'ID utente alla candidatura, sono gestite nel controller.
router.post("/" , ensureAuthenticated, ensureAuthorized(['applier']), creazioneCandidature);

// Rotta GET per visualizzare le candidature inviate dall'utente (applier) autenticato.
// - ensureAuthenticated: Richiede che l'utente sia autenticato.
// - ensureAuthorized(['applier']): Richiede che l'utente autenticato sia di tipo 'applier'.
// - visualizzazioneCandidatureFatte: Funzione controller che recupera le candidature dell'utente.
// La rotta è stata modificata da "/lavoratore/:email" a "/mie-candidature" per riflettere
// che l'identificazione dell'utente avviene tramite la sessione (req.user) e non un parametro URL.
router.get("/mie-candidature" , ensureAuthenticated, ensureAuthorized(['applier']), visualizzazioneCandidatureFatte);

// Rotta GET per visualizzare tutte le candidature ricevute per un annuncio di lavoro specifico.
// L'ID dell'annuncio (postAnnunciId) è passato come parametro nella URL.
// - ensureAuthenticated: Richiede che l'utente sia autenticato.
// - ensureAuthorized(['azienda']): Richiede che l'utente autenticato sia di tipo 'azienda'.
//   Ulteriori verifiche (es. se l'azienda è la proprietaria dell'annuncio) sono nel controller.
// - visualizzaCandidaturePerAnnuncio: Funzione controller che recupera le candidature per l'annuncio.
router.get("/annuncio/:postAnnunciId", ensureAuthenticated, ensureAuthorized(['azienda']), visualizzaCandidaturePerAnnuncio);

// Esporta il router per poterlo montare nell'applicazione principale (server.js).
export default router;