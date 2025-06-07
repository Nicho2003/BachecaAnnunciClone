// Importa StrictMode da React. StrictMode è uno strumento per evidenziare potenziali problemi
// in un'applicazione. Attiva controlli e avvisi aggiuntivi per i suoi discendenti.
// Non renderizza alcuna UI visibile e non ha impatto sulla build di produzione.
import { StrictMode } from 'react';

// Importa createRoot da react-dom/client. createRoot è la nuova API per il rendering concorrente
// introdotta in React 18, che permette di creare un "root" per renderizzare componenti React nel DOM.
import { createRoot } from 'react-dom/client';

// Importa il file CSS globale (index.css), che può contenere stili di base o reset per l'intera applicazione.
import './index.css';

// Importa il componente principale dell'applicazione, App, dal file App.jsx.
import App from './App.jsx';

// Utilizza createRoot per creare un punto di ingresso per il rendering dell'applicazione React.
// document.getElementById('root') seleziona l'elemento DOM con ID 'root' (tipicamente un div vuoto
// nel file public/index.html) dove l'applicazione React verrà montata.
createRoot(document.getElementById('root')).render(
  // StrictMode avvolge il componente App. Questo aiuta a identificare pratiche non sicure
  // o deprecate durante lo sviluppo, come l'uso di API del ciclo di vita legacy, ecc.
  <StrictMode>
    {/* Renderizza il componente App, che è il componente radice dell'interfaccia utente dell'applicazione. */}
    <App />
  </StrictMode>,
);
