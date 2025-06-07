// src/pages/LoginPage.jsx

// Importa React e l'hook useState per la gestione dello stato del componente.
import React, { useState } from 'react';
// Importa useNavigate per la navigazione programmatica e Link per la navigazione dichiarativa da react-router-dom.
import { useNavigate, Link } from 'react-router-dom';
// Importa l'hook personalizzato useAuth per accedere al contesto di autenticazione (es. la funzione di login).
import useAuth from '../hooks/useAuth';
// Importa il componente GoogleLoginButton per l'opzione di login con Google.
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
// Importa la funzione redirectToGoogleOAuth dal servizio API di autenticazione per avviare il login Google.
import { redirectToGoogleOAuth } from '../services/api/authService';

// Definizione del componente funzionale LoginPage.
const LoginPage = () => {
  // Stato per memorizzare l'email inserita dall'utente, inizializzato a stringa vuota.
  const [email, setEmail] = useState('');
  // Stato per memorizzare la password inserita dall'utente, inizializzato a stringa vuota.
  const [password, setPassword] = useState('');
  // Stato per memorizzare eventuali messaggi di errore durante il login, inizializzato a stringa vuota.
  const [error, setError] = useState('');
  // Stato per indicare se il form è in fase di sottomissione (per disabilitare input/pulsanti).
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estrae la funzione 'login' dal contesto di autenticazione tramite l'hook useAuth.
  const { login } = useAuth();
  // Ottiene la funzione 'navigate' da react-router-dom per reindirizzare l'utente dopo il login.
  const navigate = useNavigate();

  // Gestore per la sottomissione del form di login tradizionale (email/password).
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del form (ricaricamento pagina).
    setError('');       // Resetta eventuali messaggi di errore precedenti.
    setIsSubmitting(true); // Imposta lo stato di sottomissione a true.
    try {
      // Chiama la funzione 'login' (dal AuthContext) con email e password.
      // Questa funzione gestirà la chiamata API al backend.
      const loggedInUser = await login(email, password);
      // Se il login ha successo, 'loggedInUser' conterrà i dati dell'utente.
      // Reindirizza l'utente alla dashboard appropriata in base al 'userType'.
      if (loggedInUser.userType === 'azienda') {
        navigate('/dashboard-azienda');
      } else {
        navigate('/dashboard-applier');
      }
    } catch (err) {
      // Se la funzione 'login' lancia un errore (es. credenziali errate, errore server).
      // Imposta il messaggio di errore da visualizzare all'utente.
      // Prende il messaggio dall'errore della risposta API, se disponibile, altrimenti un messaggio generico.
      setError(err.response?.data?.message || 'Login fallito. Riprova.');
    }
    setIsSubmitting(false); // Resetta lo stato di sottomissione.
  };

  // Gestore per il click sul pulsante di login con Google.
  const handleGoogleLogin = () => {
    // Chiama la funzione che avvia il flusso di autenticazione OAuth con Google.
    redirectToGoogleOAuth();
  };

  // Struttura JSX del componente LoginPage.
  return (
    // Contenitore principale con classi Bootstrap per layout e spacing.
    <div className="container mt-5">
      <div className="row justify-content-center"> {/* Riga per centrare il contenuto */}
        <div className="col-md-6"> {/* Colonna che occupa 6/12 su schermi medi e superiori */}
          <div className="card"> {/* Card Bootstrap per raggruppare il form */}
            <div className="card-body"> {/* Corpo della card */}
              <h2 className="card-title text-center mb-4">Login</h2> {/* Titolo della card */}
              {/* Visualizza un alert di errore Bootstrap se 'error' non è vuoto. */}
              {error && <div className="alert alert-danger">{error}</div>}
              {/* Form di login. onSubmit chiama la funzione handleSubmit. */}
              <form onSubmit={handleSubmit}>
                {/* Campo per l'email */}
                <div className="mb-3"> {/* Gruppo form con margine inferiore */}
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email} // Lega il valore dell'input allo stato 'email'.
                    onChange={(e) => setEmail(e.target.value)} // Aggiorna lo stato 'email' al cambio.
                    required // Campo obbligatorio.
                    disabled={isSubmitting} // Disabilita l'input durante la sottomissione.
                  />
                </div>
                {/* Campo per la password */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password} // Lega il valore allo stato 'password'.
                    onChange={(e) => setPassword(e.target.value)} // Aggiorna lo stato 'password'.
                    required
                    disabled={isSubmitting}
                  />
                </div>
                {/* Pulsante di submit del form */}
                <button
                  type="submit"
                  className="btn btn-primary w-100" // Pulsante Bootstrap primario, larghezza 100%.
                  disabled={isSubmitting} // Disabilita durante la sottomissione.
                >
                  {/* Testo del pulsante condizionale: mostra 'Accesso in corso...' o 'Login'. */}
                  {isSubmitting ? 'Accesso in corso...' : 'Login'}
                </button>
              </form>
              {/* Separatore orizzontale */}
              <hr />
              {/* Sezione per il login con Google */}
              <div className="text-center mb-3">
                <p className="mb-2">Oppure accedi con:</p>
                {/* Componente GoogleLoginButton, onClick chiama handleGoogleLogin. */}
                <GoogleLoginButton onClick={handleGoogleLogin} />
              </div>
              {/* Link alla pagina di registrazione per utenti non registrati. */}
              <p className="mt-3 text-center">
                Non hai un account? <Link to="/register">Registrati</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Esporta il componente LoginPage.
export default LoginPage;
