import React, { useState } from 'react';
import { usePlanningContext } from '../store/PlanningContext';
import './ParametresView.css';

/**
 * Vue des paramètres de l'application
 * Permet de configurer les paramètres généraux du restaurant
 */
const ParametresView = () => {
  const { donnees, changerSemaineActuelle } = usePlanningContext();
  
  const [restaurantInfo, setRestaurantInfo] = useState({
    nom: donnees.restaurant.nom,
    heuresOuverture: { ...donnees.restaurant.heuresOuverture },
    sections: [...donnees.restaurant.sections]
  });
  
  const [nouvelleSection, setNouvelleSection] = useState('');
  
  // Gérer les changements des informations générales
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRestaurantInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Gérer les changements des heures d'ouverture
  const handleHeureChange = (jour, type, value) => {
    setRestaurantInfo(prev => ({
      ...prev,
      heuresOuverture: {
        ...prev.heuresOuverture,
        [jour]: {
          ...prev.heuresOuverture[jour],
          [type]: value
        }
      }
    }));
  };
  
  // Ajouter une nouvelle section
  const handleAjouterSection = () => {
    if (nouvelleSection.trim() && !restaurantInfo.sections.includes(nouvelleSection.trim())) {
      setRestaurantInfo(prev => ({
        ...prev,
        sections: [...prev.sections, nouvelleSection.trim()]
      }));
      setNouvelleSection('');
    }
  };
  
  // Supprimer une section
  const handleSupprimerSection = (section) => {
    setRestaurantInfo(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s !== section)
    }));
  };
  
  // Sauvegarder les paramètres
  const handleSave = () => {
    // Dans une application réelle, cela mettrait à jour l'état global
    alert('Paramètres sauvegardés avec succès !');
  };
  
  // Exporter les données
  const handleExport = () => {
    const dataStr = JSON.stringify(donnees, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'restau-planning-export.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  return (
    <div className="parametres-view">
      <h1>Paramètres</h1>
      
      <div className="parametres-section">
        <h2>Informations générales</h2>
        
        <div className="form-group">
          <label>Nom du restaurant</label>
          <input 
            type="text" 
            name="nom" 
            value={restaurantInfo.nom}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="parametres-section">
        <h2>Heures d'ouverture</h2>
        
        <div className="heures-container">
          {Object.entries(restaurantInfo.heuresOuverture).map(([jour, heures]) => (
            <div key={jour} className="jour-heures">
              <div className="jour-label">{jour.charAt(0).toUpperCase() + jour.slice(1)}</div>
              
              <div className="heures-inputs">
                <input 
                  type="time" 
                  value={heures.ouverture}
                  onChange={(e) => handleHeureChange(jour, 'ouverture', e.target.value)}
                />
                <span>à</span>
                <input 
                  type="time" 
                  value={heures.fermeture}
                  onChange={(e) => handleHeureChange(jour, 'fermeture', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="parametres-section">
        <h2>Sections du restaurant</h2>
        
        <div className="sections-container">
          {restaurantInfo.sections.map(section => (
            <div key={section} className="section-item">
              <span>{section}</span>
              <button 
                className="btn-supprimer" 
                onClick={() => handleSupprimerSection(section)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        <div className="section-add">
          <input 
            type="text" 
            value={nouvelleSection}
            onChange={(e) => setNouvelleSection(e.target.value)}
            placeholder="Nouvelle section..."
          />
          <button onClick={handleAjouterSection}>Ajouter</button>
        </div>
      </div>
      
      <div className="parametres-section">
        <h2>Exportation et sauvegarde</h2>
        
        <div className="actions-container">
          <button onClick={handleExport} className="btn-exporter">
            Exporter les données
          </button>
          
          <button onClick={handleSave} className="btn-sauvegarder">
            Sauvegarder les paramètres
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParametresView;
