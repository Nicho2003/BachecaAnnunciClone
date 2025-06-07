// src/pages/RegisterPage.jsx

// Importa React e l'hook useState per la gestione dello stato del componente.
import React, { useState } from 'react';
// Importa useNavigate per la navigazione programmatica e Link per la navigazione dichiarativa.
import { useNavigate, Link } from 'react-router-dom';
// Importa l'hook useAuth per accedere alla funzione di registrazione dal contesto di autenticazione.
import useAuth from '../hooks/useAuth';

// Definizione del componente funzionale RegisterPage.
const RegisterPage = () => {
  // Stato per il nome visualizzato inserito dall'utente.
  const [displayName, setDisplayName] = useState('');
  // Stato per l'email inserita dall'utente.
  const [email, setEmail] = useState('');
  // Stato per la password inserita dall'utente.
  const [password, setPassword] = useState('');
  // Stato per il tipo di utente selezionato (default 'applier').
  const [userType, setUserType] = useState('applier');
  // Stato per eventuali messaggi di errore durante la registrazione.
  const [error, setError] = useState('');
  // Stato per indicare se il form è in fase di sottomissione.
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estrae la funzione 'register' dal contesto di autenticazione.
  const { register } = useAuth();
  // Ottiene la funzione 'navigate' per reindirizzare l'utente dopo la registrazione.
  const navigate = useNavigate();

  // Gestore per la sottomissione del form di registrazione.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene il ricaricamento della pagina.
    setError('');       // Resetta gli errori.
    setIsSubmitting(true); // Imposta lo stato di sottomissione.
    try {
      // Chiama la funzione 'register' (dal AuthContext) con i dati del form.
      // Il backend dovrebbe gestire la creazione dell'utente e il login automatico.
      const registeredUser = await register(displayName, email, password, userType);
      // Se la registrazione ha successo, reindirizza alla dashboard appropriata.
      if (registeredUser.userType === 'azienda') {
        navigate('/dashboard-azienda');
      } else {
        navigate('/dashboard-applier');
      }
    } catch (err) {
      // Se la registrazione fallisce, imposta il messaggio di errore.
      // Prova a prendere il messaggio dall'errore della risposta API.
      setError(err.response?.data?.message || 'Registrazione fallita. Riprova.');
      // Se ci sono errori di validazione specifici dal backend (es. Mongoose validation errors),
      // li formatta e li mostra.
      if (err.response?.data?.errors) {
        const messages = Object.values(err.response.data.errors).map(e => e.message).join('\n');
        setError(messages);
      }
    }
    setIsSubmitting(false); // Resetta lo stato di sottomissione.
  };

  // Struttura JSX del componente RegisterPage.
  return (
    // Contenitore principale con classi Bootstrap.
    <div className="container mt-5">
      <div className="row justify-content-center"> {/* Riga per centrare il contenuto */}
        <div className="col-md-6"> {/* Colonna per il form */}
          <div className="card"> {/* Card Bootstrap */}
            <div className="card-body"> {/* Corpo della card */}
              <h2 className="card-title text-center mb-4">Registrazione</h2> {/* Titolo */}
              {/* Visualizza alert di errore se 'error' è presente.
                  Se ci sono più messaggi di errore (separati da newline), li mostra su righe separate. */}
              {error && <div className="alert alert-danger">{error.split('\n').map((line, i) => (<div key={i}>{line}</div>))}</div>}
              {/* Form di registrazione */}
              <form onSubmit={handleSubmit}>
                {/* Campo Nome Visualizzato */}
                <div className="mb-3">
                  <label htmlFor="displayName" className="form-label">Nome Visualizzato</label>
                  <input
                    type="text"
                    className="form-control"
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                {/* Campo Email */}
                <div className="mb-3">
                  <label htmlFor="emailReg" className="form-label">Email</label> {/* htmlFor e id dovrebbero essere unici */}
                  <input
                    type="email"
                    className="form-control"
                    id="emailReg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                {/* Campo Password */}
                <div className="mb-3">
                  <label htmlFor="passwordReg" className="form-label">Password</label> {/* htmlFor e id dovrebbero essere unici */}
                  <input
                    type="password"
                    className="form-control"
                    id="passwordReg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                {/* Campo Tipo di Account (select dropdown) */}
                <div className="mb-3">
                  <label htmlFor="userType" className="form-label">Tipo di Account:</label>
                  <select
                    id="userType"
                    className="form-select"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="applier">Candidato (Applier)</option>
                    <option value="azienda">Azienda</option>
                  </select>
                </div>
                {/* Pulsante di submit */}
                <button
                  type="submit"
                  className="btn btn-info w-100" // Pulsante Bootstrap colore "info", larghezza 100%.
                  disabled={isSubmitting}
                >
                  {/* Testo condizionale del pulsante */}
                  {isSubmitting ? 'Registrazione in corso...' : 'Registrati'}
                </button>
              </form>
              {/* Link alla pagina di login se l'utente ha già un account. */}
              <p className="mt-3 text-center">
                Hai già un account? <Link to="/login">Accedi</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Esporta il componente RegisterPage.
export default RegisterPage;
