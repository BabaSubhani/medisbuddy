import React from 'react';
import { Users, Calendar, BarChart3 } from 'lucide-react';
import './CaretakerDashboard.css';

const CaretakerDashboard = () => {
  return (
    <div className="caretaker-dashboard">
      <div className="caretaker-dashboard__header">
        <h1 className="caretaker-dashboard__title">Caretaker Dashboard</h1>
      </div>

      <div className="caretaker-dashboard__content">
        <div className="caretaker-dashboard__coming-soon">
          <div className="caretaker-dashboard__icon">
            <Users />
          </div>
          <h2>Multi-Patient Management</h2>
          <p>
            The caretaker dashboard for managing multiple patients is coming soon. 
            This feature will include patient assignment, medication oversight, 
            and adherence monitoring across all your patients.
          </p>
          <div className="caretaker-dashboard__features">
            <div className="caretaker-dashboard__feature">
              <Users className="feature-icon" />
              <span>Patient Management</span>
            </div>
            <div className="caretaker-dashboard__feature">
              <Calendar className="feature-icon" />
              <span>Medication Oversight</span>
            </div>
            <div className="caretaker-dashboard__feature">
              <BarChart3 className="feature-icon" />
              <span>Adherence Reports</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaretakerDashboard;