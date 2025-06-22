import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Check, Edit, Trash2, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import MedicationForm from '../MedicationForm/MedicationForm';
import BASE_URL from '../../config/api';
import './MedicationCard.css';

const MedicationCard = ({ medication, onUpdate }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const { token } = useAuth();

  const { data: logs = [], refetch: refetchLogs } = useQuery({
    queryKey: ['medication-logs', medication.id],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/api/meds/${medication.id}/logs?days=7`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch logs');
      return res.json();
    },
    enabled: !!token,
  });

  const logMedicationMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${BASE_URL}/api/meds/${medication.id}/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes: '' }),
      });
      if (!res.ok) throw new Error('Failed to log medication');
      return res.json();
    },
    onSuccess: () => refetchLogs(),
  });

  const deleteMedicationMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${BASE_URL}/api/meds/${medication.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete medication');
      return res.json();
    },
    onSuccess: onUpdate,
  });

  const today = new Date().toISOString().split('T')[0];
  const takenToday = logs.some(log => log.date === today);
  const adherencePercentage = logs.length > 0 ? Math.round((logs.length / 7) * 100) : 0;

  return (
    <>
      <div className="medication-card">
        <h3>{medication.name}</h3>
        <p>Dosage: {medication.dosage}</p>
        <p>Frequency: {medication.frequency}</p>

        {medication.instructions && (
          <p>Instructions: {medication.instructions}</p>
        )}

        <p>7-Day Adherence: {adherencePercentage}%</p>

        <div className="medication-card__actions">
          {!takenToday ? (
            <button onClick={() => logMedicationMutation.mutate()} disabled={logMedicationMutation.isPending}>
              <Clock /> Mark as Taken
            </button>
          ) : (
            <div>
              <Check /> Taken Today
            </div>
          )}

          <button onClick={() => setShowEditForm(true)}><Edit /> Edit</button>
          <button onClick={() => deleteMedicationMutation.mutate()} disabled={deleteMedicationMutation.isPending}>
            <Trash2 /> Delete
          </button>
        </div>
      </div>

      {showEditForm && (
        <MedicationForm
          medication={medication}
          onClose={() => setShowEditForm(false)}
          onSuccess={() => {
            setShowEditForm(false);
            onUpdate();
          }}
        />
      )}
    </>
  );
};

export default MedicationCard;
