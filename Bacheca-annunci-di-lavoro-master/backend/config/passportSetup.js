// backend/config/passportSetup.js
// Importa l'istanza principale di Passport.
import passport from 'passport';
// Importa la strategia di autenticazione Google OAuth 2.0 da passport-google-oauth20.
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// Importa la strategia di autenticazione locale (username/password) da passport-local.
import { Strategy as LocalStrategy } from 'passport-local';
// Importa il modello User, che interagisce con il database per gli utenti.
import User from '../models/User.js';
// Importa dotenv per caricare le variabili d'ambiente.
import dotenv from 'dotenv';
// Il commento suggerisce che bcryptjs non è strettamente necessario qui perché la logica di confronto password è nel modello User.
// import bcrypt from 'bcryptjs';

// Carica le variabili d'ambiente dal file .env.
dotenv.config();

// Configurazione della strategia Google OAuth 2.0.
passport.use(
  new GoogleStrategy({
    // clientID: ID client OAuth fornito da Google Cloud Console.
    clientID: process.env.GOOGLE_CLIENT_ID,
    // clientSecret: Segreto client OAuth fornito da Google Cloud Console.
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // callbackURL: L'URL a cui Google reindirizzerà l'utente dopo l'autenticazione. Deve corrispondere a quello configurato in Google Cloud Console.
    callbackURL: '/api/auth/google/callback',
    // scope: Array di stringhe che specificano quali informazioni dell'utente richiedere a Google (profilo e email in questo caso).
    scope: ['profile', 'email']
  },
  // Funzione di callback (verify function) eseguita dopo che Google ha autenticato l'utente.
  // Riceve accessToken, refreshToken, il profilo dell'utente da Google, e la funzione done di Passport.
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Cerca un utente nel database locale che corrisponda al googleId del profilo Google.
      let user = await User.findOne({ googleId: profile.id });
      if (user) {
        // Se l'utente esiste, passa l'utente alla funzione done (nessun errore, utente trovato).
        return done(null, user);
      } else {
        // Se l'utente non esiste, ne crea uno nuovo nel database.
        // Nota sulla scelta di userType: come indicato nel commento, questa è una semplificazione.
        // In un'applicazione reale, si dovrebbe gestire meglio la scelta del tipo di utente (es. pagina di completamento profilo).
        user = await User.create({
          googleId: profile.id,                 // ID Google del profilo.
          email: profile.emails[0].value,       // Email principale dell'utente (la prima nell'array emails).
          displayName: profile.displayName,     // Nome visualizzato dall'utente su Google.
          userType: 'applier'                   // Placeholder per userType; da gestire meglio.
        });
        // Passa il nuovo utente creato alla funzione done.
        return done(null, user);
      }
    } catch (error) {
      // Se si verifica un errore (es. problema di database), passa l'errore alla funzione done.
      return done(error, null);
    }
  }
));

// Serializzazione dell'utente per la sessione.
// Determina quali dati dell'utente salvare nella sessione.
passport.serializeUser((user, done) => {
  // Salva solo l'ID dell'utente nella sessione per mantenerla leggera.
  done(null, user.id);
});

// Deserializzazione dell'utente dalla sessione.
// Recupera i dati completi dell'utente basandosi sull'ID salvato nella sessione.
passport.deserializeUser(async (id, done) => {
  try {
    // Trova l'utente nel database usando l'ID.
    const user = await User.findById(id);
    // Passa l'utente trovato alla funzione done.
    done(null, user);
  } catch (error) {
    // Se si verifica un errore, lo passa alla funzione done.
    done(error, null);
  }
});

// Configurazione della strategia di autenticazione Locale (email e password).
passport.use(
  new LocalStrategy(
    // Opzioni per la strategia: specifica che il campo 'username' nel form di login corrisponde all'email.
    { usernameField: 'email' },
    // Funzione di callback (verify function) per l'autenticazione locale.
    // Riceve email, password inserite dall'utente, e la funzione done di Passport.
    async (email, password, done) => {
      try {
        // Cerca un utente nel database usando l'email fornita (convertita in minuscolo per coerenza).
        const user = await User.findOne({ email: email.toLowerCase() });
        // Se non viene trovato alcun utente con quella email.
        if (!user) {
          return done(null, false, { message: 'Email non registrata.' });
        }
        // Se l'utente è stato registrato tramite OAuth (quindi non ha una password locale).
        if (!user.password) {
          return done(null, false, { message: 'Questo account è stato registrato usando un provider OAuth. Prova ad accedere con Google.' });
        }

        // Confronta la password fornita con quella hashata nel database, usando il metodo definito nel modello User.
        const isMatch = await user.comparePassword(password);
        // Se le password corrispondono.
        if (isMatch) {
          return done(null, user); // Autenticazione riuscita.
        } else {
          // Se le password non corrispondono.
          return done(null, false, { message: 'Password errata.' });
        }
      } catch (error) {
        // Se si verifica un errore server.
        return done(error);
      }
    }
  )
);
