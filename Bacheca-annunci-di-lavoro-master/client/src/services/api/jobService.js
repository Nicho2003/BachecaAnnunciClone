// src/services/api/jobService.js

// Importa l'istanza apiClient di Axios, configurata per le chiamate API al backend.
import apiClient from './apiClient';

// Funzione asincrona per creare un nuovo annuncio di lavoro.
// Prende 'jobData' come argomento, un oggetto che dovrebbe contenere i dettagli dell'annuncio.
export const createJob = async (jobData) => {
  // jobData dovrebbe contenere almeno: { titolo, azienda, descrizione, località }
  // Effettua una richiesta POST all'endpoint '/postAnnunci' del backend.
  // Il corpo della richiesta è l'oggetto jobData.
  // Restituisce la Promise della richiesta Axios.
  return apiClient.post('/postAnnunci', jobData);
};

// Funzione asincrona per ottenere tutti gli annunci di lavoro disponibili.
export const getAllJobs = async () => {
  // Effettua una richiesta GET all'endpoint '/postAnnunci' del backend.
  // Questo endpoint dovrebbe restituire un array di tutti gli annunci pubblici.
  return apiClient.get('/postAnnunci');
};

// Funzione asincrona per ottenere un annuncio di lavoro specifico tramite il suo ID.
// Prende 'id' (l'ID dell'annuncio) come argomento.
export const getJobById = async (id) => {
  // Effettua una richiesta GET all'endpoint '/postAnnunci/:id', dove :id è l'ID dell'annuncio.
  // Utilizza i template literal per inserire l'ID nell'URL.
  return apiClient.get(`/postAnnunci/${id}`);
};

// Funzione asincrona per eliminare un annuncio di lavoro specifico tramite ID.
// Questa operazione è tipicamente riservata all'azienda che ha creato l'annuncio.
// Prende 'id' (l'ID dell'annuncio da eliminare) come argomento.
export const deleteJobById = async (id) => {
  // Effettua una richiesta DELETE all'endpoint '/postAnnunci/:id'.
  return apiClient.delete(`/postAnnunci/${id}`);
};

// Commento: Qui potrebbero essere aggiunte altre funzioni relative alla gestione degli annunci,
// come ad esempio:
// - updateJob(id, jobData): per modificare un annuncio esistente.
// - getJobsByCompany(companyId): per ottenere tutti gli annunci di un'azienda specifica (se non già coperto da getCompanyJobs).

// Funzione asincrona per ottenere gli annunci di lavoro pubblicati specificamente dall'azienda autenticata.
export const getCompanyJobs = async () => {
  // Effettua una richiesta GET all'endpoint '/postAnnunci/miei-annunci' del backend.
  // Questo endpoint è protetto e restituirà solo gli annunci creati dall'utente (azienda) autenticato.
  return apiClient.get('/postAnnunci/miei-annunci');
};

// Nota: Le funzioni esportate qui saranno utilizzate dai componenti React (spesso tramite custom hooks o direttamente nelle pagine)
// per interagire con le API relative agli annunci di lavoro.
