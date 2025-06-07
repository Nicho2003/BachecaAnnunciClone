// src/pages/HomePage.jsx

// Importa React per la creazione del componente.
import React from 'react';
// Importa il componente Link da react-router-dom per la navigazione dichiarativa tra le pagine.
import { Link } from 'react-router-dom';
// Importa il componente GoogleLoginButton, un pulsante personalizzato per l'accesso con Google.
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
// Importa la funzione redirectToGoogleOAuth dal servizio di autenticazione API,
// utilizzata per avviare il flusso di login con Google.
import { redirectToGoogleOAuth } from '../services/api/authService';

// Definizione del componente funzionale HomePage.
// Questa è la pagina principale o "landing page" dell'applicazione.
const HomePage = () => {
  // Funzione gestore per l'evento click sul pulsante di login con Google.
  const handleGoogleLogin = () => {
    // Chiama la funzione redirectToGoogleOAuth che reindirizzerà l'utente
    // all'endpoint del backend per avviare l'autenticazione Google.
    redirectToGoogleOAuth();
  };

  // Struttura JSX del componente HomePage.
  return (
    // Contenitore principale della pagina, utilizza classi Bootstrap per lo styling:
    // - "container": per centrare e limitare la larghezza del contenuto.
    // - "mt-5": margine superiore (margin-top) di 5 unità Bootstrap.
    // - "text-center": per centrare il testo all'interno del contenitore.
    <div className="container mt-5 text-center">
      {/* Titolo principale della pagina. */}
      <h1>Benvenuto nella Bacheca Annunci!</h1>
      {/* Sottotitolo o tagline della pagina, con classe "lead" per maggiore enfasi. */}
      <p className="lead">Trova il tuo prossimo lavoro o il candidato ideale.</p>
      {/* Separatore orizzontale. */}
      <hr />
      {/* Sezione per i pulsanti di azione (login/registrazione), con margine superiore. */}
      <div className="mt-4">
        {/* Testo che invita all'azione. */}
        <p>Accedi o registrati per continuare:</p>
        {/* Componente GoogleLoginButton.
            - onClick: prop che specifica la funzione da eseguire al click (handleGoogleLogin). */}
        <GoogleLoginButton onClick={handleGoogleLogin} />
        {/* Contenitore per i pulsanti di login tradizionale e registrazione, con margine superiore. */}
        <div className="mt-3">
          {/* Componente Link per navigare alla pagina di login tradizionale ('/login').
              Utilizza classi Bootstrap per lo styling del pulsante ("btn btn-secondary me-2"). */}
          <Link to="/login" className="btn btn-secondary me-2">Login Tradizionale</Link>
          {/* Componente Link per navigare alla pagina di registrazione ('/register').
              Utilizza classi Bootstrap per lo styling del pulsante ("btn btn-info"). */}
          <Link to="/register" className="btn btn-info">Registrati</Link>
        </div>
      </div>
    </div>
  );
};

// Esporta il componente HomePage come default per poterlo utilizzare nel sistema di routing.
export default HomePage;
