import express, { application } from 'express';
import {
    pubblicaLavoro,
    riceviLavoro,
    riceviLavoroDaId,
    rimuoviLavoroDaId
} from '../controllers/postAnnunciController.js'
const router = express.Router() //serve perchè abbiamo creato scheda con routes. Se lo avessimo fatto direttamente in server.js non avremmo avuto bisogno di creare un router, ma avremmo potuto usare direttamente app.get() o app.post() per definire le rotte. In questo caso, abbiamo creato un router per organizzare meglio le nostre rotte e separare la logica del controller dalla definizione delle rotte.




router.post('/', pubblicaLavoro);

router.get('/', riceviLavoro);

router.get('/:id', riceviLavoroDaId);

router.delete('/:id', rimuoviLavoroDaId);

export default router 