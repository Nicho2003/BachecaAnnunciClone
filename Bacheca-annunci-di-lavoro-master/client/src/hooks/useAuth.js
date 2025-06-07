// src/hooks/useAuth.js

// Importa l'hook 'useContext' da React. useContext permette di accedere
// al valore di un Contesto React (in questo caso, AuthContext).
import { useContext } from 'react';

// Importa l'oggetto AuthContext creato nel file AuthContext.jsx.
// AuthContext contiene lo stato di autenticazione e le funzioni correlate.
import AuthContext from '../contexts/AuthContext';

// Definisce l'hook personalizzato 'useAuth'.
// Gli hook personalizzati sono un modo per riutilizzare logica stateful tra componenti.
// Per convenzione, i nomi degli hook iniziano con 'use'.
const useAuth = () => {
  // Utilizza l'hook useContext per ottenere il valore corrente del AuthContext.
  // 'context' conterrà l'oggetto 'value' fornito dal AuthProvider più vicino nell'albero dei componenti.
  const context = useContext(AuthContext);

  // Controllo di sicurezza per lo sviluppo:
  // Se 'context' è undefined, significa che useAuth è stato chiamato al di fuori
  // di un componente discendente di AuthProvider. Questo è un errore di utilizzo.
  // process.env.NODE_ENV !== 'test' evita che questo errore venga lanciato durante i test,
  // dove il contesto potrebbe essere mockato o non necessario.
  if (context === undefined && process.env.NODE_ENV !== 'test') {
    throw new Error('useAuth deve essere usato all\'interno di un AuthProvider');
  }

  // Restituisce il contesto. I componenti che usano useAuth() riceveranno
  // l'oggetto { isAuthenticated, user, login, logout, ecc. } fornito da AuthProvider.
  return context;
};

// Esporta l'hook useAuth per renderlo disponibile per l'importazione in altri componenti.
export default useAuth;
