import React from "react";
import { Container, Typography, Box, Grid, Paper, Button } from "@mui/material";
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';

const features = [
  {
    title: "Ticket Creation & Tracking",
    description: "Employees can submit support tickets for IT, HR, or general issues. Tickets are tracked with status updates in real-time.",
    icon: <PersonIcon fontSize="large" color="primary" />,
  },
  {
    title: "Admin Dashboard",
    description: "Admins manage users, assign tickets to support agents, view stats, and monitor overall ticket flow.",
    icon: <AdminPanelSettingsIcon fontSize="large" color="secondary" />,
  },
  {
    title: "Support Agent Panel",
    description: "Support agents handle assigned tickets, change statuses (Pending, In Progress, Resolved), and leave comments for communication.",
    icon: <SupportAgentIcon fontSize="large" color="success" />,
  },
];

const HomePage = () => {
  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h3" gutterBottom align="center" fontWeight="bold">
        Internal Support Ticket & Issue Tracking System
      </Typography>

      <Typography variant="h6" align="center" color="text.secondary" mb={4}>
        A role-based internal system to manage employee support tickets efficiently. Built with MERN Stack.
      </Typography>

      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Button variant="contained" color="primary" size="large" href="/login">
          Get Started
        </Button>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper elevation={3} sx={{ p: 4, textAlign: "center", height: "100%" }}>
              <Box sx={{ mb: 2 }}>{feature.icon}</Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;
