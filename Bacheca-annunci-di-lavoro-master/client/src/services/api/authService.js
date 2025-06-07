// src/services/api/authService.js

// Importa l'istanza apiClient di Axios configurata centralmente.
// apiClient contiene l'URL base del backend e altre configurazioni predefinite (es. interceptor).
import apiClient from './apiClient';

// Funzione asincrona per la registrazione di un nuovo utente locale (email/password).
// Prende come argomenti: displayName (nome visualizzato), email, password, e userType (tipo di utente).
export const registerLocal = async (displayName, email, password, userType) => {
  // Effettua una richiesta POST all'endpoint '/auth/register' del backend.
  // Il corpo della richiesta contiene i dati dell'utente da registrare.
  // Restituisce la Promise restituita da apiClient.post, che risolverà con la risposta del server
  // o rigetterà con un errore.
  return apiClient.post('/auth/register', { displayName, email, password, userType });
};

// Funzione asincrona per il login di un utente locale (email/password).
// Prende come argomenti: email e password.
export const loginLocal = async (email, password) => {
  // Effettua una richiesta POST all'endpoint '/auth/login' del backend.
  // Il corpo della richiesta contiene le credenziali di login.
  return apiClient.post('/auth/login', { email, password });
};

// Funzione asincrona per il logout dell'utente.
export const logout = async () => {
  // Effettua una richiesta POST all'endpoint '/auth/logout' del backend.
  // Questa richiesta tipicamente invalida la sessione utente sul server.
  return apiClient.post('/auth/logout');
};

// Funzione per reindirizzare l'utente al flusso di autenticazione Google OAuth.
// Questa funzione non è asincrona perché esegue un reindirizzamento del browser.
export const redirectToGoogleOAuth = () => {
  // Costruisce l'URL completo per l'endpoint di autenticazione Google sul backend.
  // Utilizza apiClient.defaults.baseURL per ottenere l'URL base dell'API, garantendo coerenza.
  const googleLoginUrl = `${apiClient.defaults.baseURL}/auth/google`;
  // Reindirizza il browser dell'utente a questo URL. Il backend poi gestirà il reindirizzamento a Google.
  window.location.href = googleLoginUrl;
};

// Funzione asincrona per ottenere i dati dell'utente attualmente autenticato.
// Utile per verificare lo stato della sessione all'avvio dell'app o dopo un reindirizzamento OAuth.
export const getCurrentUser = async () => {
  // Effettua una richiesta GET all'endpoint '/auth/me' del backend.
  // Questo endpoint dovrebbe restituire i dati dell'utente se la sessione è valida, o un errore (es. 401) altrimenti.
  return apiClient.get('/auth/me');
};

// Esporta tutte le funzioni definite in questo modulo in modo che possano essere importate
// e utilizzate in altre parti dell'applicazione (es. nel AuthContext o nei componenti pagina).
export {
  registerLocal,
  loginLocal,
  logout,
  redirectToGoogleOAuth,
  getCurrentUser,
};
