// Importa il modulo Express, un framework web per Node.js per creare API e applicazioni web.
import express from 'express';
// Importa Mongoose, una libreria ODM (Object Data Modeling) per MongoDB, che facilita le interazioni con il database.
import mongoose from 'mongoose';
// Importa le rotte definite per la gestione delle candidature.
import candidatureRoutes from './routes/candidature.js';
// Importa le rotte definite per la gestione dei post degli annunci di lavoro.
import postAnnunciRoutes from './routes/postAnnunci.js';
// Importa dotenv per la gestione delle variabili d'ambiente da un file .env.
import dotenv from "dotenv";
// Importa express-session per la gestione delle sessioni utente.
import session from 'express-session';
// Importa Passport, un middleware di autenticazione per Node.js.
import passport from 'passport';
// Importa la configurazione di Passport (strategie di autenticazione). Questo file viene eseguito per configurare Passport.
import './config/passportSetup.js';
// Importa le rotte definite per la gestione dell'autenticazione (login, logout, OAuth).
import authRoutes from './routes/authRoutes.js';

// Carica le variabili d'ambiente dal file .env nella directory principale del progetto.
dotenv.config();
// Crea un'istanza dell'applicazione Express.
const app = express();

// Definisce la porta su cui il server ascolterà, prendendola dalle variabili d'ambiente o usando 5000 come default.
const PORT = process.env.PORT || 5000;
// Recupera l'URI di connessione a MongoDB dalle variabili d'ambiente.
const MONGOURI = process.env.MONGO_URI;

// Configurazione del middleware express-session.
app.use(session({
  // Il segreto usato per firmare il cookie ID della sessione. Deve essere una stringa lunga e casuale in produzione.
  secret: process.env.SESSION_SECRET || 'fallbacksecretkey',
  // Forza il salvataggio della sessione anche se non modificata. false è generalmente raccomandato.
  resave: false,
  // Forza il salvataggio di una sessione "non inizializzata" (nuova ma non modificata). false è raccomandato per conformità GDPR e per ridurre lo storage.
  saveUninitialized: false,
  cookie: {
    // Imposta il cookie come sicuro (trasmesso solo su HTTPS) se l'ambiente è produzione.
    secure: process.env.NODE_ENV === 'production',
    // Impedisce l'accesso al cookie tramite JavaScript dal lato client (misura di sicurezza contro XSS).
    httpOnly: true,
    // Durata del cookie di sessione in millisecondi (es. 1 giorno).
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Inizializza Passport per l'uso nell'applicazione Express.
app.use(passport.initialize());
// Abilita le sessioni persistenti di login per Passport (usa express-session).
app.use(passport.session());

// Middleware integrato in Express per parseificare i payload delle richieste in formato JSON.
app.use(express.json());
// Monta le rotte per le candidature sul percorso base /api/candidature.
app.use('/api/candidature', candidatureRoutes);
// Monta le rotte per i post degli annunci sul percorso base /api/postAnnunci.
app.use('/api/postAnnunci', postAnnunciRoutes);
// Monta le rotte per l'autenticazione sul percorso base /api/auth.
app.use('/api/auth', authRoutes);

// Connessione a MongoDB utilizzando l'URI fornito.
mongoose
  .connect(MONGOURI)
  .then(() => {
    // Callback eseguita se la connessione a MongoDB ha successo.
    console.log('MongoDB connesso con successo');
    // Avvia il server Express sulla porta specificata dopo la connessione al DB.
    app.listen(PORT, () => {
        console.log(`Server in ascolto sulla porta ${PORT}`);   
    });
}).catch((error) => {
    // Callback eseguita se la connessione a MongoDB fallisce.
    console.error('Errore di connessione a MongoDB:', error);
    // Termina il processo Node.js con un codice di errore se la connessione al DB fallisce.
    process.exit(1);
});

// Definizione di una rotta GET di base per verificare che l'API sia in esecuzione.
app.get('/', (req, res) => {
  // Invia una risposta semplice quando si accede alla radice dell'API.
  res.send('Bacheca di annunci di lavoro API è avviata.');
});
