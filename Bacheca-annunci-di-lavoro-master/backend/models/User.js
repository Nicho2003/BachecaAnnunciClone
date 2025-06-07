// backend/models/User.js
// Importa Mongoose per la definizione dello schema e del modello.
import mongoose from 'mongoose';
// Importa bcryptjs per l'hashing delle password, una libreria per crittografare le password in modo sicuro.
import bcrypt from 'bcryptjs';

// Definisce lo schema per il modello User. Uno schema mappa a una collezione MongoDB e definisce la forma dei documenti all'interno di quella collezione.
const userSchema = new mongoose.Schema({
  // googleId: Stringa che memorizza l'ID univoco fornito da Google per gli utenti che si autenticano tramite OAuth.
  // 'unique: true' assicura che non ci siano due utenti con lo stesso googleId.
  // 'sparse: true' permette che questo campo sia assente per gli utenti che non usano Google OAuth, senza violare l'unicità.
  googleId: { type: String, unique: true, sparse: true },
  // email: Stringa per l'indirizzo email dell'utente. È un campo obbligatorio ('required: true') e unico ('unique: true').
  // 'trim: true' rimuove gli spazi bianchi iniziali e finali.
  // 'lowercase: true' converte l'email in minuscolo prima di salvarla, per standardizzazione.
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  // displayName: Stringa per il nome visualizzato dell'utente. 'trim: true' per pulizia.
  displayName: { type: String, trim: true },
  // password: Stringa per la password dell'utente. Non è 'required' perché gli utenti OAuth non avranno una password locale.
  password: { type: String },
  // userType: Stringa che definisce il tipo di utente. Può essere solo 'applier' (candidato) o 'azienda'.
  // 'enum' restringe i valori possibili. 'required: true' lo rende un campo obbligatorio.
  userType: { type: String, enum: ['applier', 'azienda'], required: true },
}, {
  // timestamps: true aggiunge automaticamente i campi createdAt e updatedAt al documento, gestiti da Mongoose.
  timestamps: true
});

// Hook (middleware) pre-save: viene eseguito prima che un documento 'User' venga salvato nel database.
// Utilizzato qui per hashare la password. La funzione deve essere una funzione tradizionale (non arrow) per preservare il contesto 'this'.
userSchema.pre('save', async function(next) {
  // Controlla se il campo password è stato modificato o se è una nuova password.
  // Inoltre, verifica che this.password esista (non sia null o undefined).
  if (!this.isModified('password') || !this.password) {
    // Se la password non è modificata o non esiste, passa al prossimo middleware/salvataggio.
    return next();
  }
  try {
    // Genera un "salt", un valore casuale utilizzato per rendere l'hash della password più sicuro. 10 è il costo del salt (round di hashing).
    const salt = await bcrypt.genSalt(10);
    // Hasha la password corrente (this.password) usando il salt generato.
    this.password = await bcrypt.hash(this.password, salt);
    // Passa al prossimo middleware o al salvataggio effettivo del documento.
    next();
  } catch (error) {
    // Se si verifica un errore durante l'hashing, lo passa al gestore di errori di Mongoose.
    next(error);
  }
});

// Metodo d'istanza per confrontare una password candidata con la password hashata dell'utente.
// Questo metodo sarà disponibile su ogni documento 'User'.
userSchema.methods.comparePassword = async function(candidatePassword) {
  // Se l'utente non ha una password (es. utente OAuth), restituisce false.
  if (!this.password) return false;
  // Usa bcrypt.compare per confrontare in modo sicuro la password fornita con quella hashata nel database.
  // Restituisce true se corrispondono, false altrimenti.
  return bcrypt.compare(candidatePassword, this.password);
};

// Crea il modello 'User' basato sullo userSchema. 'User' sarà il nome della collezione nel database (pluralizzato automaticamente in 'users').
const User = mongoose.model('User', userSchema);
// Esporta il modello User per poterlo utilizzare in altre parti dell'applicazione.
export default User;
