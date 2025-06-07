// src/services/api/applicationService.js

// Importa l'istanza apiClient di Axios, configurata per le chiamate API al backend.
import apiClient from './apiClient';

// Funzione asincrona per ottenere i candidati (applicazioni) per un specifico annuncio di lavoro.
// Prende 'jobId' (l'ID dell'annuncio) come argomento.
// Questa funzione è tipicamente utilizzata da un utente 'azienda' per visualizzare chi si è candidato ai propri annunci.
export const getApplicantsForJob = async (jobId) => {
  // Effettua una richiesta GET all'endpoint '/candidature/annuncio/:jobId' del backend.
  // Sostituisce ':jobId' con l'ID effettivo dell'annuncio.
  // L'endpoint backend dovrebbe essere protetto e verificare che l'utente richiedente sia autorizzato
  // a visualizzare le candidature per quell'annuncio (es. è il creatore dell'annuncio).
  return apiClient.get(`/candidature/annuncio/${jobId}`);
};

// Funzione asincrona per un utente 'applier' (candidato) per creare una nuova candidatura.
// Prende 'applicationData' come argomento, un oggetto che contiene i dati della candidatura.
export const createApplication = async (applicationData) => {
  // applicationData DEVE contenere almeno:
  // - postAnnunciId: l'ID dell'annuncio per cui ci si candida.
  // - descrizioneCandidato: il messaggio o la descrizione fornita dal candidato.
  // L'ID e l'email dell'utente 'applier' dovrebbero essere gestiti automaticamente dal backend
  // tramite l'utente autenticato (req.user) grazie al middleware 'ensureAuthenticated'.
  // Effettua una richiesta POST all'endpoint '/candidature' del backend.
  return apiClient.post('/candidature', applicationData);
};

// Funzione asincrona per un utente 'applier' per ottenere la lista delle proprie candidature inviate.
export const getMyApplications = async () => {
  // Effettua una richiesta GET all'endpoint '/candidature/mie-candidature' del backend.
  // Questo endpoint è protetto e dovrebbe restituire solo le candidature inviate dall'utente autenticato.
  return apiClient.get('/candidature/mie-candidature');
};

// Nota: Tutte queste funzioni restituiscono Promises, che verranno gestite (con .then/.catch o async/await)
// nei componenti React o negli hook che le utilizzano per aggiornare lo stato dell'interfaccia utente
// in base alla risposta del server.
