// backend/middleware/authMiddleware.js

// Middleware per verificare se l'utente è autenticato.
// Questo middleware viene utilizzato per proteggere le rotte che richiedono un utente loggato.
export const ensureAuthenticated = (req, res, next) => {
  // req.isAuthenticated() è un metodo fornito da Passport.
  // Restituisce true se l'utente è autenticato (cioè, la sessione contiene un utente valido), false altrimenti.
  if (req.isAuthenticated()) {
    // Se l'utente è autenticato, passa al prossimo middleware o al gestore della rotta.
    return next();
  }
  // Se l'utente non è autenticato, invia una risposta di errore 401 (Non Autorizzato).
  res.status(401).json({ message: 'Accesso non autorizzato. Per favore, effettua il login.' });
};

// Middleware per verificare se l'utente autenticato ha un ruolo (userType) specifico.
// Questo middleware è una factory function: restituisce un'altra funzione middleware.
// Questo permette di passare un array di tipi di utente consentiti (allowedUserTypes).
export const ensureAuthorized = (allowedUserTypes) => {
  // La funzione middleware restituita che verrà eseguita da Express.
  return (req, res, next) => {
    // Controlla se l'oggetto req.user esiste (l'utente è autenticato) e se ha una proprietà userType.
    // req.user è popolato da Passport dopo un'autenticazione riuscita.
    if (!req.user || !req.user.userType) {
      // Se non c'è utente o userType, invia una risposta di errore 403 (Accesso Negato/Forbidden).
      // Questo potrebbe accadere se ensureAuthenticated non è stato usato prima o c'è un problema con i dati utente.
      return res.status(403).json({ message: 'Autorizzazione fallita. Tipo utente non specificato.' });
    }
    // Controlla se lo userType dell'utente corrente è incluso nell'array dei tipi di utente consentiti.
    if (allowedUserTypes.includes(req.user.userType)) {
      // Se lo userType è consentito, passa al prossimo middleware o al gestore della rotta.
      return next();
    } else {
      // Se lo userType non è consentito, invia una risposta di errore 403 (Accesso Negato/Forbidden).
      return res.status(403).json({ message: 'Autorizzazione fallita. Non hai i permessi necessari.' });
    }
  };
};
