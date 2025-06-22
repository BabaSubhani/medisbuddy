import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import MedicationCard from '../MedicationCard/MedicationCard';
import MedicationForm from '../MedicationForm/MedicationForm';
import AdherenceStats from '../AdherenceStats/AdherenceStats';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import BASE_URL from '../../config/api';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [activeTab, setActiveTab] = useState('medications');
  const { user, token } = useAuth();

  const { data: medications = [], isLoading, refetch } = useQuery({
    queryKey: ['medications', user?.id],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/api/meds/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch medications');
      return response.json();
    },
    enabled: !!user?.id && !!token,
  });

  const handleMedicationAdded = () => {
    refetch();
    setShowMedicationForm(false);
  };

  if (isLoading) {
    return (
      <div className="patient-dashboard__loading">
        <LoadingSpinner size="large" />
        <p>Loading medications...</p>
      </div>
    );
  }

  return (
    <div className="patient-dashboard">
      <div className="patient-dashboard__header">
        <h1>My Medications</h1>
        <button onClick={() => setShowMedicationForm(true)}>Add Medication</button>
      </div>

      <div className="patient-dashboard__tabs">
        <button
          className={activeTab === 'medications' ? 'active' : ''}
          onClick={() => setActiveTab('medications')}
        >
          Medications
        </button>
        <button
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
        >
          Adherence
        </button>
      </div>

      <div className="patient-dashboard__content">
        {activeTab === 'medications' && (
          <div className="patient-dashboard__medications">
            {medications.length === 0 ? (
              <div className="patient-dashboard__empty">
                <h3>No medications yet</h3>
                <p>Add your first medication to start tracking.</p>
                <button onClick={() => setShowMedicationForm(true)}>Add Medication</button>
              </div>
            ) : (
              <div className="patient-dashboard__medications-grid">
                {medications.map((med) => (
                  <MedicationCard key={med.id} medication={med} onUpdate={refetch} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <AdherenceStats medications={medications} />
        )}
      </div>

      {showMedicationForm && (
        <MedicationForm
          onClose={() => setShowMedicationForm(false)}
          onSuccess={handleMedicationAdded}
        />
      )}
    </div>
  );
};

export default PatientDashboard;
