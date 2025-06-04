import PostAnnunci from "../models/PostAnnunci.js";
//Controller per pubblicare un Lavoro
export const pubblicaLavoro = async (req, res) =>{try {
    const {titolo, azienda, descrizione, località} = req.body;
    const newPostAnnunci = new PostAnnunci({
        titolo,
        azienda,
        descrizione,
        località
    });
const annunciSalvati = await newPostAnnunci.save();
res.status(201).json(annunciSalvati); //201 Created indica che la richiesta è andata a buon fine e ha portato alla creazione di una nuova risorsa.
}catch (error){
    res.status(500).json({message: 'Errore nella pubblicazione di un post di lavoro', error: error.message})
}
};


//Controller per ricevere tutti i lavori
export const riceviLavoro = async(req, res) => {try {
    const ricezioneAllLavori = await PostAnnunci.find();
    if (ricezioneAllLavori.length === 0) {
        return res.status(404).json({message: 'Nessun annuncio di lavoro trovato'});
    }
    res.json(ricezioneAllLavori);
    
} catch(error){
    res.status(500).json({message:'Errore nella ricezione  annunci di lavoro', error: error.message});
}
};

//Controller per ricevere un lavoro da id
export const riceviLavoroDaId = async(req,res)=>{ try {
const ricezioneAnnuncio = await PostAnnunci.findById(req.params.id);
if (!ricezioneAnnuncio){
    return res.stautus(404).json({message:'Annuncio di lavoro non trovato'})
}
res.json(ricezioneAnnuncio);
} catch(error){
 res.status(500).json({message:'Errore nella ricezione annuncio di lavoro', error: error.message})
}};



//Controller per rimuovere un lavoro da id
export const rimuoviLavoroDaId = async(req, res) => {
    try{
        const annunciEliminati = await PostAnnunci.findByIdAndDelete(req.params.id);
        if (!annunciEliminati) {
            return res.status(404).json({message:'Errore eliminazione annuncio'}); 
        } 
 res.json({message: 'Annuncio eliminato con successo'});
} catch(error){
        res.status(500).json({message:'Errore nella rimozione del lavoro', error: error.message });
    }
};
