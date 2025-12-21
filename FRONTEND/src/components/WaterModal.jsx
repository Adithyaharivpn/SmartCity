import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, CircularProgress, Alert, Box } from '@mui/material';
import axios from 'axios';

const WaterModal = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', issueType: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError('');
    if (!formData.name || !formData.address || !formData.issueType) return setError('Please fill required fields');
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await axios.post('http://localhost:3000/api/water', formData, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      onSuccess && onSuccess(res.data);
      setFormData({ name: '', email: '', phone: '', address: '', issueType: '', description: '' });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Submission failed');
    } finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Report Water Issue</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
          <TextField label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
          <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
          <TextField label="Email" name="email" value={formData.email} onChange={handleChange} />
          <TextField label="Address" name="address" value={formData.address} onChange={handleChange} required />
          <TextField select label="Issue Type" name="issueType" value={formData.issueType} onChange={handleChange}>
            <MenuItem value="leak">Leak</MenuItem>
            <MenuItem value="supply">Supply Interruption</MenuItem>
            <MenuItem value="quality">Water Quality</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
          <TextField label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={3} />
        </Box>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}> {loading ? <CircularProgress size={18} color="inherit"/> : 'Submit'} </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WaterModal;
