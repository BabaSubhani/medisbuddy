import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import BASE_URL from '../../config/api';
import './MedicationForm.css';

const MedicationForm = ({ medication, onClose, onSuccess }) => {
  const isEditing = !!medication;
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    name: medication?.name || '',
    dosage: medication?.dosage || '',
    frequency: medication?.frequency || '',
    instructions: medication?.instructions || '',
  });

  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: async (data) => {
      const url = isEditing
        ? `${BASE_URL}/api/meds/${medication.id}`
        : `${BASE_URL}/api/meds`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...data, userId: user.id }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save medication');
      }

      return res.json();
    },
    onSuccess,
    onError: (err) => setErrors({ general: err.message }),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name required';
    if (!formData.dosage.trim()) newErrors.dosage = 'Dosage required';
    if (!formData.frequency.trim()) newErrors.frequency = 'Frequency required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate(formData);
  };

  return (
    <div className="medication-form-overlay">
      <div className="medication-form">
        <div className="medication-form__header">
          <h2>{isEditing ? 'Edit Medication' : 'Add Medication'}</h2>
          <button onClick={onClose}>X</button>
        </div>

        <form onSubmit={handleSubmit} className="medication-form__form">
          <label>
            Medication Name:
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </label>

          <label>
            Dosage:
            <input
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              className={errors.dosage ? 'error' : ''}
            />
            {errors.dosage && <span className="error-msg">{errors.dosage}</span>}
          </label>

          <label>
            Frequency:
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className={errors.frequency ? 'error' : ''}
            >
              <option value="">Select</option>
              <option value="Once daily">Once daily</option>
              <option value="Twice daily">Twice daily</option>
              <option value="Weekly">Weekly</option>
            </select>
            {errors.frequency && <span className="error-msg">{errors.frequency}</span>}
          </label>

          <label>
            Instructions (optional):
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
            />
          </label>

          {errors.general && <div className="error-msg">{errors.general}</div>}

          <div className="medication-form__actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={mutation.isPending}>
              {isEditing ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicationForm;
