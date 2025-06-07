// src/components/auth/GoogleLoginButton.jsx

// Importa React per la creazione del componente.
import React from 'react';

// Definizione del componente funzionale GoogleLoginButton.
// Questo è un componente riutilizzabile per visualizzare un pulsante di login con Google.
// Riceve una prop 'onClick', che è una funzione da eseguire quando il pulsante viene cliccato.
const GoogleLoginButton = ({ onClick }) => {
  // Struttura JSX del componente.
  return (
    // Elemento <button> HTML.
    // - onClick={onClick}: Associa la funzione passata come prop all'evento onClick del pulsante.
    // - className="btn btn-danger": Applica classi Bootstrap per stilizzare il pulsante
    //   (aspetto di un pulsante generico, colore rosso tipico per Google).
    <button onClick={onClick} className="btn btn-danger">
      {/* Elemento <i> per l'icona di Google, utilizzando le classi di Bootstrap Icons.
          - "bi bi-google": Classe per l'icona di Google.
          - "me-2": Margine destro (margin-end) di 2 unità Bootstrap per spaziare l'icona dal testo. */}
      <i className="bi bi-google me-2"></i>
      {/* Testo del pulsante. */}
      Accedi con Google
    </button>
  );
};

// Esporta il componente GoogleLoginButton come default, rendendolo disponibile per l'importazione
// in altre parti dell'applicazione (es. nella HomePage o LoginPage).
export default GoogleLoginButton;
