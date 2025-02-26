import React, { createContext, useContext, useState, useEffect } from 'react';
import donneesPrincipales from '../model/donnees';
import { formaterDate } from '../utils/planningUtils';

// Création du contexte
const PlanningContext = createContext();

/**
 * Provider pour le contexte de planning
 * Gère l'état global de l'application
 */
export const PlanningProvider = ({ children }) => {
  // État initial basé sur nos données
  const [donnees, setDonnees] = useState(donneesPrincipales);
  const [dateSelectionnee, setDateSelectionnee] = useState(formaterDate(new Date()));
  
  // Charger les données depuis le localStorage au démarrage
  useEffect(() => {
    const donneesStockees = localStorage.getItem('restau-planning-data');
    if (donneesStockees) {
      try {
        const parsedData = JSON.parse(donneesStockees);
        setDonnees(parsedData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    }
  }, []);
  
  // Sauvegarder les données dans le localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('restau-planning-data', JSON.stringify(donnees));
  }, [donnees]);
  
  // Actions pour manipuler les données
  
  /**
   * Ajouter un nouveau service au planning
   * @param {Object} service - Service à ajouter
   */
  const ajouterService = (service) => {
    const newId = Math.max(...donnees.plannings.services.map(s => s.id), 0) + 1;
    const newService = {
      ...service,
      id: newId
    };
    
    setDonnees(prevDonnees => ({
      ...prevDonnees,
      plannings: {
        ...prevDonnees.plannings,
        services: [...prevDonnees.plannings.services, newService]
      }
    }));
  };
  
  /**
   * Modifier un service existant
   * @param {number} id - ID du service à modifier
   * @param {Object} modifications - Modifications à appliquer
   */
  const modifierService = (id, modifications) => {
    setDonnees(prevDonnees => {
      const services = prevDonnees.plannings.services.map(service => 
        service.id === id ? { ...service, ...modifications } : service
      );
      
      return {
        ...prevDonnees,
        plannings: {
          ...prevDonnees.plannings,
          services
        }
      };
    });
  };
  
  /**
   * Supprimer un service
   * @param {number} id - ID du service à supprimer
   */
  const supprimerService = (id) => {
    setDonnees(prevDonnees => {
      const services = prevDonnees.plannings.services.filter(service => service.id !== id);
      
      return {
        ...prevDonnees,
        plannings: {
          ...prevDonnees.plannings,
          services
        }
      };
    });
  };
  
  /**
   * Ajouter un nouvel employé
   * @param {Object} employe - Employé à ajouter
   */
  const ajouterEmploye = (employe) => {
    const newId = Math.max(...donnees.personnel.map(e => e.id), 0) + 1;
    const newEmploye = {
      ...employe,
      id: newId
    };
    
    setDonnees(prevDonnees => ({
      ...prevDonnees,
      personnel: [...prevDonnees.personnel, newEmploye]
    }));
  };
  
  /**
   * Modifier un employé existant
   * @param {number} id - ID de l'employé à modifier
   * @param {Object} modifications - Modifications à appliquer
   */
  const modifierEmploye = (id, modifications) => {
    setDonnees(prevDonnees => {
      const personnel = prevDonnees.personnel.map(employe => 
        employe.id === id ? { ...employe, ...modifications } : employe
      );
      
      return {
        ...prevDonnees,
        personnel
      };
    });
  };
  
  /**
   * Supprimer un employé
   * @param {number} id - ID de l'employé à supprimer
   */
  const supprimerEmploye = (id) => {
    setDonnees(prevDonnees => {
      const personnel = prevDonnees.personnel.filter(employe => employe.id !== id);
      
      return {
        ...prevDonnees,
        personnel
      };
    });
  };
  
  /**
   * Mettre à jour la semaine actuelle
   * @param {string} semaine - Date de début de semaine (format YYYY-MM-DD)
   */
  const changerSemaineActuelle = (semaine) => {
    setDonnees(prevDonnees => ({
      ...prevDonnees,
      plannings: {
        ...prevDonnees.plannings,
        semaineActuelle: semaine
      }
    }));
  };
  
  /**
   * Ajouter plusieurs services au planning (ex: génération automatique)
   * @param {Array} services - Liste des services à ajouter
   */
  const ajouterServices = (services) => {
    // Trouver le prochain ID disponible
    const maxId = Math.max(...donnees.plannings.services.map(s => s.id || 0), 0);
    
    // Ajouter des IDs aux nouveaux services s'ils n'en ont pas déjà
    const servicesAvecIds = services.map((service, index) => ({
      ...service,
      id: service.id || (maxId + index + 1)
    }));
    
    // Log pour le debug
    console.log("Ajout de", servicesAvecIds.length, "nouveaux services");
    
    setDonnees(prevDonnees => ({
      ...prevDonnees,
      plannings: {
        ...prevDonnees.plannings,
        services: [...prevDonnees.plannings.services, ...servicesAvecIds]
      }
    }));
  };
  
  /**
   * Ajouter un événement spécial
   * @param {Object} evenement - Événement à ajouter
   */
  const ajouterEvenementSpecial = (evenement) => {
    setDonnees(prevDonnees => ({
      ...prevDonnees,
      previsions: {
        ...prevDonnees.previsions,
        evenementsSpeciaux: [...prevDonnees.previsions.evenementsSpeciaux, evenement]
      }
    }));
  };
  
  // Valeur du contexte à fournir
  const contextValue = {
    donnees,
    dateSelectionnee,
    setDateSelectionnee,
    ajouterService,
    modifierService,
    supprimerService,
    ajouterEmploye,
    modifierEmploye,
    supprimerEmploye,
    changerSemaineActuelle,
    ajouterServices,
    ajouterEvenementSpecial
  };
  
  return (
    <PlanningContext.Provider value={contextValue}>
      {children}
    </PlanningContext.Provider>
  );
};

/**
 * Hook personnalisé pour utiliser le contexte de planning
 * @returns {Object} Context value
 */
export const usePlanningContext = () => {
  const context = useContext(PlanningContext);
  if (!context) {
    throw new Error('usePlanningContext doit être utilisé à l\'intérieur d\'un PlanningProvider');
  }
  return context;
};

export default PlanningContext;
