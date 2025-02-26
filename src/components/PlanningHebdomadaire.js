import React, { useState } from 'react';
import { usePlanningContext } from '../store/PlanningContext';
import { getJourSemaine, formaterDate } from '../utils/planningUtils';
import './PlanningHebdomadaire.css';

/**
 * Composant d'affichage du planning hebdomadaire
 * 
 * @param {Object} props
 * @param {string} props.semaine - Date de début de semaine au format YYYY-MM-DD
 * @param {Object} props.donnees - Données globales de l'application
 * @param {Function} props.onSelectDate - Fonction appelée lors de la sélection d'une date
 */
const PlanningHebdomadaire = ({ semaine, donnees, onSelectDate }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const { ajouterServices } = usePlanningContext();

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
        nomJour: getJourSemaine(dateStr).charAt(0).toUpperCase() + getJourSemaine(dateStr).slice(1),
        services: donnees.plannings.services.filter(s => s.date === dateStr)
      });
    }
    
    return jours;
  }, [donnees.plannings.services, semaine]);

  // Fonction pour récupérer le nom d'un employé
  const getNomEmploye = (id) => {
    const employe = donnees.personnel.find(e => e.id === id);
    return employe ? `${employe.prenom} ${employe.nom}` : 'Inconnu';
  };

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

  // Afficher le modal pour modifier un service
  const handleEditService = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  // Sélectionner une date pour l'affichage détaillé
  const handleSelectDate = (dateStr) => {
    if (onSelectDate) {
      onSelectDate(dateStr);
    }
  };

  return (
    <div className="planning-hebdomadaire">
      <div className="planning-header">
        <h2>Planning de la semaine</h2>
        <button onClick={handleGenererPlanning} className="btn-generer">
          Générer Planning Automatique
        </button>
      </div>
      
      <div className="jours-container">
        {joursPlanning.map((jourData, index) => (
          <div 
            key={index} 
            className="jour-planning"
            onClick={() => handleSelectDate(jourData.date)}
          >
            <h3>{jourData.nomJour} <span>{jourData.date.substring(8)}</span></h3>
            
            <div className="services-list">
              {jourData.services.length > 0 ? (
                jourData.services.map((service) => (
                  <div 
                    key={service.id} 
                    className={`service-item ${service.poste.toLowerCase()}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditService(service);
                    }}
                  >
                    <div className="horaire">{service.heureDebut} - {service.heureFin}</div>
                    <div className="employe">{getNomEmploye(service.employeId)}</div>
                    <div className="poste">{service.poste}</div>
                  </div>
                ))
              ) : (
                <div className="aucun-service">Aucun service</div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Détails du service</h3>
            
            <div className="service-details">
              <p><strong>Date:</strong> {selectedService.date}</p>
              <p><strong>Employé:</strong> {getNomEmploye(selectedService.employeId)}</p>
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

export default PlanningHebdomadaire;
