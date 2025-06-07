// Importa Express per la creazione del router.
import express from 'express';
// Importa le funzioni controller per la gestione degli annunci di lavoro.
import {
    pubblicaLavoro,          // Controller per pubblicare un nuovo annuncio.
    riceviLavoro,            // Controller per ricevere tutti gli annunci.
    riceviLavoroDaId,        // Controller per ricevere un annuncio specifico tramite ID.
    rimuoviLavoroDaId,       // Controller per rimuovere un annuncio tramite ID.
    riceviLavoroDaAzienda    // Controller per ricevere gli annunci pubblicati da un'azienda specifica.
} from '../controllers/postAnnunciController.js';
// Importa i middleware di autenticazione e autorizzazione.
import { ensureAuthenticated, ensureAuthorized } from '../middleware/authMiddleware.js';

// Crea un nuovo router Express.
const router = express.Router();

// Definizione delle rotte per gli annunci di lavoro:

// Rotta POST per creare un nuovo annuncio di lavoro.
// - ensureAuthenticated: Richiede che l'utente sia autenticato.
// - ensureAuthorized(['azienda']): Richiede che l'utente autenticato sia di tipo 'azienda'.
// - pubblicaLavoro: Funzione controller che gestisce la logica di creazione dell'annuncio.
router.post('/', ensureAuthenticated, ensureAuthorized(['azienda']), pubblicaLavoro);

// Rotta GET per ricevere gli annunci pubblicati dall'azienda autenticata.
// - ensureAuthenticated: Richiede che l'utente sia autenticato.
// - ensureAuthorized(['azienda']): Richiede che l'utente autenticato sia di tipo 'azienda'.
// - riceviLavoroDaAzienda: Funzione controller che recupera gli annunci specifici dell'azienda.
// Nota: Questa rotta è definita prima di rotte più generiche come '/' e '/:id' per evitare conflitti di matching.
router.get('/miei-annunci', ensureAuthenticated, ensureAuthorized(['azienda']), riceviLavoroDaAzienda);

// Rotta GET per ricevere tutti gli annunci di lavoro.
// Questa rotta è pubblica e non richiede autenticazione.
// - riceviLavoro: Funzione controller che recupera tutti gli annunci.
router.get('/', riceviLavoro);

// Rotta GET per ricevere un annuncio di lavoro specifico tramite il suo ID.
// L'ID viene passato come parametro nella URL (es. /api/postAnnunci/12345).
// Questa rotta è pubblica.
// - riceviLavoroDaId: Funzione controller che recupera l'annuncio specificato.
router.get('/:id', riceviLavoroDaId);

// Rotta DELETE per rimuovere un annuncio di lavoro specifico tramite ID.
// - ensureAuthenticated: Richiede che l'utente sia autenticato.
// - ensureAuthorized(['azienda']): Richiede che l'utente sia di tipo 'azienda'.
//   L'ulteriore logica di autorizzazione (verificare se l'azienda è la creatrice dell'annuncio)
//   è gestita all'interno del controller 'rimuoviLavoroDaId'.
// - rimuoviLavoroDaId: Funzione controller che gestisce la logica di rimozione.
router.delete('/:id', ensureAuthenticated, ensureAuthorized(['azienda']), rimuoviLavoroDaId);

// Esporta il router per poterlo montare nell'applicazione principale (server.js).
export default router;