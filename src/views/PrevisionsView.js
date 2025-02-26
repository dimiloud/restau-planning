import React, { useState } from 'react';
import { usePlanningContext } from '../store/PlanningContext';
import { formaterDate } from '../utils/planningUtils';
import './PrevisionsView.css';

/**
 * Vue des prévisions d'activité
 * Permet de visualiser et modifier les prévisions d'activité
 */
const PrevisionsView = () => {
  const { donnees, ajouterEvenementSpecial } = usePlanningContext();
  
  const [activeTab, setActiveTab] = useState('typiques');
  const [newEvent, setNewEvent] = useState({
    date: formaterDate(new Date()),
    description: '',
    volumeClients: 'Elevé',
    personnelNecessaire: {
      "Cuisine": 3,
      "Service": 4,
      "Bar": 2,
      "Accueil": 1,
      "Nettoyage": 1
    }
  });
  
  // Valeurs possibles pour le volume de clients
  const volumeOptions = [
    'Faible',
    'Moyen',
    'Elevé',
    'Très Elevé',
    'Exceptionnel'
  ];
  
  // Gérer les changements dans le formulaire d'événement
  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Gérer les changements dans le personnel nécessaire
  const handlePersonnelChange = (section, value) => {
    setNewEvent(prev => ({
      ...prev,
      personnelNecessaire: {
        ...prev.personnelNecessaire,
        [section]: parseInt(value, 10)
      }
    }));
  };
  
  // Ajouter un nouvel événement spécial
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (newEvent.description && newEvent.date) {
      ajouterEvenementSpecial(newEvent);
      
      // Réinitialiser le formulaire
      setNewEvent({
        date: formaterDate(new Date()),
        description: '',
        volumeClients: 'Elevé',
        personnelNecessaire: {
          "Cuisine": 3,
          "Service": 4,
          "Bar": 2,
          "Accueil": 1,
          "Nettoyage": 1
        }
      });
    }
  };
  
  return (
    <div className="previsions-view">
      <h1>Prévisions d'activité</h1>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'typiques' ? 'active' : ''}`} 
          onClick={() => setActiveTab('typiques')}
        >
          Prévisions typiques
        </button>
        <button 
          className={`tab ${activeTab === 'evenements' ? 'active' : ''}`} 
          onClick={() => setActiveTab('evenements')}
        >
          Événements spéciaux
        </button>
      </div>
      
      {activeTab === 'typiques' ? (
        <div className="previsions-typiques">
          <p className="info-text">
            Ces prévisions sont utilisées pour générer automatiquement les plannings en fonction des jours de la semaine.
          </p>
          
          <div className="jours-container">
            {Object.entries(donnees.previsions.typiques).map(([jour, services]) => (
              <div key={jour} className="jour-prevision">
                <h3>{jour.charAt(0).toUpperCase() + jour.slice(1)}</h3>
                
                <div className="services-container">
                  {Object.entries(services).map(([service, details]) => (
                    <div key={service} className="service-prevision">
                      <div className="service-header">
                        <h4>{service === 'dejeuner' ? 'Déjeuner' : 'Dîner'}</h4>
                        <span className={`volume-badge ${details.volumeClients.toLowerCase().replace(' ', '-')}`}>
                          {details.volumeClients}
                        </span>
                      </div>
                      
                      <div className="personnel-necessaire">
                        <h5>Personnel nécessaire:</h5>
                        <ul>
                          {Object.entries(details.personnelNecessaire).map(([poste, nombre]) => (
                            <li key={poste}>
                              <span className="poste">{poste}:</span>
                              <span className="nombre">{nombre}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="evenements-speciaux">
          <div className="evenements-list">
            <h3>Événements programmés</h3>
            
            {donnees.previsions.evenementsSpeciaux.length > 0 ? (
              <div className="evenements-container">
                {donnees.previsions.evenementsSpeciaux.map((event, index) => (
                  <div key={index} className="evenement-item">
                    <div className="evenement-header">
                      <h4>{event.description}</h4>
                      <span className={`volume-badge ${event.volumeClients.toLowerCase().replace(' ', '-')}`}>
                        {event.volumeClients}
                      </span>
                    </div>
                    
                    <div className="evenement-date">
                      {event.date}
                    </div>
                    
                    <div className="personnel-necessaire">
                      <h5>Personnel nécessaire:</h5>
                      <ul>
                        {Object.entries(event.personnelNecessaire).map(([poste, nombre]) => (
                          <li key={poste}>
                            <span className="poste">{poste}:</span>
                            <span className="nombre">{nombre}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="aucun-evenement">
                Aucun événement spécial programmé. Utilisez le formulaire ci-dessous pour en ajouter.
              </div>
            )}
          </div>
          
          <div className="nouvel-evenement">
            <h3>Ajouter un événement</h3>
            
            <form onSubmit={handleAddEvent}>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input 
                    type="date" 
                    name="date" 
                    value={newEvent.date}
                    onChange={handleEventChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Volume de clients</label>
                  <select 
                    name="volumeClients" 
                    value={newEvent.volumeClients}
                    onChange={handleEventChange}
                  >
                    {volumeOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <input 
                  type="text" 
                  name="description" 
                  value={newEvent.description}
                  onChange={handleEventChange}
                  placeholder="Ex: Saint-Valentin, Soirée concert, etc."
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Personnel nécessaire</label>
                <div className="personnel-inputs">
                  {Object.entries(newEvent.personnelNecessaire).map(([section, nombre]) => (
                    <div key={section} className="personnel-input">
                      <label>{section}</label>
                      <input 
                        type="number" 
                        min="0" 
                        max="10"
                        value={nombre}
                        onChange={(e) => handlePersonnelChange(section, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn-ajouter">
                  Ajouter l'événement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrevisionsView;
