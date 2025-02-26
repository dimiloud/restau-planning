import React, { useState } from 'react';
import './PersonnelList.css';

/**
 * Composant de liste du personnel
 * Affiche la liste des employés et permet leur gestion
 * 
 * @param {Object} props
 * @param {Array} props.personnel - Liste des employés
 * @param {Function} props.onAjouterEmploye - Fonction appelée lors de l'ajout d'un employé
 * @param {Function} props.onModifierEmploye - Fonction appelée lors de la modification d'un employé
 * @param {Function} props.onSupprimerEmploye - Fonction appelée lors de la suppression d'un employé
 */
const PersonnelList = ({ personnel, onAjouterEmploye, onModifierEmploye, onSupprimerEmploye }) => {
  const [showModal, setShowModal] = useState(false);
  const [employeSelectionne, setEmployeSelectionne] = useState(null);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    telephone: '',
    email: '',
    poste: [],
    contrat: {
      type: 'CDI',
      heuresHebdo: 35,
      dateDebut: ''
    },
    competences: [],
    disponibilites: {
      lundi: { disponible: true, heuresPreferees: [] },
      mardi: { disponible: true, heuresPreferees: [] },
      mercredi: { disponible: true, heuresPreferees: [] },
      jeudi: { disponible: true, heuresPreferees: [] },
      vendredi: { disponible: true, heuresPreferees: [] },
      samedi: { disponible: false, heuresPreferees: [] },
      dimanche: { disponible: false, heuresPreferees: [] }
    },
    conges: []
  });

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      prenom: '',
      nom: '',
      telephone: '',
      email: '',
      poste: [],
      contrat: {
        type: 'CDI',
        heuresHebdo: 35,
        dateDebut: ''
      },
      competences: [],
      disponibilites: {
        lundi: { disponible: true, heuresPreferees: [] },
        mardi: { disponible: true, heuresPreferees: [] },
        mercredi: { disponible: true, heuresPreferees: [] },
        jeudi: { disponible: true, heuresPreferees: [] },
        vendredi: { disponible: true, heuresPreferees: [] },
        samedi: { disponible: false, heuresPreferees: [] },
        dimanche: { disponible: false, heuresPreferees: [] }
      },
      conges: []
    });
  };

  // Ouvrir le modal pour ajouter un employé
  const handleAjouterEmploye = () => {
    setEmployeSelectionne(null);
    resetForm();
    setShowModal(true);
  };

  // Ouvrir le modal pour modifier un employé
  const handleModifierEmploye = (employe) => {
    setEmployeSelectionne(employe);
    setFormData({
      ...employe
    });
    setShowModal(true);
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (employeSelectionne) {
      onModifierEmploye(employeSelectionne.id, formData);
    } else {
      onAjouterEmploye(formData);
    }
    
    setShowModal(false);
  };

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Gérer les changements de postes (checkboxes)
  const handlePosteChange = (poste) => {
    setFormData(prev => {
      const newPostes = prev.poste.includes(poste)
        ? prev.poste.filter(p => p !== poste)
        : [...prev.poste, poste];
      
      return {
        ...prev,
        poste: newPostes
      };
    });
  };

  // Gérer les changements de disponibilité
  const handleDisponibiliteChange = (jour, disponible) => {
    setFormData(prev => ({
      ...prev,
      disponibilites: {
        ...prev.disponibilites,
        [jour]: {
          ...prev.disponibilites[jour],
          disponible
        }
      }
    }));
  };

  return (
    <div className="personnel-list">
      <div className="personnel-header">
        <h2>Liste du Personnel</h2>
        <button className="btn-ajouter" onClick={handleAjouterEmploye}>+ Ajouter un employé</button>
      </div>
      
      <div className="list-container">
        {personnel && personnel.length > 0 ? (
          personnel.map(employe => (
            <div key={employe.id} className="employe-card">
              <div className="employe-header">
                <h3>{employe.prenom} {employe.nom}</h3>
                <div className="employe-postes">
                  {employe.poste.map(p => <span key={p} className="poste-badge">{p}</span>)}
                </div>
              </div>
              
              <div className="employe-details">
                <p><i className="icon-phone"></i> {employe.telephone}</p>
                <p><i className="icon-email"></i> {employe.email}</p>
                <p><i className="icon-contract"></i> {employe.contrat.type} - {employe.contrat.heuresHebdo}h/semaine</p>
              </div>
              
              <div className="employe-actions">
                <button onClick={() => handleModifierEmploye(employe)}>Modifier</button>
                <button onClick={() => onSupprimerEmploye && onSupprimerEmploye(employe.id)}>Supprimer</button>
              </div>
            </div>
          ))
        ) : (
          <div className="aucun-employe">
            Aucun employé enregistré. Cliquez sur "Ajouter un employé" pour commencer.
          </div>
        )}
      </div>
      
      {/* Modal pour ajouter/modifier un employé */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{employeSelectionne ? 'Modifier' : 'Ajouter'} un employé</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Prénom</label>
                <input 
                  type="text" 
                  name="prenom" 
                  value={formData.prenom}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Nom</label>
                <input 
                  type="text" 
                  name="nom" 
                  value={formData.nom}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Téléphone</label>
                <input 
                  type="tel" 
                  name="telephone" 
                  value={formData.telephone}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Type de contrat</label>
                <select 
                  name="contrat.type"
                  value={formData.contrat.type}
                  onChange={handleInputChange}
                >
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="Temps partiel">Temps partiel</option>
                  <option value="Extra">Extra</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Heures hebdomadaires</label>
                <input 
                  type="number" 
                  name="contrat.heuresHebdo" 
                  value={formData.contrat.heuresHebdo}
                  onChange={handleInputChange}
                  min="0"
                  max="50"
                />
              </div>
              
              <div className="form-group">
                <label>Date de début</label>
                <input 
                  type="date" 
                  name="contrat.dateDebut" 
                  value={formData.contrat.dateDebut}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>Postes</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={formData.poste.includes('Cuisine')}
                      onChange={() => handlePosteChange('Cuisine')}
                    />
                    Cuisine
                  </label>
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={formData.poste.includes('Service')}
                      onChange={() => handlePosteChange('Service')}
                    />
                    Service
                  </label>
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={formData.poste.includes('Bar')}
                      onChange={() => handlePosteChange('Bar')}
                    />
                    Bar
                  </label>
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={formData.poste.includes('Accueil')}
                      onChange={() => handlePosteChange('Accueil')}
                    />
                    Accueil
                  </label>
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={formData.poste.includes('Nettoyage')}
                      onChange={() => handlePosteChange('Nettoyage')}
                    />
                    Nettoyage
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <label>Disponibilités</label>
                <div className="disponibilites-group">
                  {Object.keys(formData.disponibilites).map(jour => (
                    <div key={jour} className="disponibilite-item">
                      <label className="checkbox-label">
                        <input 
                          type="checkbox"
                          checked={formData.disponibilites[jour].disponible}
                          onChange={() => handleDisponibiliteChange(jour, !formData.disponibilites[jour].disponible)}
                        />
                        {jour.charAt(0).toUpperCase() + jour.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-annuler">
                  Annuler
                </button>
                <button type="submit" className="btn-enregistrer">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonnelList;
