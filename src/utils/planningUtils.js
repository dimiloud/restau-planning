// RestauPlanning - Fonctions utilitaires
// Fonctions pour manipuler et gérer les données de planning

/**
 * Convertit une date au format YYYY-MM-DD
 * @param {Date} date - Objet Date à formater
 * @returns {string} Date formatée en YYYY-MM-DD
 */
export function formaterDate(date) {
  const annee = date.getFullYear();
  const mois = String(date.getMonth() + 1).padStart(2, '0');
  const jour = String(date.getDate()).padStart(2, '0');
  return `${annee}-${mois}-${jour}`;
}

/**
 * Obtient le nom du jour de la semaine à partir d'une date
 * @param {string} dateStr - Date au format YYYY-MM-DD
 * @returns {string} Nom du jour en français
 */
export function getJourSemaine(dateStr) {
  const date = new Date(dateStr);
  const jours = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  return jours[date.getDay()];
}

/**
 * Calcule le nombre d'heures entre deux horaires
 * @param {string} debut - Heure de début (format HH:MM)
 * @param {string} fin - Heure de fin (format HH:MM)
 * @returns {number} Nombre d'heures (décimal)
 */
export function calculerHeures(debut, fin) {
  const [heureDebut, minuteDebut] = debut.split(':').map(Number);
  let [heureFin, minuteFin] = fin.split(':').map(Number);
  
  // Ajuster pour les services qui se terminent après minuit
  if (heureFin < heureDebut) {
    heureFin += 24;
  }
  
  const totalMinutes = (heureFin * 60 + minuteFin) - (heureDebut * 60 + minuteDebut);
  return totalMinutes / 60;
}

/**
 * Vérifie si un employé est disponible pour une date et un créneau donnés
 * @param {Object} employe - Objet employé
 * @param {string} date - Date au format YYYY-MM-DD
 * @param {string} heureDebut - Heure de début (format HH:MM)
 * @param {string} heureFin - Heure de fin (format HH:MM)
 * @param {Array} servicesExistants - Services déjà planifiés
 * @returns {boolean} true si l'employé est disponible
 */
export function estDisponible(employe, date, heureDebut, heureFin, servicesExistants) {
  const jourSemaine = getJourSemaine(date);
  
  // Vérifier si l'employé est disponible ce jour-là
  if (!employe.disponibilites[jourSemaine].disponible) {
    return false;
  }
  
  // Vérifier si l'employé n'est pas en congé
  const estEnConge = employe.conges.some(conge => {
    const debutConge = new Date(conge.debut);
    const finConge = new Date(conge.fin);
    const dateActuelle = new Date(date);
    return dateActuelle >= debutConge && dateActuelle <= finConge && conge.approuve;
  });
  
  if (estEnConge) {
    return false;
  }
  
  // Vérifier s'il y a un conflit avec un service existant
  const conflit = servicesExistants.some(service => {
    if (service.employeId === employe.id && service.date === date) {
      // Convertir les heures en minutes pour faciliter la comparaison
      const debutService = convertirEnMinutes(service.heureDebut);
      const finService = convertirEnMinutes(service.heureFin);
      const nouveauDebut = convertirEnMinutes(heureDebut);
      const nouveauFin = convertirEnMinutes(heureFin);
      
      // Vérifier s'il y a un chevauchement
      return (nouveauDebut < finService && nouveauFin > debutService);
    }
    return false;
  });
  
  if (conflit) {
    return false;
  }
  
  return true;
}

/**
 * Convertit une heure au format HH:MM en minutes depuis minuit
 * @param {string} heure - Heure au format HH:MM
 * @returns {number} Minutes depuis minuit
 */
