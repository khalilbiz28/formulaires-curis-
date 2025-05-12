const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');  // Utilisation d'axios pour les requêtes HTTP
const https = require('https');
const helmet = require("helmet");
const fs = require('fs');
const path = require('path');
const form = require('form');
const formData = require('formData');
const response = require('response');
const result = require('');
const app = express();

const RECAPTCHA_SECRET = '6Lez_TYrAAAAAICNMWRPMPAY5puR9JFzQ0l9sffB';  // Remplacer par ta clé secrète reCAPTCHA

// Middleware pour parser les données du formulaire
app.use(helmet({contentSecurityPolicy:false}));
app.use(bodyParser.urlencoded({ extended: true }));

// Route GET vers index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Route POST
app.post('/submit', async (req, res) => {
    const recaptchaToken = req.body['g-recaptcha-response'];

    if (!recaptchaToken) {
        return res.status(400).json({ error: "Veuillez valider le reCAPTCHA." });
    }

    try {
        const isHuman = await verifyRecaptcha(recaptchaToken);
        if (!isHuman) {
            return res.status(400).json({ error: "Échec de la vérification reCAPTCHA." });
        }

        // Hashage des données sensibles et enregistrement dans une base ou un fichier
        // Par exemple, tu peux ajouter un hachage ici pour sécuriser les mots de passe si nécessaire

        res.json({ success: "Formulaire envoyé avec succès !" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la vérification reCAPTCHA." });
    }
});

async function verifyRecaptcha(token) {
    const secret = RECAPTCHA_SECRET;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;

    try {
        const response = await axios.post(url);
        const data = response.data;

        // Vérification si la réponse est valide
        if (data.success) {
            return true;
        } else {
            console.error('Erreur reCAPTCHA:', data['error-codes']);
            return false;
        }
    } catch (error) {
        console.error('Erreur lors de la requête reCAPTCHA:', error);
        throw error;
    }
}

const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, '../config/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../config/cert.pem')),
};

const PORT = 3000;
https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`Serveur HTTPS démarré sur https://localhost:${PORT}`);
});
