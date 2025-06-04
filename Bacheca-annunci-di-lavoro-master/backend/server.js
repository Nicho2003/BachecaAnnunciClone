import express from 'express';
import mongoose from 'mongoose';
import candidatureRoutes from './routes/candidature.js';
import postAnnunciRoutes from './routes/postAnnunci.js';
import dotenv from "dotenv";

dotenv.config();
const app = express();


const PORT = process.env.PORT || 5000;
const MONGOURI = process.env.MONGO_URI;

app.use(express.json()); //per poter leggere i dati in formato JSON
app.use('/api/candidature', candidatureRoutes);
app.use('/api/postAnnunci', postAnnunciRoutes);

mongoose
  .connect(MONGOURI)
  .then(() => {
    console.log('MongoDB connesso con successo');
    app.listen(PORT, () => {
        console.log(`Server in ascolto sulla porta ${PORT}`);   
    });
}).catch((error) => {console.error('Errore di connessione a MongoDB:', error);
    process.exit(1); // Esce dal processo se la connessione fallisce
});

app.get('/', (req, res) => {
  res.send('Bacheca di annunci di lavoro API è avviata.');
});