function convertirEnMinutes(heure) {
  const [h, m] = heure.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Obtient le numéro de semaine et l'année d'une date donnée
 * @param {string} dateStr - Date au format YYYY-MM-DD
 * @returns {string} Année et semaine au format "YYYY-WXX"
 */
function getSemaineAnnee(dateStr) {
  const date = new Date(dateStr);
  const janFirstDay = new Date(date.getFullYear(), 0, 1).getDay();
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((dayOfYear + janFirstDay) / 7);
  
  return `${date.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
}

/**
 * Génère un planning automatique pour une semaine donnée
 * @param {string} dateDebut - Date de début de semaine (format YYYY-MM-DD)
 * @param {Object} donnees - Données globales de l'application
 * @returns {Array} Liste des services générés
 */
export function genererPlanning(dateDebut, donnees) {
  const planning = [];
  const joursSemaine = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
  const dateDebutObj = new Date(dateDebut);
  
  // ID pour les nouveaux services
  let nextId = Math.max(...donnees.plannings.services.map(s => s.id), 0) + 1;
  
  // Pour chaque jour de la semaine
  for (let i = 0; i < 7; i++) {
    const dateCourante = new Date(dateDebutObj);
    dateCourante.setDate(dateDebutObj.getDate() + i);
    const dateStr = formaterDate(dateCourante);
    const jour = joursSemaine[i];
    
    // Vérifier les événements spéciaux pour cette date
    const evenementSpecial = donnees.previsions.evenementsSpeciaux.find(
      event => event.date === dateStr
    );
    
    // Pour chaque service (déjeuner et dîner)
    const services = ["dejeuner", "diner"];
    services.forEach(service => {
      let besoinsPersonnel;
      
      if (evenementSpecial) {
        besoinsPersonnel = evenementSpecial.personnelNecessaire;
      } else {
        besoinsPersonnel = donnees.previsions.typiques[jour][service].personnelNecessaire;
      }
      
      // Déterminer les horaires en fonction du service
      let heureDebut, heureFin, pause;
      if (service === "dejeuner") {
        heureDebut = "11:00";
        heureFin = "15:00";
        pause = "13:00-13:30";
      } else { // dîner
        heureDebut = "18:00";
        heureFin = jour === "vendredi" || jour === "samedi" ? "00:00" : "23:00";
        pause = "20:30-21:00";
      }
      
      // Pour chaque section (cuisine, service, etc.)
      Object.entries(besoinsPersonnel).forEach(([section, nombreNecessaire]) => {
        // Trouver les employés disponibles pour cette section et ce jour
        const employesDisponibles = donnees.personnel.filter(employe => {
          // Vérifier si l'employé peut travailler dans cette section
          if (!employe.poste.includes(section)) {
            return false;
          }
          
          return estDisponible(employe, dateStr, heureDebut, heureFin, donnees.plannings.services);
        });
        
        // Trier les employés selon certains critères (par exemple, équité des horaires)
        // Pour cet exemple, on trie par ID pour simplifier
        employesDisponibles.sort((a, b) => a.id - b.id);
        
        // Affecter les employés aux postes
        for (let j = 0; j < Math.min(nombreNecessaire, employesDisponibles.length); j++) {
          const employe = employesDisponibles[j];
          
          planning.push({
            id: nextId++,
            employeId: employe.id,
            date: dateStr,
            heureDebut,
            heureFin,
            poste: section,
            pause
          });
        }
      });
    });
  }
  
  return planning;
}

/**
 * Calcule les statistiques pour un employé sur une période donnée
 * @param {number} employeId - ID de l'employé
 * @param {string} dateDebut - Date de début (format YYYY-MM-DD)
 * @param {string} dateFin - Date de fin (format YYYY-MM-DD)
 * @param {Object} donnees - Données globales de l'application
 * @returns {Object} Statistiques de l'employé
 */
export function statistiquesEmploye(employeId, dateDebut, dateFin, donnees) {
  const services = donnees.plannings.services.filter(
    service => service.employeId === employeId &&
    service.date >= dateDebut &&
    service.date <= dateFin
  );
  
  let totalHeures = 0;
  let totalServices = services.length;
  let totalWeekends = 0;
  
  services.forEach(service => {
    // Calculer les heures travaillées
    totalHeures += calculerHeures(service.heureDebut, service.heureFin);
    
    // Vérifier si c'est un weekend
    const date = new Date(service.date);
    const estWeekend = date.getDay() === 0 || date.getDay() === 6; // 0 = dimanche, 6 = samedi
    if (estWeekend) {
      totalWeekends++;
    }
  });
  
  return {
    employeId,
    totalHeures,
    totalServices,
    totalWeekends,
    moyenneHeuresParService: totalHeures / totalServices || 0
  };
}

/**
 * Vérifie si le planning respecte les contraintes légales
 * @param {Array} services - Liste des services
 * @param {Object} donnees - Données globales de l'application
 * @returns {Array} Liste des infractions détectées
 */
export function verifierContraintesLegales(services, donnees) {
  const infractions = [];
  const employesMap = new Map();
  
  // Regrouper les services par employé et par jour
  services.forEach(service => {
    if (!employesMap.has(service.employeId)) {
      employesMap.set(service.employeId, new Map());
    }
    
    const employeServices = employesMap.get(service.employeId);
    if (!employeServices.has(service.date)) {
      employeServices.set(service.date, []);
    }
    
    employeServices.get(service.date).push(service);
  });
  
  // Vérifier les contraintes pour chaque employé
  employesMap.forEach((jours, employeId) => {
    const employe = donnees.personnel.find(e => e.id === employeId);
    
    // Calculer les heures hebdomadaires
    let semaines = new Map();
    jours.forEach((servicesJour, date) => {
      const dateSemaine = getSemaineAnnee(date);
      if (!semaines.has(dateSemaine)) {
        semaines.set(dateSemaine, 0);
      }
      
      servicesJour.forEach(service => {
        semaines.set(
          dateSemaine, 
          semaines.get(dateSemaine) + calculerHeures(service.heureDebut, service.heureFin)
        );
      });
    });
    
    // Vérifier la durée maximale hebdomadaire (48h)
    semaines.forEach((heures, semaine) => {
      if (heures > 48) {
        infractions.push({
          type: "HeuresHebdoMaximum",
          employeId,
          nom: `${employe.prenom} ${employe.nom}`,
          semaine,
          heures,
          message: `Dépasse les 48h hebdomadaires (${heures.toFixed(1)}h)`
        });
      }
    });
    
    // Vérifier le repos quotidien (11h minimum entre deux services)
    const datesTriees = Array.from(jours.keys()).sort();
    for (let i = 0; i < datesTriees.length - 1; i++) {
      const dateActuelle = datesTriees[i];
      const dateSuivante = datesTriees[i + 1];
      
      const servicesJourActuel = jours.get(dateActuelle);
      const servicesJourSuivant = jours.get(dateSuivante);
      
      // Trouver le service qui finit le plus tard ce jour
      const dernierService = servicesJourActuel.reduce((last, current) => {
        const finLast = convertirEnMinutes(last.heureFin);
        const finCurrent = convertirEnMinutes(current.heureFin);
        return finCurrent > finLast ? current : last;
      }, servicesJourActuel[0]);
      
      // Trouver le service qui commence le plus tôt le jour suivant
      const premierService = servicesJourSuivant.reduce((first, current) => {
        const debutFirst = convertirEnMinutes(first.heureDebut);
        const debutCurrent = convertirEnMinutes(current.heureDebut);
        return debutCurrent < debutFirst ? current : first;
      }, servicesJourSuivant[0]);
      
      // Calculer le temps de repos entre les deux
      const finJour1 = convertirEnMinutes(dernierService.heureFin);
      const debutJour2 = convertirEnMinutes(premierService.heureDebut) + 24 * 60; // +24h car jour suivant
      const reposMinutes = debutJour2 - finJour1;
      const reposHeures = reposMinutes / 60;
      
      if (reposHeures < 11) {
        infractions.push({
          type: "ReposQuotidien",
          employeId,
          nom: `${employe.prenom} ${employe.nom}`,
          dates: [dateActuelle, dateSuivante],
          reposHeures,
          message: `Repos insuffisant entre ${dateActuelle} et ${dateSuivante} (${reposHeures.toFixed(1)}h)`
        });
      }
    });
  });
  
  return infractions;
}

/**
 * Exporte le planning au format CSV
 * @param {Array} services - Liste des services à exporter
 * @param {Array} personnel - Liste du personnel
 * @returns {string} Contenu CSV
 */
export function exporterPlanningCSV(services, personnel) {
  let csv = "Date,EmployeID,Employe,Poste,Debut,Fin,Pause\n";
  
  services.forEach(service => {
    const employe = personnel.find(e => e.id === service.employeId);
    if (employe) {
      csv += `${service.date},${service.employeId},"${employe.prenom} ${employe.nom}",${service.poste},${service.heureDebut},${service.heureFin},${service.pause}\n`;
    }
  });
  
  return csv;
}

/**
 * Obtient les congés à venir dans un intervalle de jours
 * @param {Array} personnel - Liste du personnel
 * @param {number} joursAvenir - Nombre de jours dans le futur à vérifier
 * @returns {Array} Liste des congés à venir
 */
export function getCongesAVenir(personnel, joursAvenir = 14) {
  const congesAVenir = [];
  const maintenant = new Date();
  
  personnel.forEach(employe => {
    employe.conges.forEach(conge => {
      const debutConge = new Date(conge.debut);
      const joursAvantConge = Math.floor((debutConge - maintenant) / (1000 * 60 * 60 * 24));
      
      if (joursAvantConge >= 0 && joursAvantConge <= joursAvenir) {
        congesAVenir.push({
          employeId: employe.id,
          employe: `${employe.prenom} ${employe.nom}`,
          debut: conge.debut,
          fin: conge.fin,
          jours: joursAvantConge,
          approuve: conge.approuve
        });
      }
    });
  });
  
  return congesAVenir.sort((a, b) => a.jours - b.jours);
}

export default {
  formaterDate,
  getJourSemaine,
  calculerHeures,
  estDisponible,
  genererPlanning,
  statistiquesEmploye,
  verifierContraintesLegales,
  exporterPlanningCSV,
  getCongesAVenir
};
