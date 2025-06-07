// src/services/api/apiClient.js

// Importa la libreria Axios, un client HTTP basato su Promise per il browser e Node.js.
// Viene utilizzata per effettuare richieste API al backend.
import axios from 'axios';

// Recupera l'URL base dell'API (backend) dalle variabili d'ambiente di React.
// Le variabili d'ambiente in React (create con Create React App o Vite) devono iniziare con REACT_APP_ (per CRA) o VITE_ (per Vite).
// Se la variabile d'ambiente non è definita, utilizza un URL di default (es. per lo sviluppo locale).
// NOTA: process.env.REACT_APP_API_BASE_URL è specifico per Create React App.
// Se si usa Vite, la variabile dovrebbe essere import.meta.env.VITE_API_BASE_URL.
// Per coerenza con le istruzioni precedenti, lasciamo process.env, ma è importante notare questa distinzione.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Crea un'istanza personalizzata di Axios con una configurazione di base.
// Questo permette di avere impostazioni predefinite per tutte le chiamate API effettuate tramite questa istanza.
const apiClient = axios.create({
  // baseURL: URL base per tutte le richieste effettuate da questa istanza.
  // Le richieste relative (es. '/users') verranno automaticamente premesse con questo URL.
  baseURL: API_BASE_URL,
  // headers: Oggetto contenente gli header HTTP predefiniti per tutte le richieste.
  headers: {
    // 'Content-Type': 'application/json' indica che il corpo delle richieste (es. POST, PUT) sarà in formato JSON.
    'Content-Type': 'application/json',
  },
  // withCredentials: true // Decommentare questa riga se l'API utilizza cookie di sessione HttpOnly
                           // e si necessita che il browser li invii automaticamente con le richieste cross-origin.
                           // Richiede una configurazione CORS appropriata sul backend (Access-Control-Allow-Credentials).
});

// Interceptor per le richieste (Request Interceptor).
// Gli interceptor permettono di eseguire codice o modificare la configurazione di una richiesta prima che venga inviata.
// È utile, ad esempio, per aggiungere dinamicamente token di autenticazione a tutte le richieste.
apiClient.interceptors.request.use(
  // Funzione eseguita con successo quando la richiesta è pronta per essere inviata.
  (config) => {
    // Esempio di logica per aggiungere un token JWT (JSON Web Token) all'header Authorization.
    // Il token verrebbe tipicamente recuperato da localStorage, sessionStorage o da uno stato globale.
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`; // Aggiunge l'header 'Authorization: Bearer <token>'
    // }
    // Restituisce l'oggetto di configurazione della richiesta (modificato o meno).
    return config;
  },
  // Funzione eseguita se si verifica un errore durante la preparazione della richiesta.
  (error) => {
    // Restituisce una Promise rigettata con l'errore.
    return Promise.reject(error);
  }
);

// Interceptor per le risposte (Response Interceptor).
// Permette di eseguire codice o modificare la risposta (o gestire errori) prima che venga passata al codice che ha effettuato la richiesta.
apiClient.interceptors.response.use(
  // Funzione eseguita con successo quando si riceve una risposta con codice di stato HTTP nell'intervallo 2xx.
  (response) => {
    // Restituisce l'oggetto di risposta. Si potrebbero trasformare i dati qui se necessario.
    return response;
  },
  // Funzione eseguita se si riceve una risposta con codice di stato HTTP al di fuori dell'intervallo 2xx (cioè, un errore).
  (error) => {
    // Esempio di gestione globale degli errori.
    // Ad esempio, se si riceve un errore 401 (Non Autorizzato), si potrebbe reindirizzare l'utente alla pagina di login
    // o tentare un refresh del token di autenticazione.
    // if (error.response && error.response.status === 401) {
    //   // Logica per reindirizzare al login o gestire il refresh del token.
    //   console.error('Accesso non autorizzato, reindirizzare al login.');
    //   // window.location.href = '/login'; // Esempio di reindirizzamento
    // }
    // Restituisce una Promise rigettata con l'errore, in modo che possa essere gestito dal blocco .catch()
    // nel codice che ha effettuato la chiamata API.
    return Promise.reject(error);
  }
);

// Esporta l'istanza apiClient configurata.
// Questa istanza verrà importata negli altri file di servizio (authService, jobService, ecc.)
// per effettuare chiamate API al backend.
export default apiClient;
