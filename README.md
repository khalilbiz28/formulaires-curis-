# formulaires-sécu
Rapport de Projet:
Mise en œuvre d'un formulaire sécurisé Node.js avec reCAPTCHA et HTTPS
1. Introduction
Dans le cadre de ce projet, nous avons développé une solution sécurisée de formulaire de contact basée sur Node.js. L'objectif principal était de garantir un traitement sécurisé des données des utilisateurs en intégrant les bonnes pratiques de cybersécurité, notamment via HTTPS, reCAPTCHA, et un système de journalisation.

2. Technologies utilisées
Node.js (v22.15.0) : Environnement d'exécution.

Express.js : Framework serveur léger.

HTTPS : Sécurisation des échanges via certificat SSL auto-signé.

Helmet.js : Sécurisation des headers HTTP.

Body-parser : Middleware pour le traitement sécurisé des données POST.

Axios : Requête HTTP sécurisée pour valider le reCAPTCHA.

Google reCAPTCHA v2 : Vérification anti-robot.

bcrypt.js (optionnel) : Hashage des données sensibles.

File System (fs) : Stockage local des données et logs.

Postman : Tests automatisés API.

3. Architecture du projet
plaintext
Copier
Modifier
├── config
│   ├── cert.pem
│   └── key.pem
├── data
│   └── messages.json
├── logs
│   ├── success.log
│   └── errors.log
├── public
│   └── index.html
├── src
│   └── server.js
└── postman_collection.json
4. Sécurisation du formulaire
Étapes mises en œuvre :
Serveur HTTPS :

Création de certificats auto-signés via OpenSSL.

Démarrage du serveur Express en HTTPS (port 3000).

Protection via Helmet :

Ajout de headers sécurisés (XSS Protection, NoSniff, CSP désactivé temporairement pour tests locaux).

Validation des entrées côté serveur :

Vérification des champs requis (Nom, Email, Message).

Validation du token reCAPTCHA.

Gestion des erreurs robustes :

Réponse claire au client (400 ou 500 avec messages explicites).

5. Mécanisme de validation reCAPTCHA
Fonctionnement :
Récupération côté client du token via Google reCAPTCHA v2.

Transmission en POST sécurisé vers le serveur.

Validation côté serveur via https://www.google.com/recaptcha/api/siteverify avec clé secrète.

Traitement uniquement si validation réussie.

6. Stockage des données
Format JSON local (data/messages.json).

Ajout sécurisé des messages reçus avec :

Nom.

Email.

Message.

Date de réception.

Sauvegarde sous forme de tableau JSON, sécurisé par les permissions système.

7. Journalisation des logs
Logs créés :
logs/success.log : Tentatives réussies (informations + timestamp).

logs/errors.log : Erreurs rencontrées (erreurs serveur, échecs reCAPTCHA, tentatives frauduleuses).

8. Tests réalisés
Utilisation de Postman Collection pour automatiser les tests :

Requêtes valides avec reCAPTCHA correct.

Requêtes invalides sans token.

Injection de scripts dans les champs (test XSS).

Simulation d'erreurs serveur.

Résultat : Toutes les tentatives ont été correctement journalisées et sécurisées.

9. Limitations et axes d'amélioration
Limitation	Amélioration possible
Utilisation de certificats auto-signés	Déploiement avec certificat valide Let's Encrypt
Stockage en JSON local	Migration vers une base de données sécurisée (ex: PostgreSQL)
Faible résistance aux attaques DDoS	Implémentation d'un pare-feu applicatif (WAF)

10. Conclusion
Le projet a permis de mettre en œuvre un formulaire sécurisé basé sur Node.js répondant aux exigences de sécurité Web moderne. Toutes les étapes ont été validées via des tests automatisés et manuels. Le système est prêt pour un déploiement en environnement de développement sécurisé, avec possibilité d'évolution vers un environnement de production.

