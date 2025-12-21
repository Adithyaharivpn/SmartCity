import React, { useState } from "react";
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Navbar from "./Navbar";

const Grievance = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || formData.name.length < 2) return setError('Please provide your name');
    if (!formData.subject || formData.subject.length < 3) return setError('Please provide a subject');
    if (!formData.description || formData.description.length < 5) return setError('Please provide a detailed description');

    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const resp = await axios.post('http://localhost:3000/api/grievance', formData, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      setSuccess(resp.data?.message || 'Grievance submitted');
      setFormData({ name: "", email: "", subject: "", description: "" });
    } catch (err) {
      console.error('Grievance submit error', err);
      const msg = err?.response?.data?.message || 'Submission failed. Please try again.';
      setError(msg);
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh' }}>
      <Navbar />

      <Box sx={{ py: 8, px: { xs: 2, md: 6 } }}>
        <Typography variant="h4" color="primary" align="center" sx={{ fontWeight: 'bold', mb: 4 }}>Grievance Redressal</Typography>

        <Paper elevation={4} sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Submit a grievance</Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Full name" name="name" value={formData.name} onChange={handleChange} required fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth />
              </Grid>

              <Grid item xs={12}>
                <TextField label="Subject" name="subject" value={formData.subject} onChange={handleChange} required fullWidth />
              </Grid>

              <Grid item xs={12}>
                <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth multiline rows={5} required />
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
                <Button type="submit" variant="contained" color="secondary" startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SendIcon />} disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Grievance'}
                </Button>
                <Button variant="outlined" color="inherit" onClick={() => setFormData({ name: "", email: "", subject: "", description: "" })}>Reset</Button>
              </Grid>
            </Grid>
          </Box>

          {success && (
            <Snackbar open autoHideDuration={4500} onClose={() => setSuccess('')}>
              <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }} icon={<CheckCircleOutlineIcon />}>{success}</Alert>
            </Snackbar>
          )}

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Paper>
      </Box>
    </Box>
  );
};

export default Grievance;