import React from 'react';
import { getCongesAVenir, verifierContraintesLegales } from '../utils/planningUtils';
import './AlertesComponent.css';

/**
 * Composant d'affichage des alertes
 * Montre les congés à venir et les problèmes de conformité légale
 * 
 * @param {Object} props
 * @param {Object} props.donnees - Données globales de l'application
 */
const AlertesComponent = ({ donnees }) => {
  // Récupérer les congés à venir (prochains 14 jours)
  const congesAVenir = getCongesAVenir(donnees.personnel);
  
  // Vérifier les contraintes légales
  const infractions = verifierContraintesLegales(donnees.plannings.services, donnees);
  
  return (
    <div className="alertes-component">
      <h2>Alertes</h2>
      
      <div className="alertes-section">
        <h3>
          Congés à venir
          {congesAVenir.length > 0 && (
            <span className="badge">{congesAVenir.length}</span>
          )}
        </h3>
        
        {congesAVenir.length > 0 ? (
          <div className="alertes-list">
            {congesAVenir.map((conge, index) => (
              <div 
                key={index} 
                className={`alerte-item ${conge.jours <= 7 ? 'urgent' : ''}`}
              >
                <div className="alerte-info">
                  <div className="alerte-titre">{conge.employe}</div>
                  <div className="alerte-desc">
                    Du {conge.debut} au {conge.fin}
                  </div>
                </div>
                <div className="alerte-badge">
                  {conge.jours === 0 ? (
                    "Aujourd'hui"
                  ) : conge.jours === 1 ? (
                    "Demain"
                  ) : (
                    `Dans ${conge.jours} jours`
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="aucune-alerte">Aucun congé prévu dans les 14 prochains jours</div>
        )}
      </div>
      
      <div className="alertes-section">
        <h3>
          Conformité légale
          {infractions.length > 0 && (
            <span className="badge error">{infractions.length}</span>
          )}
        </h3>
        
        {infractions.length > 0 ? (
          <div className="alertes-list">
            {infractions.map((infraction, index) => (
              <div key={index} className="alerte-item error">
                <div className="alerte-info">
                  <div className="alerte-titre">{infraction.nom}</div>
                  <div className="alerte-desc">{infraction.message}</div>
                </div>
                <div className="alerte-badge error">
                  {infraction.type === "HeuresHebdoMaximum" ? (
                    "Heures max"
                  ) : (
                    "Repos"
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="aucune-alerte">Aucune infraction détectée</div>
        )}
      </div>
      
      <div className="alertes-section">
        <h3>Personnel manquant</h3>
        
        <div className="alertes-list">
          {/* Ici, on pourrait implémenter une logique pour détecter les postes
              non pourvus ou les périodes en sous-effectif */}
          <div className="aucune-alerte">Aucun manque détecté</div>
        </div>
      </div>
    </div>
  );
};

export default AlertesComponent;
