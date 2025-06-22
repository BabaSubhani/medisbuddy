import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../database.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'medsbuddy_secret_key';

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    req.user = user;
    next();
  });
};

// Get medications
router.get('/:userId', authenticateToken, (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (req.user.userId !== userId && req.user.role !== 'caretaker') {
    return res.status(403).json({ error: 'Access denied' });
  }

  db.all(
    'SELECT * FROM medications WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, medications) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(medications);
    }
  );
});

// Add medication
router.post('/', authenticateToken, (req, res) => {
  const { name, dosage, frequency, instructions, userId } = req.body;

  if (!name || !dosage || !frequency) {
    return res.status(400).json({ error: 'Name, dosage, and frequency are required' });
  }

  db.run(
    'INSERT INTO medications (user_id, name, dosage, frequency, instructions) VALUES (?, ?, ?, ?, ?)',
    [userId, name, dosage, frequency, instructions],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to add medication' });

      db.get(
        'SELECT * FROM medications WHERE id = ?',
        [this.lastID],
        (err, medication) => {
          if (err) return res.status(500).json({ error: 'Database error' });
          res.status(201).json(medication);
        }
      );
    }
  );
});

// Update medication
router.put('/:medId', authenticateToken, (req, res) => {
  const medId = parseInt(req.params.medId, 10);
  const { name, dosage, frequency, instructions } = req.body;

  db.run(
    'UPDATE medications SET name = ?, dosage = ?, frequency = ?, instructions = ? WHERE id = ?',
    [name, dosage, frequency, instructions, medId],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to update medication' });

      if (this.changes === 0) return res.status(404).json({ error: 'Medication not found' });

      db.get(
        'SELECT * FROM medications WHERE id = ?',
        [medId],
        (err, medication) => {
          if (err) return res.status(500).json({ error: 'Database error' });
          res.json(medication);
        }
      );
    }
  );
});

// Delete medication
router.delete('/:medId', authenticateToken, (req, res) => {
  const medId = parseInt(req.params.medId, 10);

  db.run('DELETE FROM medications WHERE id = ?', [medId], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to delete medication' });

    if (this.changes === 0) return res.status(404).json({ error: 'Medication not found' });

    res.json({ message: 'Deleted successfully' });
  });
});

// Log medication taken
router.post('/:medId/log', authenticateToken, (req, res) => {
  const medId = parseInt(req.params.medId, 10);
  const { notes } = req.body;
  const date = new Date().toISOString().split('T')[0];

  db.run(
    'INSERT INTO medication_logs (medication_id, date, notes) VALUES (?, ?, ?)',
    [medId, date, notes],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to log medication' });

      db.get(
        'SELECT * FROM medication_logs WHERE id = ?',
        [this.lastID],
        (err, log) => {
          if (err) return res.status(500).json({ error: 'Database error' });
          res.status(201).json(log);
        }
      );
    }
  );
});

// Get logs for a medication
router.get('/:medId/logs', authenticateToken, (req, res) => {
  const medId = parseInt(req.params.medId, 10);
  const days = parseInt(req.query.days || '7', 10);

  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - days);
  const pastDateString = pastDate.toISOString().split('T')[0];

  db.all(
    'SELECT * FROM medication_logs WHERE medication_id = ? AND date >= ? ORDER BY taken_at DESC',
    [medId, pastDateString],
    (err, logs) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(logs);
    }
  );
});

export default router;
