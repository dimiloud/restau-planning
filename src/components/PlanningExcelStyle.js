import React, { useState } from 'react';
import { usePlanningContext } from '../store/PlanningContext';
import { getJourSemaine, formaterDate } from '../utils/planningUtils';
import './PlanningExcelStyle.css';

/**
 * Composant d'affichage du planning au format Excel
 * Présente les horaires par jour avec tous les employés
 * 
 * @param {Object} props
 * @param {string} props.semaine - Date de début de semaine au format YYYY-MM-DD
 */
const PlanningExcelStyle = ({ semaine }) => {
  const { donnees, ajouterServices } = usePlanningContext();
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  
  // Générer les jours de la semaine
  const joursPlanning = React.useMemo(() => {
    const jours = [];
    const dateDebut = new Date(semaine);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(dateDebut);
      date.setDate(dateDebut.getDate() + i);
      const dateStr = formaterDate(date);
      
      jours.push({
        date: dateStr,
        nomJour: getJourSemaine(dateStr),
        services: donnees.plannings.services.filter(s => s.date === dateStr)
      });
    }
    
    return jours;
  }, [donnees.plannings.services, semaine]);
  
  // Générer un planning automatique
  const handleGenererPlanning = () => {
    // Importer la fonction du module utilitaire
    const { genererPlanning } = require('../utils/planningUtils');
    
    // Générer le nouveau planning
    const nouveauxServices = genererPlanning(semaine, donnees);
    
    // Ajouter les nouveaux services au planning
    if (ajouterServices && nouveauxServices.length > 0) {
      ajouterServices(nouveauxServices);
    }
  };
  
  // Regrouper les services par employé et par jour
  const planningParEmploye = React.useMemo(() => {
    const planning = {};
    
    // Initialiser une entrée pour chaque employé
    donnees.personnel.forEach(employe => {
      planning[employe.id] = {
        id: employe.id,
        nom: `${employe.prenom} ${employe.nom}`,
        poste: employe.poste.join(', '),
        services: {}
      };
      
      // Initialiser une entrée vide pour chaque jour
      joursPlanning.forEach(jour => {
        planning[employe.id].services[jour.date] = [];
      });
    });
    
    // Ajouter les services pour chaque employé
    joursPlanning.forEach(jour => {
      jour.services.forEach(service => {
        if (planning[service.employeId]) {
          planning[service.employeId].services[jour.date].push(service);
        }
      });
    });
    
    return Object.values(planning);
  }, [donnees.personnel, joursPlanning]);
  
  // Formater un service pour l'affichage
  const formatService = (services) => {
    if (!services || services.length === 0) {
      return '-';
    }
    
    return services.map(service => (
      <div 
        key={service.id} 
        className={`service-cell ${service.poste.toLowerCase()}`}
        onClick={() => handleEditService(service)}
      >
        {service.heureDebut}-{service.heureFin} <span className="service-poste">({service.poste})</span>
      </div>
    ));
  };
  
  // Afficher le modal pour modifier un service
  const handleEditService = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };
  
  return (
    <div className="planning-excel">
      <div className="planning-excel-header">
        <h2>Planning Hebdomadaire - Format Excel</h2>
        <button onClick={handleGenererPlanning} className="btn-generer">
          Générer Planning Automatique
        </button>
      </div>
      
      <div className="planning-excel-table">
        <table>
          <thead>
            <tr>
              <th className="employee-col">Employé</th>
              <th className="poste-col">Poste</th>
              {joursPlanning.map(jour => (
                <th key={jour.date} className="jour-col">
                  <div className="jour-header">{jour.nomJour.charAt(0).toUpperCase() + jour.nomJour.slice(1)}</div>
                  <div className="jour-date">{jour.date.substring(8)}/{jour.date.substring(5, 7)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {planningParEmploye.map(employe => (
              <tr key={employe.id}>
                <td className="employee-col">{employe.nom}</td>
                <td className="poste-col">{employe.poste}</td>
                {joursPlanning.map(jour => (
                  <td key={jour.date} className="service-col">
                    {formatService(employe.services[jour.date])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Détails du service</h3>
            
            <div className="service-details">
              <p><strong>Date:</strong> {selectedService.date}</p>
              <p><strong>Employé:</strong> {
                (() => {
                  const employe = donnees.personnel.find(e => e.id === selectedService.employeId);
                  return employe ? `${employe.prenom} ${employe.nom}` : 'Inconnu';
                })()
              }</p>
              <p><strong>Poste:</strong> {selectedService.poste}</p>
              <p><strong>Horaire:</strong> {selectedService.heureDebut} - {selectedService.heureFin}</p>
              <p><strong>Pause:</strong> {selectedService.pause}</p>
            </div>
            
            <div className="modal-actions">
              <button 
                onClick={() => setShowModal(false)}
                className="btn-annuler"
              >
                Fermer
              </button>
              <button className="btn-editer">Modifier</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanningExcelStyle;
