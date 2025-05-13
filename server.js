const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');
const axios = require('axios');

const app = express();
const upload = multer();

const RECAPTCHA_SECRET = '6Lez_TYrAAAAAICNMWRPMPAY5puR9JFzQ0l9sffB'; // remplace par ta clé secrète

// Sécurité et logs
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('combined'));

// Servir les fichiers statiques (comme index.html)
app.use(express.static(path.join(__dirname, '../public')));

// Route POST avec multer pour FormData
app.post('/submit', upload.none(), async (req, res) => {
    console.log('Reçu :', req.body);

    const recaptchaToken = req.body['g-recaptcha-response'];
    if (!recaptchaToken) {
        return res.status(400).json({ error: "Veuillez valider le reCAPTCHA." });
    }

    try {
        const isHuman = await verifyRecaptcha(recaptchaToken);
       

        // Simuler le stockage des données
        const submission = {
            name: req.body.name,
            email: req.body.email,
            message: req.body.message,
            date: new Date().toISOString()
        };

        const dataPath = path.join(__dirname, '../data/submissions.json');
        let existing = [];
        if (fs.existsSync(dataPath)) {
            existing = JSON.parse(fs.readFileSync(dataPath));
        }
        existing.push(submission);
        fs.writeFileSync(dataPath, JSON.stringify(existing, null, 2));

        console.log('Données enregistrées');
        res.json({ success: "Formulaire envoyé avec succès !" });
    } catch (error) {
        console.error('Erreur serveur:', error);
        res.status(500).json({ error: "Erreur interne." });
    }
});

async function verifyRecaptcha(token) {
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${token}`;
    try {
        const response = await axios.post(url);
        const data = response.data;
        return data.success;
    } catch (error) {
        console.error('Erreur reCAPTCHA:', error);
        return false;
    }
}

// SSL local
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, '../config/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../config/cert.pem')),
};

const PORT = 3000;
https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`Serveur HTTPS démarré sur https://localhost:${PORT}`);
});
