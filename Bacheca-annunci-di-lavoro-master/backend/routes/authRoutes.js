// backend/routes/authRoutes.js
// Importa Express per creare e gestire le rotte.
import express from 'express';
// Importa Passport per l'autenticazione.
import passport from 'passport';
// Importa il modello User per interagire con il database degli utenti, necessario per la registrazione.
import User from '../models/User.js';

// Crea un nuovo router Express.
const router = express.Router();
// Definisce l'URL base del frontend, preso dalle variabili d'ambiente o default a localhost:3000.
// Usato per i reindirizzamenti OAuth.
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Rotta GET per avviare l'autenticazione Google.
// Quando questa rotta viene chiamata, Passport reindirizza l'utente a Google per il login.
// 'google' specifica la strategia GoogleStrategy.
// 'scope' definisce le informazioni richieste (profilo e email).
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Rotta GET per il callback di Google OAuth.
// Google reindirizza l'utente a questa URL dopo che l'utente ha acconsentito (o negato) l'accesso.
router.get('/google/callback',
  // Middleware Passport per gestire il callback di Google.
  passport.authenticate('google', {
    // URL a cui reindirizzare in caso di fallimento dell'autenticazione Google.
    failureRedirect: `${FRONTEND_URL}/login?error=oauth_failed`,
    // Abilita i messaggi di fallimento, se configurati nella strategia.
    failureMessage: true
  }),
  // Gestore della rotta eseguito se l'autenticazione Google ha successo.
  (req, res) => {
    // A questo punto, req.user è popolato da Passport con i dati dell'utente autenticato.
    // La logica di reindirizzamento qui è cruciale:
    // - Se userType è già definito (login successivi), reindirizza alla dashboard appropriata.
    // - Se è un nuovo utente OAuth e userType è di default 'applier' (da passportSetup), reindirizza.
    // - Se userType non è definito (es. primo login, utente deve scegliere il ruolo),
    //   idealmente si reindirizza a una pagina di completamento profilo.
    // Per ora, reindirizza a una pagina generica /oauth-callback sul frontend,
    // che gestirà ulteriori logiche di reindirizzamento o aggiornamento dello stato.
    res.redirect(`${FRONTEND_URL}/oauth-callback`);
  }
);

// Rotta GET per verificare lo stato di autenticazione dell'utente e ottenere i suoi dati.
// Utile per il frontend per sapere se l'utente è loggato e chi è.
router.get('/me', (req, res) => {
  // req.isAuthenticated() è un metodo di Passport che controlla se l'utente è autenticato.
  if (req.isAuthenticated()) {
    // Se autenticato, restituisce un oggetto JSON con i dati essenziali dell'utente.
    // È importante non restituire dati sensibili come la password hashata.
    res.json({ user: { id: req.user.id, email: req.user.email, displayName: req.user.displayName, userType: req.user.userType } });
  } else {
    // Se non autenticato, restituisce uno stato 401 (Non Autorizzato).
    res.status(401).json({ message: 'Non autenticato' });
  }
});

// Rotta POST per il logout dell'utente.
router.post('/logout', (req, res, next) => {
  // req.logout() è un metodo di Passport che termina la sessione di login.
  req.logout((err) => {
    // Callback per gestire eventuali errori durante il logout.
    if (err) { return next(err); } // Passa l'errore al gestore di errori Express.
    // req.session.destroy() distrugge la sessione sul server.
    req.session.destroy((err) => {
      if (err) {
        // Se c'è un errore nella distruzione della sessione, risponde con un errore 500.
        return res.status(500).json({ message: 'Logout fallito.' });
      }
      // res.clearCookie() rimuove il cookie di sessione dal browser dell'utente.
      // 'connect.sid' è il nome predefinito del cookie di sessione per express-session.
      res.clearCookie('connect.sid');
      // Risponde con un messaggio di successo.
      res.status(200).json({ message: 'Logout effettuato con successo' });
    });
  });
});

// Rotta POST per la registrazione di un nuovo utente locale (email/password).
router.post('/register', async (req, res, next) => {
  // Estrae i dati dal corpo della richiesta.
  const { email, password, displayName, userType } = req.body;
  // Validazione base dei campi: verifica che tutti i campi necessari siano presenti.
  if (!email || !password || !displayName || !userType) {
    return res.status(400).json({ message: 'Per favore, fornisci email, password, nome visualizzato e tipo utente.' });
  }
  // Verifica che userType sia uno dei valori consentiti.
  if (!['applier', 'azienda'].includes(userType)) {
    return res.status(400).json({ message: 'Tipo utente non valido.' });
  }

  try {
    // Controlla se esiste già un utente con la stessa email (ignorando maiuscole/minuscole).
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Un utente con questa email esiste già.' });
    }

    // Crea una nuova istanza del modello User con i dati forniti.
    const newUser = new User({
      email: email.toLowerCase(), // Salva l'email in minuscolo.
      password: password,         // La password verrà hashata dal middleware pre-save nel modello User.
      displayName: displayName,
      userType: userType
    });

    // Salva il nuovo utente nel database. L'hook pre-save hasherà la password.
    await newUser.save();

    // Effettua il login automatico dell'utente dopo la registrazione.
    // req.login() è un metodo di Passport che stabilisce una sessione di login.
    req.login(newUser, (err) => {
      if (err) {
        // Se c'è un errore durante il login, lo passa al gestore di errori.
        return next(err);
      }
      // Prepara un oggetto utente da inviare nella risposta, omettendo la password.
      const userToSend = { id: newUser.id, email: newUser.email, displayName: newUser.displayName, userType: newUser.userType };
      // Invia una risposta 201 (Creato) con messaggio di successo e dati dell'utente.
      return res.status(201).json({ message: 'Registrazione avvenuta con successo.', user: userToSend });
    });

  } catch (error) {
    // Gestisce errori specifici, come quelli di validazione di Mongoose.
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Errore di validazione.', errors: error.errors });
    }
    // Per tutti gli altri errori (es. problemi di database), li passa al gestore di errori Express.
    return next(error);
  }
});

// Rotta POST per il login di un utente locale (email/password).
router.post('/login', (req, res, next) => {
  // Utilizza Passport per autenticare l'utente con la strategia 'local'.
  // Fornisce una callback personalizzata per gestire il risultato dell'autenticazione.
  passport.authenticate('local', (err, user, info) => {
    // Gestisce eventuali errori server occorsi durante l'autenticazione.
    if (err) { return next(err); }
    // Se l'autenticazione fallisce (utente non trovato, password errata), 'user' sarà false.
    // 'info' può contenere messaggi di errore dalla strategia (es. 'Email non registrata.').
    if (!user) {
      return res.status(401).json({ message: info.message || 'Login fallito. Controlla email e password.' });
    }
    // Se l'autenticazione ha successo, 'user' contiene l'utente autenticato.
    // req.login() stabilisce la sessione di login.
    req.login(user, (err) => {
      if (err) { return next(err); }
      // Prepara l'oggetto utente da inviare nella risposta (senza password).
      const userToSend = { id: user.id, email: user.email, displayName: user.displayName, userType: user.userType };
      // Invia una risposta JSON con messaggio di successo e dati dell'utente.
      return res.json({ message: 'Login effettuato con successo.', user: userToSend });
    });
  })(req, res, next); // Invoca il middleware Passport.
});

// Esporta il router per montarlo nell'applicazione principale (server.js).
export default router;
