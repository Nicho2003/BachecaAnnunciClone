// src/contexts/AuthContext.jsx

// Importa le funzioni necessarie da React:
// - createContext: per creare un oggetto Contesto.
// - useState: hook per aggiungere lo stato ai componenti funzionali.
// - useEffect: hook per eseguire effetti collaterali (es. chiamate API dopo il render).
// - useCallback: hook per memoizzare le funzioni, ottimizzando le performance.
import React, { createContext, useState, useEffect, useCallback } from 'react';

// Importa le funzioni del servizio API per l'autenticazione.
// - getCurrentUser: per ottenere i dati dell'utente autenticato dalla sessione backend.
// - apiLoginLocal: per effettuare il login locale (email/password).
// - apiRegisterLocal: per registrare un nuovo utente localmente.
// - apiLogout: per effettuare il logout dal backend.
import { getCurrentUser, loginLocal as apiLoginLocal, registerLocal as apiRegisterLocal, logout as apiLogout } from '../services/api/authService';

// Importa useNavigate da react-router-dom per la navigazione programmatica (opzionale qui, ma utile in alcuni contesti).
// import { useNavigate } from 'react-router-dom';

// Crea un oggetto Contesto React. Questo contesto fornirà lo stato di autenticazione
// e le funzioni correlate ai componenti discendenti che ne faranno uso.
// Il valore iniziale è 'null'.
const AuthContext = createContext(null);

// Definisce il componente AuthProvider. Questo componente avvolgerà parti dell'applicazione
// (tipicamente l'intera app) per fornire il contesto di autenticazione.
// Riceve 'children' come prop, che rappresenta i componenti figli da renderizzare.
export const AuthProvider = ({ children }) => {
  // Definisce lo stato 'user': memorizza i dati dell'utente autenticato (o null se non autenticato).
  const [user, setUser] = useState(null);
  // Definisce lo stato 'isAuthenticated': booleano che indica se l'utente è attualmente autenticato.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Definisce lo stato 'isLoading': booleano per tracciare se lo stato di autenticazione è in fase di caricamento iniziale.
  // Utile per mostrare spinner o evitare rendering prematuri.
  const [isLoading, setIsLoading] = useState(true);
  // const navigate = useNavigate(); // Decommentare se si necessita di reindirizzamenti globali qui.

  // Definisce la funzione 'checkAuthStatus' usando useCallback per memoizzarla.
  // Questa funzione contatta il backend per verificare se c'è una sessione utente attiva.
  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true); // Imposta isLoading a true all'inizio della verifica.
    try {
      // Chiama l'API getCurrentUser per ottenere i dati dell'utente dalla sessione backend.
      const response = await getCurrentUser();
      // Se la risposta contiene dati utente validi.
      if (response.data && response.data.user) {
        setUser(response.data.user);   // Imposta i dati dell'utente.
        setIsAuthenticated(true);     // Imposta isAuthenticated a true.
      } else {
        // Se non ci sono dati utente validi (o la risposta è vuota).
        setUser(null);                // Resetta l'utente a null.
        setIsAuthenticated(false);    // Imposta isAuthenticated a false.
      }
    } catch (error) {
      // Se si verifica un errore (es. API non raggiungibile, sessione scaduta, errore 401).
      console.error('Nessun utente autenticato o errore:', error.response?.data?.message || error.message);
      setUser(null);                // Resetta l'utente.
      setIsAuthenticated(false);    // Resetta lo stato di autenticazione.
    }
    setIsLoading(false); // Imposta isLoading a false al termine della verifica.
  }, []); // L'array delle dipendenze è vuoto, quindi checkAuthStatus viene creato una sola volta.

  // Hook useEffect per eseguire 'checkAuthStatus' al montaggio del componente AuthProvider.
  // Questo assicura che lo stato di autenticazione venga verificato all'avvio dell'app
  // e anche dopo un reindirizzamento da un flusso OAuth.
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]); // Viene eseguito quando checkAuthStatus (memoizzata) cambia (cioè, solo al montaggio).

  // Definisce la funzione 'login' asincrona per gestire il login locale.
  const login = async (email, password) => {
    try {
      // Chiama la funzione del servizio API per il login locale.
      const response = await apiLoginLocal(email, password);
      setUser(response.data.user);   // Imposta i dati dell'utente ricevuti dal backend.
      setIsAuthenticated(true);     // Imposta lo stato di autenticazione a true.
      return response.data.user;     // Restituisce i dati dell'utente (utile per reindirizzamenti nel componente chiamante).
    } catch (error) {
      // Se il login fallisce.
      console.error('Login fallito:', error.response?.data?.message || error.message);
      throw error; // Rilancia l'errore per permettere al componente chiamante (es. form di login) di gestirlo.
    }
  };

  // Definisce la funzione 'register' asincrona per gestire la registrazione locale.
  const register = async (displayName, email, password, userType) => {
    try {
      // Chiama la funzione del servizio API per la registrazione.
      const response = await apiRegisterLocal(displayName, email, password, userType);
      // Il backend tipicamente effettua il login automatico dopo la registrazione.
      setUser(response.data.user);   // Imposta i dati dell'utente.
      setIsAuthenticated(true);     // Imposta lo stato di autenticazione.
      return response.data.user;     // Restituisce i dati dell'utente.
    } catch (error) {
      // Se la registrazione fallisce.
      console.error('Registrazione fallita:', error.response?.data?.message || error.message);
      throw error; // Rilancia l'errore.
    }
  };

  // Definisce la funzione 'logout' asincrona.
  const logout = async () => {
    try {
      // Chiama la funzione del servizio API per il logout (che invaliderà la sessione backend).
      await apiLogout();
      setUser(null);                // Resetta l'utente.
      setIsAuthenticated(false);    // Resetta lo stato di autenticazione.
      // navigate('/'); // Opzionale: reindirizza alla home page dopo il logout.
    } catch (error) {
      console.error('Logout fallito:', error.response?.data?.message || error.message);
      // Anche se la chiamata API di logout fallisce (es. problemi di rete),
      // forza il logout dello stato locale per sicurezza e coerenza dell'UI.
      setUser(null);
      setIsAuthenticated(false);
      throw error; // Rilancia l'errore se si vuole gestirlo ulteriormente.
    }
  };

  // Definisce 'refreshAuthStatus', una funzione memoizzata per rieseguire 'checkAuthStatus'.
  // Questa funzione viene esposta tramite il contesto e può essere chiamata, ad esempio,
  // dalla pagina di callback OAuth per aggiornare lo stato di autenticazione dopo il reindirizzamento.
  const refreshAuthStatus = useCallback(async () => {
    await checkAuthStatus();
  }, [checkAuthStatus]); // Dipende da checkAuthStatus (che è anch'essa memoizzata).

  // Il componente AuthProvider restituisce il Provider del AuthContext.
  // Il valore ('value') del provider è un oggetto che contiene lo stato di autenticazione (isAuthenticated, user, isLoading)
  // e le funzioni per modificarlo (login, register, logout, refreshAuthStatus).
  // Tutti i componenti 'children' avvolti da AuthProvider potranno accedere a questi valori.
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, isLoading, refreshAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

// Esporta AuthContext per poter essere utilizzato con useContext dai componenti figli.
export default AuthContext;
