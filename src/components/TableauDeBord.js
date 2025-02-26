import React, { useState, useEffect } from 'react';
import { formaterDate, getJourSemaine, getCongesAVenir } from '../utils/planningUtils';
import PlanningHebdomadaire from './PlanningHebdomadaire';
import AlertesComponent from './AlertesComponent';
import './TableauDeBord.css';

/**
 * Composant de tableau de bord principal
 * Affiche une vue d'ensemble du restaurant, le planning et les alertes
 * 
 * @param {Object} props.donnees - Données globales de l'application 
 * @param {Function} props.onChangerDate - Fonction appelée lors du changement de date
 */
const TableauDeBord = ({ donnees, onChangerDate }) => {
  const [semaineAffichee, setSemaineAffichee] = useState(donnees.plannings.semaineActuelle);
  const [dateSelectionnee, setDateSelectionnee] = useState(formaterDate(new Date()));
  
  // Mettre à jour la date sélectionnée quand elle change
  useEffect(() => {
    if (onChangerDate) {
      onChangerDate(dateSelectionnee);
    }
  }, [dateSelectionnee, onChangerDate]);

  // Fonctions pour naviguer entre les semaines
  const semainePrecedente = () => {
    const date = new Date(semaineAffichee);
    date.setDate(date.getDate() - 7);
    setSemaineAffichee(formaterDate(date));
  };

  const semaineSuivante = () => {
    const date = new Date(semaineAffichee);
    date.setDate(date.getDate() + 7);
    setSemaineAffichee(formaterDate(date));
  };

  // Filtrer les services pour la semaine en cours
  const servicesHebdomadaires = React.useMemo(() => {
    const dateDebut = new Date(semaineAffichee);
    const dateFin = new Date(dateDebut);
    dateFin.setDate(dateDebut.getDate() + 6);
    const dateFinStr = formaterDate(dateFin);
    
    return donnees.plannings.services.filter(
      service => service.date >= semaineAffichee && service.date <= dateFinStr
    );
  }, [donnees.plannings.services, semaineAffichee]);

  // Compter les services par poste pour cette semaine
  const servicesParPoste = servicesHebdomadaires.reduce((acc, service) => {
    acc[service.poste] = (acc[service.poste] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="tableau-bord">
      <h1>{donnees.restaurant.nom} - Tableau de bord</h1>
      
      <div className="date-selecteur">
        <button onClick={semainePrecedente} className="btn-navigation">◀</button>
        <span>Semaine du {semaineAffichee}</span>
        <button onClick={semaineSuivante} className="btn-navigation">▶</button>
      </div>
      
      <div className="statistiques">
        <div className="stat-card">
          <h3>Personnel</h3>
          <p>{donnees.personnel.length} employés</p>
        </div>
        <div className="stat-card">
          <h3>Services cette semaine</h3>
          <p>{servicesHebdomadaires.length} services</p>
        </div>
        <div className="stat-card">
          <h3>Répartition des postes</h3>
          <ul>
            {Object.entries(servicesParPoste).map(([poste, nombre]) => (
              <li key={poste}>
                {poste}: {nombre} services
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <PlanningHebdomadaire 
        semaine={semaineAffichee} 
        donnees={donnees}
        onSelectDate={setDateSelectionnee}
      />
      
      <AlertesComponent donnees={donnees} />
    </div>
  );
};

export default TableauDeBord;
