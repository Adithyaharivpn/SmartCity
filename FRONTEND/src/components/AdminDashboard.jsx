import React from "react";
import {
  Box,
  CssBaseline,
  Typography,
  createTheme,
  ThemeProvider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Paper,
  Stack,
  Select,
  MenuItem,
  Button,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Dashboard,
  DeleteOutline,
  Opacity,
  ReportProblem,
  People,
  Settings,
  Menu as MenuIcon,
} from "@mui/icons-material";
import Navbar from "./Navbar";

// 🎨 Same theme as other pagesss
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#009688" }, // Teal
    secondary: { main: "#ff7043" }, // Coral
    background: { default: "#f0f4f8" },
  },
  typography: { fontFamily: "Roboto, sans-serif" },
});

const drawerWidth = 240;

const AdminDashboard = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [tab, setTab] = React.useState('overview');
  const [wastes, setWastes] = React.useState([]);
  const [registrations, setRegistrations] = React.useState([]);
  const [logs, setLogs] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawer = (
    <Box sx={{ bgcolor: "#fff", height: "100%" }}>
      <Typography
        variant="h5"
        color="primary"
        sx={{ p: 2, fontWeight: "bold", textAlign: "center" }}
      >
        Admin Panel
      </Typography>
      <List>
        {[
          { key: 'overview', text: "Dashboard Overview", icon: <Dashboard /> },
          { key: 'waste', text: "Waste Management", icon: <DeleteOutline /> },
          { key: 'water', text: "Water Issues", icon: <Opacity /> },
          { key: 'grievances', text: "Grievances", icon: <ReportProblem /> },
          { key: 'registrations', text: "Registrations", icon: <People /> },
          { key: 'logs', text: "Activity Logs", icon: <ReportProblem /> },
          { key: 'settings', text: "Settings", icon: <Settings /> },
        ].map((item) => (
          <ListItem key={item.key} sx={{ "&:hover": { bgcolor: "rgba(0,150,136,0.05)", borderLeft: "4px solid #009688" } }}>
            <ListItemButton onClick={() => setTab(item.key)} selected={tab === item.key}>
              <ListItemIcon sx={{ color: "#009688" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  React.useEffect(() => {
    // fetch data when tab changes
    if (tab === 'waste') fetchWastes();
    if (tab === 'water') fetchWaters();
    if (tab === 'grievances') fetchGrievances();
    if (tab === 'registrations') fetchRegistrations();
    if (tab === 'logs') fetchLogs();
    if (tab === 'overview') fetchOverview();
  }, [tab]);

  // Overview state and fetch
  const [overview, setOverview] = React.useState({ wasteCount: 0, registrationCount: 0, userCount: 0, recentWastes: [], recentRegs: [], recentLogs: [] });
  const [overviewLoading, setOverviewLoading] = React.useState(false);

  const fetchOverview = async () => {
    try {
      setOverviewLoading(true);
      const [wRes, rRes, uRes, lRes] = await Promise.all([
        fetch('http://localhost:3000/api/waste', { headers: getAuthHeaders() }),
        fetch('http://localhost:3000/api/registrations', { headers: getAuthHeaders() }),
        fetch('http://localhost:3000/api/users', { headers: getAuthHeaders() }),
        fetch('http://localhost:3000/api/logs', { headers: getAuthHeaders() }),
      ]);

      if (!wRes.ok || !rRes.ok || !uRes.ok || !lRes.ok) {
        // If unauthorized, inform admin
        if ([wRes.status, rRes.status, uRes.status, lRes.status].some(s => s === 401 || s === 403)) {
          alert('Admin access required. Please log in as an admin.');
          return;
        }
        throw new Error('Failed to fetch overview data');
      }

      const [wData, rData, uData, lData] = await Promise.all([wRes.json(), rRes.json(), uRes.json(), lRes.json()]);

      setOverview({
        wasteCount: wData.length || 0,
        registrationCount: rData.length || 0,
        userCount: uData.length || 0,
        recentWastes: wData.slice(0, 5),
        recentRegs: rData.slice(0, 5),
        recentLogs: lData.slice(0, 8),
      });
    } catch (err) {
      console.error('fetch overview', err);
    } finally {
      setOverviewLoading(false);
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
  };

  const fetchWastes = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/waste', { headers: getAuthHeaders() });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) return alert('Admin access required. Please log in as an admin.');
        throw new Error('Failed to fetch wastes');
      }
      const data = await res.json();
      setWastes(data);
    } catch (err) {
      console.error('fetch wastes', err);
    } finally {
      setLoading(false);
    }
  };

  // Water
  const [waters, setWaters] = React.useState([]);
  const fetchWaters = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/water', { headers: getAuthHeaders() });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) return alert('Admin access required. Please log in as an admin.');
        throw new Error('Failed to fetch water requests');
      }
      const data = await res.json();
      setWaters(data);
    } catch (err) {
      console.error('fetch waters', err);
    } finally {
      setLoading(false);
    }
  };

  const updateWaterStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:3000/api/water/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ status }) });
      if (!res.ok) return alert('Failed to update water request. Admin access required.');
      fetchWaters();
    } catch (err) {
      console.error('update water', err);
    }
  };

  const deleteWater = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/water/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      if (!res.ok) return alert('Failed to delete. Admin access required.');
      fetchWaters();
    } catch (err) {
      console.error('delete water', err);
    }
  };

  // Grievances
  const [grievances, setGrievances] = React.useState([]);
  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/grievance', { headers: getAuthHeaders() });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) return alert('Admin access required. Please log in as an admin.');
        throw new Error('Failed to fetch grievances');
      }
      const data = await res.json();
      setGrievances(data);
    } catch (err) {
      console.error('fetch grievances', err);
    } finally {
      setLoading(false);
    }
  };

  const updateGrievanceStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:3000/api/grievance/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ status }) });
      if (!res.ok) return alert('Failed to update grievance. Admin access required.');
      fetchGrievances();
    } catch (err) {
      console.error('update grievance', err);
    }
  };

  const deleteGrievance = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/grievance/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      if (!res.ok) return alert('Failed to delete grievance. Admin access required.');
      fetchGrievances();
    } catch (err) {
      console.error('delete grievance', err);
    }
  };

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/registrations', { headers: getAuthHeaders() });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) return alert('Admin access required. Please log in as an admin.');
        throw new Error('Failed to fetch registrations');
      }
      const data = await res.json();
      setRegistrations(data);
    } catch (err) {
      console.error('fetch registrations', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/logs', { headers: getAuthHeaders() });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) return alert('Admin access required. Please log in as an admin.');
        throw new Error('Failed to fetch logs');
      }
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error('fetch logs', err);
    } finally {
      setLoading(false);
    }
  };

  const updateWasteStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:3000/api/waste/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ status }) });
      if (!res.ok) return alert('Failed to update waste. Admin access required.');
      fetchWastes();
    } catch (err) {
      console.error('update waste', err);
    }
  };

  const deleteWaste = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/waste/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      if (!res.ok) return alert('Failed to delete. Admin access required.');
      fetchWastes();
    } catch (err) {
      console.error('delete waste', err);
    }
  };

  const updateRegistrationStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:3000/api/registrations/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ status }) });
      if (!res.ok) return alert('Failed to update registration. Admin access required.');
      fetchRegistrations();
    } catch (err) {
      console.error('update registration', err);
    }
  };

  const deleteRegistration = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/registrations/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      if (!res.ok) return alert('Failed to delete registration. Admin access required.');
      fetchRegistrations();
    } catch (err) {
      console.error('delete registration', err);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />

      <Box sx={{ display: "flex" }}>
        {/* 🔹 AppBar */}
        {/* <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            bgcolor: "#009688",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Smart City Admin Dashboard
            </Typography>
          </Toolbar>
        </AppBar> */}

        {/* 🔹 Sidebar Drawer */}
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {/* Mobile Drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>

          {/* Desktop Drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* 🔹 Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: 8,
          }}
        >
          {tab === 'overview' && (
            <>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 3 }}>Dashboard Overview</Typography>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                {[
                  { title: 'Waste Requests', value: overview.wasteCount || wastes.length || 0, color: '#009688', icon: <DeleteOutline /> , link: 'waste'},
                  { title: 'Registrations', value: overview.registrationCount || registrations.length || 0, color: '#1976d2', icon: <People /> , link: 'registrations'},
                  { title: 'Registered Users', value: overview.userCount || 0, color: '#8bc34a', icon: <People /> , link: 'users'},
                  { title: 'Recent Logs', value: overview.recentLogs?.length || logs.length || 0, color: '#ff7043', icon: <ReportProblem />, link: 'logs'},
                ].map((stat, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Paper elevation={4} sx={{ p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>{stat.icon}</Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>{stat.title}</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 0.5 }}>{stat.value}</Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          <Button size="small" variant="text" onClick={() => setTab(stat.link)}>View</Button>
                          <Button size="small" variant="outlined" onClick={() => fetchOverview()}>Refresh</Button>
                        </Stack>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="h6">Recent Activity</Typography>
                      <Button size="small" variant="text" onClick={() => setTab('logs')}>See all</Button>
                    </Stack>

                    <Box sx={{ mt: 2 }}>
                      {overviewLoading ? (
                        <Typography>Loading...</Typography>
                      ) : (
                        (overview.recentLogs && overview.recentLogs.length > 0) ? overview.recentLogs.map(l => (
                          <Paper key={l._id} sx={{ p: 1, mb: 1 }}>
                            <Typography variant="body2">[{new Date(l.createdAt).toLocaleString()}] <strong>{l.action}</strong> {l.entityType} - {l.message}</Typography>
                          </Paper>
                        )) : <Typography color="text.secondary">No recent activity</Typography>
                      )}
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
                    <Typography variant="h6">Latest Submissions</Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">Waste Requests</Typography>
                      {overviewLoading ? <Typography>Loading...</Typography> : (
                        (overview.recentWastes && overview.recentWastes.length > 0) ? overview.recentWastes.map(w => (
                          <Paper key={w._id} sx={{ p: 1, mb: 1 }}>
                            <Typography variant="body2"><strong>{w.name}</strong> • {w.wasteType} • {w.status || 'pending'}</Typography>
                            <Typography variant="caption" color="text.secondary">{w.address}</Typography>
                          </Paper>
                        )) : <Typography color="text.secondary">No recent waste requests</Typography>
                      )}

                      <Divider sx={{ my: 2 }} />

                      <Typography variant="subtitle2">Registrations</Typography>
                      {overviewLoading ? <Typography>Loading...</Typography> : (
                        (overview.recentRegs && overview.recentRegs.length > 0) ? overview.recentRegs.map(r => (
                          <Paper key={r._id} sx={{ p: 1, mb: 1 }}>
                            <Typography variant="body2"><strong>{r.firstName} {r.lastName || ''}</strong> • {r.department}</Typography>
                            <Typography variant="caption" color="text.secondary">{r.email} • {r.phone}</Typography>
                          </Paper>
                        )) : <Typography color="text.secondary">No recent registrations</Typography>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}

          {tab === 'waste' && (
            <>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>Waste Requests</Typography>
              <Paper sx={{ p: 2, mb: 3 }}>
                {loading ? <Typography>Loading...</Typography> : (
                  <Grid container spacing={2}>
                    {wastes.map(w => (
                      <Grid item xs={12} md={6} key={w._id}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="h6">{w.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{w.address}</Typography>
                          <Typography variant="caption">{w.wasteType} • {w.status}</Typography>
                          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                            <Button size="small" onClick={() => updateWasteStatus(w._id, 'scheduled')}>Schedule</Button>
                            <Button size="small" onClick={() => updateWasteStatus(w._id, 'collected')}>Mark Collected</Button>
                            <Button size="small" color="error" onClick={() => deleteWaste(w._id)}>Delete</Button>
                          </Stack>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Paper>
            </>
          )}

          {tab === 'water' && (
            <>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>Water Requests</Typography>
              <Paper sx={{ p: 2, mb: 3 }}>
                {loading ? <Typography>Loading...</Typography> : (
                  <Grid container spacing={2}>
                    {waters.map(w => (
                      <Grid item xs={12} md={6} key={w._id}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="h6">{w.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{w.address}</Typography>
                          <Typography variant="caption">{w.issueType} • {w.status}</Typography>
                          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                            <Button size="small" onClick={() => updateWaterStatus(w._id, 'in-progress')}>In-Progress</Button>
                            <Button size="small" onClick={() => updateWaterStatus(w._id, 'resolved')}>Resolve</Button>
                            <Button size="small" color="error" onClick={() => deleteWater(w._id)}>Delete</Button>
                          </Stack>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Paper>
            </>
          )}



          {tab === 'grievances' && (
            <>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>Grievances</Typography>
              <Paper sx={{ p: 2, mb: 3 }}>
                {loading ? <Typography>Loading...</Typography> : (
                  <Grid container spacing={2}>
                    {grievances.map(g => (
                      <Grid item xs={12} md={6} key={g._id}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="h6">{g.subject}</Typography>
                          <Typography variant="body2" color="text.secondary">{g.description}</Typography>
                          <Typography variant="caption">Submitted by: {g.name} • {new Date(g.createdAt).toLocaleString()}</Typography>
                          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                            <Select size="small" value={g.status || 'open'} onChange={(e) => updateGrievanceStatus(g._id, e.target.value)}>
                              <MenuItem value="open">Open</MenuItem>
                              <MenuItem value="in-progress">In-Progress</MenuItem>
                              <MenuItem value="resolved">Resolved</MenuItem>
                              <MenuItem value="closed">Closed</MenuItem>
                            </Select>
                            <Button color="error" onClick={() => deleteGrievance(g._id)}>Delete</Button>
                          </Stack>
                        </Paper>
                      </Grid>
                    ))}
                    {grievances.length === 0 && <Typography sx={{ p: 2 }}>No grievances yet.</Typography>}
                  </Grid>
                )}
              </Paper>
            </>
          )}

          {tab === 'registrations' && (
            <>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>Registrations</Typography>
              <Paper sx={{ p: 2, mb: 3 }}>
                {loading ? <Typography>Loading...</Typography> : (
                  <Grid container spacing={2}>
                    {registrations.map(r => (
                      <Grid item xs={12} md={6} key={r._id}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="h6">{r.firstName} {r.lastName}</Typography>
                          <Typography variant="body2" color="text.secondary">{r.email} • {r.phone}</Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>Department: {r.department} {r.subOption ? `• ${r.subOption}` : ''}</Typography>
                          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                            <Select size="small" value={r.status || 'pending'} onChange={(e) => updateRegistrationStatus(r._id, e.target.value)}>
                              <MenuItem value="pending">Pending</MenuItem>
                              <MenuItem value="approved">Approved</MenuItem>
                              <MenuItem value="rejected">Rejected</MenuItem>
                            </Select>
                            <Button color="error" onClick={() => deleteRegistration(r._id)}>Delete</Button>
                          </Stack>
                        </Paper>
                      </Grid>
                    ))}
                    {registrations.length === 0 && <Typography sx={{ p: 2 }}>No registrations yet.</Typography>}
                  </Grid>
                )}
              </Paper>
            </>
          )}

          {tab === 'logs' && (
            <>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>Activity Logs</Typography>
              <Paper sx={{ p: 2 }}>
                {loading ? <Typography>Loading...</Typography> : (
                  <Grid container spacing={2}>
                    {logs.map(l => (
                      <Grid item xs={12} key={l._id}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="body2">[{new Date(l.createdAt).toLocaleString()}] <strong>{l.action}</strong> {l.entityType} - {l.message}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                    {logs.length === 0 && <Typography sx={{ p: 2 }}>No logs yet.</Typography>}
                  </Grid>
                )}
              </Paper>
            </>
          )}

        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;
