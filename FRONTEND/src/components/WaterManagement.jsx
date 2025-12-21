import React, { useState } from "react";
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Navbar from "./Navbar";

const WaterManagement = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", issueType: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || formData.name.length < 2) return setError('Please provide your name');
    if (!formData.address || formData.address.length < 5) return setError('Please provide a valid address');
    if (!formData.issueType) return setError('Please select an issue type');

    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const resp = await axios.post('http://localhost:3000/api/water', formData, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      setSuccess(resp.data?.message || 'Request submitted');
      setFormData({ name: "", email: "", phone: "", address: "", issueType: "", description: "" });
    } catch (err) {
      console.error('Water submit error', err);
      const msg = err?.response?.data?.message || 'Submission failed. Please try again.';
      setError(msg);
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{ bgcolor: '#f7fafc', minHeight: '100vh' }}>
      <Navbar />

      <Box sx={{ py: 8, px: { xs: 2, md: 6 } }}>
        <Typography variant="h4" color="primary" align="center" sx={{ fontWeight: 'bold', mb: 4 }}>Water Management</Typography>

        <Paper elevation={4} sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Report a Water Issue</Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Full name" name="name" value={formData.name} onChange={handleChange} required fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Address" name="address" value={formData.address} onChange={handleChange} required fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select label="Issue Type" name="issueType" value={formData.issueType} onChange={handleChange} fullWidth>
                  <MenuItem value="leak">Leak</MenuItem>
                  <MenuItem value="supply">Supply Interruption</MenuItem>
                  <MenuItem value="quality">Water Quality</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth multiline rows={4} />
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
                <Button type="submit" variant="contained" color="secondary" startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SendIcon />} disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Request'}
                </Button>
                <Button variant="outlined" color="inherit" onClick={() => setFormData({ name: "", email: "", phone: "", address: "", issueType: "", description: "" })}>Reset</Button>
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

export default WaterManagement;
