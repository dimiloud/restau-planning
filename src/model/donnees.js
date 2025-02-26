// RestauPlanning - Modèle de données principal
// Structure de données pour la gestion des horaires du restaurant

// Données principales de l'application
export const donneesPrincipales = {
  // Informations sur le restaurant
  restaurant: {
    nom: "Mon Restaurant",
    heuresOuverture: {
      lundi: { ouverture: "11:00", fermeture: "23:00" },
      mardi: { ouverture: "11:00", fermeture: "23:00" },
      mercredi: { ouverture: "11:00", fermeture: "23:00" },
      jeudi: { ouverture: "11:00", fermeture: "23:00" },
      vendredi: { ouverture: "11:00", fermeture: "00:00" },
      samedi: { ouverture: "11:00", fermeture: "00:00" },
      dimanche: { ouverture: "11:00", fermeture: "22:00" }
    },
    sections: ["Cuisine", "Service", "Bar", "Accueil", "Nettoyage"]
  },
  
  // Employés
  personnel: [
    {
      id: 1,
      prenom: "Jean",
      nom: "Dupont",
      telephone: "0612345678",
      email: "jean.dupont@email.com",
      poste: ["Cuisine"],
      contrat: {
        type: "CDI",
        heuresHebdo: 35,
        dateDebut: "2023-01-15"
      },
      competences: ["Chef", "Plats chauds"],
      disponibilites: {
        lundi: { disponible: true, heuresPreferees: ["17:00-23:00"] },
        mardi: { disponible: true, heuresPreferees: ["17:00-23:00"] },
        mercredi: { disponible: true, heuresPreferees: ["17:00-23:00"] },
        jeudi: { disponible: true, heuresPreferees: ["17:00-23:00"] },
        vendredi: { disponible: true, heuresPreferees: ["17:00-23:00"] },
        samedi: { disponible: false, heuresPreferees: [] },
        dimanche: { disponible: false, heuresPreferees: [] }
      },
      conges: [
        { debut: "2025-03-15", fin: "2025-03-22", approuve: true }
      ]
    },
    {
      id: 2,
      prenom: "Marie",
      nom: "Martin",
      telephone: "0687654321",
      email: "marie.martin@email.com",
      poste: ["Service", "Bar"],
      contrat: {
        type: "CDI",
        heuresHebdo: 35,
        dateDebut: "2023-02-01"
      },
      competences: ["Serveur expérimenté", "Barman"],
      disponibilites: {
        lundi: { disponible: true, heuresPreferees: ["11:00-15:00", "18:00-23:00"] },
        mardi: { disponible: true, heuresPreferees: ["11:00-15:00", "18:00-23:00"] },
        mercredi: { disponible: true, heuresPreferees: ["11:00-15:00", "18:00-23:00"] },
        jeudi: { disponible: true, heuresPreferees: ["11:00-15:00", "18:00-23:00"] },
        vendredi: { disponible: true, heuresPreferees: ["18:00-00:00"] },
        samedi: { disponible: true, heuresPreferees: ["18:00-00:00"] },
        dimanche: { disponible: false, heuresPreferees: [] }
      },
      conges: []
    },
    {
      id: 3,
      prenom: "Pierre",
      nom: "Bernard",
      telephone: "0678912345",
      email: "pierre.bernard@email.com",
      poste: ["Service"],
      contrat: {
        type: "Temps partiel",
        heuresHebdo: 20,
        dateDebut: "2024-06-10"
      },
      competences: ["Service", "Accueil clients"],
      disponibilites: {
        lundi: { disponible: false, heuresPreferees: [] },
        mardi: { disponible: false, heuresPreferees: [] },
        mercredi: { disponible: false, heuresPreferees: [] },
        jeudi: { disponible: true, heuresPreferees: ["18:00-23:00"] },
        vendredi: { disponible: true, heuresPreferees: ["18:00-00:00"] },
        samedi: { disponible: true, heuresPreferees: ["18:00-00:00"] },
        dimanche: { disponible: true, heuresPreferees: ["11:00-22:00"] }
      },
      conges: []
    }
  ],
  
  // Prévisions d'activité
  previsions: {
    // Prévisions basées sur l'historique
    typiques: {
      lundi: { 
        dejeuner: { volumeClients: "Moyen", personnelNecessaire: { "Cuisine": 2, "Service": 2, "Bar": 1, "Accueil": 1, "Nettoyage": 1 } },
        diner: { volumeClients: "Faible", personnelNecessaire: { "Cuisine": 2, "Service": 2, "Bar": 1, "Accueil": 1, "Nettoyage": 1 } }
      },
      mardi: {
        dejeuner: { volumeClients: "Moyen", personnelNecessaire: { "Cuisine": 2, "Service": 2, "Bar": 1, "Accueil": 1, "Nettoyage": 1 } },
        diner: { volumeClients: "Faible", personnelNecessaire: { "Cuisine": 2, "Service": 2, "Bar": 1, "Accueil": 1, "Nettoyage": 1 } }
      },
      mercredi: {
        dejeuner: { volumeClients: "Moyen", personnelNecessaire: { "Cuisine": 2, "Service": 3, "Bar": 1, "Accueil": 1, "Nettoyage": 1 } },
        diner: { volumeClients: "Moyen", personnelNecessaire: { "Cuisine": 2, "Service": 3, "Bar": 1, "Accueil": 1, "Nettoyage": 1 } }
      },
      jeudi: {
        dejeuner: { volumeClients: "Moyen", personnelNecessaire: { "Cuisine": 2, "Service": 3, "Bar": 1, "Accueil": 1, "Nettoyage": 1 } },
        diner: { volumeClients: "Elevé", personnelNecessaire: { "Cuisine": 3, "Service": 4, "Bar": 2, "Accueil": 1, "Nettoyage": 1 } }
      },
      vendredi: {
        dejeuner: { volumeClients: "Elevé", personnelNecessaire: { "Cuisine": 3, "Service": 4, "Bar": 2, "Accueil": 1, "Nettoyage": 1 } },
        diner: { volumeClients: "Très Elevé", personnelNecessaire: { "Cuisine": 4, "Service": 6, "Bar": 2, "Accueil": 1, "Nettoyage": 2 } }
      },
      samedi: {
        dejeuner: { volumeClients: "Elevé", personnelNecessaire: { "Cuisine": 3, "Service": 4, "Bar": 2, "Accueil": 1, "Nettoyage": 1 } },
        diner: { volumeClients: "Très Elevé", personnelNecessaire: { "Cuisine": 4, "Service": 6, "Bar": 2, "Accueil": 1, "Nettoyage": 2 } }
      },
      dimanche: {
        dejeuner: { volumeClients: "Très Elevé", personnelNecessaire: { "Cuisine": 4, "Service": 6, "Bar": 2, "Accueil": 1, "Nettoyage": 1 } },
        diner: { volumeClients: "Moyen", personnelNecessaire: { "Cuisine": 3, "Service": 4, "Bar": 1, "Accueil": 1, "Nettoyage": 1 } }
      }
    },
    // Événements spéciaux
    evenementsSpeciaux: [
      {
        date: "2025-02-14",
        description: "Saint Valentin",
        volumeClients: "Très Elevé",
        personnelNecessaire: { "Cuisine": 4, "Service": 6, "Bar": 2, "Accueil": 1, "Nettoyage": 2 }
      },
      {
        date: "2025-12-31",
        description: "Réveillon Nouvel An",
        volumeClients: "Exceptionnel",
        personnelNecessaire: { "Cuisine": 5, "Service": 8, "Bar": 3, "Accueil": 2, "Nettoyage": 3 }
      }
    ]
  },
  
  // Planning actuel
  plannings: {
    semaineActuelle: "2025-02-24", // Semaine courante (format YYYY-MM-DD pour le lundi)
    services: [
      {
        id: 1,
        employeId: 1,
        date: "2025-02-24", // Lundi
        heureDebut: "17:00",
        heureFin: "23:00",
        poste: "Cuisine",
        pause: "20:00-20:30"
      },
      {
        id: 2,
        employeId: 1,
        date: "2025-02-25", // Mardi
        heureDebut: "17:00",
        heureFin: "23:00",
        poste: "Cuisine",
        pause: "20:00-20:30"
      },
      {
        id: 3,
        employeId: 2,
        date: "2025-02-24", // Lundi
        heureDebut: "11:00",
        heureFin: "15:00",
        poste: "Service",
        pause: "13:30-14:00"
      },
      {
        id: 4,
        employeId: 2,
        date: "2025-02-24", // Lundi
        heureDebut: "18:00",
        heureFin: "23:00",
        poste: "Service",
        pause: "20:30-21:00"
      }
    ]
  }
};

export default donneesPrincipales;
