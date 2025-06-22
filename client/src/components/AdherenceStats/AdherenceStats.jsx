import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import BASE_URL from '../../config/api'; 
import './AdherenceStats.css';

const AdherenceStats = ({ medications }) => {
  const { token } = useAuth();

  const { data: allLogs = [], isLoading } = useQuery({
    queryKey: ['all-medication-logs', medications.map(m => m.id)],
    queryFn: async () => {
      const logPromises = medications.map(async (med) => {
        const response = await fetch(`${BASE_URL}/api/meds/${med.id}/logs?days=30`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch logs for ${med.name}`);
        }

        const logs = await response.json();
        return { medication: med, logs };
      });

      return Promise.all(logPromises);
    },
    enabled: !!token && medications.length > 0,
  });

  if (isLoading) {
    return (
      <div className="adherence-stats__loading">
        <LoadingSpinner size="large" />
        <p>Loading adherence statistics...</p>
      </div>
    );
  }

  if (medications.length === 0) {
    return (
      <div className="adherence-stats__empty">
        <BarChart3 className="adherence-stats__empty-icon" />
        <h3>No Statistics Available</h3>
        <p>Add medications to view your adherence statistics.</p>
      </div>
    );
  }

  const totalDays = 30;
  const totalPossibleDoses = medications.length * totalDays;
  const totalActualDoses = allLogs.reduce((sum, { logs }) => sum + logs.length, 0);
  const overallAdherence = totalPossibleDoses > 0 ? Math.round((totalActualDoses / totalPossibleDoses) * 100) : 0;

  return (
    <div className="adherence-stats">
      <div className="adherence-stats__overview">
        <div className="adherence-stats__card adherence-stats__card--primary">
          <div className="adherence-stats__card-header">
            <BarChart3 className="adherence-stats__card-icon" />
            <h3>30-Day Adherence</h3>
          </div>
          <div className="adherence-stats__card-value">
            {overallAdherence}%
          </div>
          <div className="adherence-stats__card-subtitle">
            {totalActualDoses} of {totalPossibleDoses} doses taken
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdherenceStats;
