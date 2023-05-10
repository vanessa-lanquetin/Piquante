const http = require("http"); // Importe le module HTTP intégré de Node.js pour créer un serveur HTTP.
const app = require("./app"); // Importe le module 'app' à partir du fichier 'app.js'. Il contient probablement la configuration de l'application.

const normalizePort = (val) => {
  // Définit une fonction qui normalise le port d'écoute du serveur.
  const port = parseInt(val, 10); // Convertit la valeur du port en un entier décimal.

  if (isNaN(port)) {
    // Vérifie si le port n'est pas un nombre.
    return val; // Renvoie la valeur du port telle quelle.
  }
  if (port >= 0) {
    // Vérifie si le port est un nombre positif ou nul.
    return port; // Renvoie le port.
  }
  return false; // Renvoie false si le port est invalide.
};

const port = normalizePort(process.env.PORT || "3000"); // Normalise le port en utilisant la valeur de l'environnement ou utilise le port 3000 par défaut.
app.set("port", port); // Configure le port d'écoute de l'application avec la valeur normalisée du port.

const errorHandler = (error) => {
  // Définit une fonction de gestion des erreurs du serveur.
  if (error.syscall !== "listen") {
    // Vérifie si l'erreur n'est pas liée à la méthode 'listen'.
    throw error; // Lance une exception avec l'erreur.
  }
  const address = server.address(); // Récupère l'adresse sur laquelle le serveur est en cours d'écoute.
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port; // Détermine l'adresse d'écoute du serveur.
  switch (
    error.code // Gère différents codes d'erreur.
  ) {
    case "EACCES": // Erreur d'autorisation insuffisante.
      console.error(bind + " requires elevated privileges."); // Affiche un message d'erreur indiquant les privilèges requis.
      process.exit(1); // Quitte le processus avec un code d'erreur.
    case "EADDRINUSE": // Erreur de port déjà utilisé.
      console.error(bind + " is already in use."); // Affiche un message d'erreur indiquant que le port est déjà utilisé.
      process.exit(1); // Quitte le processus avec un code d'erreur.
    default: // Erreur inattendue.
      throw error; // Lance une exception avec l'erreur.
  }
};

const server = http.createServer(app);  // Crée le serveur HTTP en utilisant l'application configurée.

server.on("error", errorHandler);  // Gère les erreurs du serveur en utilisant la fonction errorHandler.
server.on("listening", () => {  // S'exécute lorsque le serveur commence à écouter les connexions.
  const address = server.address();  // Récupère l'adresse d'écoute du serveur.
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;  // Détermine l'adresse d'écoute du serveur.

  console.log("Listening on " + bind);  // Affiche un message indiquant que le serveur écoute sur une adresse donnée.
});

server.listen(port);  // Le serveur commence à écouter les connexions entrantes sur le port spécifié.
