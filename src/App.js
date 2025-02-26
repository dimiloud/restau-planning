import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { PlanningProvider } from './store/PlanningContext';
import TableauDeBord from './components/TableauDeBord';
import PersonnelList from './components/PersonnelList';
import ParametresView from './views/ParametresView';
import PrevisionsView from './views/PrevisionsView';
import './App.css';

/**
 * Composant principal de l'application
 */
function App() {
  return (
    <PlanningProvider>
      <Router>
        <div className="app">
          <header className="app-header">
            <div className="logo">
              <h1>RestauPlanning</h1>
            </div>
            <nav className="app-nav">
              <Link to="/" className="nav-link">Tableau de bord</Link>
              <Link to="/personnel" className="nav-link">Personnel</Link>
              <Link to="/previsions" className="nav-link">Prévisions</Link>
              <Link to="/parametres" className="nav-link">Paramètres</Link>
            </nav>
          </header>
          
          <main className="app-content">
            <Routes>
              <Route path="/" element={<TableauDeBordView />} />
              <Route path="/personnel" element={<PersonnelView />} />
              <Route path="/previsions" element={<PrevisionsView />} />
              <Route path="/parametres" element={<ParametresView />} />
            </Routes>
          </main>
          
          <footer className="app-footer">
            <p>&copy; {new Date().getFullYear()} RestauPlanning - Application de gestion des horaires pour restaurants</p>
          </footer>
        </div>
      </Router>
    </PlanningProvider>
  );
}

/**
 * Vue du tableau de bord
 */
function TableauDeBordView() {
  const { donnees, setDateSelectionnee } = usePlanningContext();
  
  return (
    <div className="view">
      <TableauDeBord 
        donnees={donnees}
        onChangerDate={setDateSelectionnee}
      />
    </div>
  );
}

/**
 * Vue de gestion du personnel
 */
function PersonnelView() {
  const { donnees, ajouterEmploye, modifierEmploye, supprimerEmploye } = usePlanningContext();
  
  return (
    <div className="view">
      <h1>Gestion du Personnel</h1>
      <PersonnelList 
        personnel={donnees.personnel}
        onAjouterEmploye={ajouterEmploye}
        onModifierEmploye={modifierEmploye}
        onSupprimerEmploye={supprimerEmploye}
      />
    </div>
  );
}

export default App;
