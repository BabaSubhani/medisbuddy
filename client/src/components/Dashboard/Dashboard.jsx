import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PatientDashboard from '../PatientDashboard/PatientDashboard';
import CaretakerDashboard from '../CaretakerDashboard/CaretakerDashboard';
import Header from '../Header/Header';
import './Dashboard.css';

const Dashboard = () => {
  const { isPatient } = useAuth();

  return (
    <div className="dashboard">
      <Header />
      <main className="dashboard__main">
        {isPatient() ? <PatientDashboard /> : <CaretakerDashboard />}
      </main>
    </div>
  );
};

export default Dashboard;