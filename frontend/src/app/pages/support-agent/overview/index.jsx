// /pages/support-agent-dashboard/SupportAgentOverviewPage.jsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Stack,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import api from "../../admin/libs/api"; // ✅ use centralized API instance

// ===== Constants =====
const COLORS = ["#1976d2", "#ff9800", "#4caf50", "#9e9e9e"];
const statusColorMap = [
  { label: "Open", color: COLORS[0] },
  { label: "In Progress", color: COLORS[1] },
  { label: "Resolved", color: COLORS[2] },
  { label: "Closed", color: COLORS[3] },
];

const CHART_HEIGHT = 300;

const SupportAgentOverviewPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { loggedInUser } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get("/tickets/stats/support-agent"); // ✅ simplified
        setStats(data);
      } catch (err) {
        console.error("Error fetching support agent stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const pieData = statusColorMap.map((item) => ({
    name: item.label,
    value: stats.statusCounts?.[item.label] || 0,
  }));
  const barData = stats.categoryCounts || [];
  const lineData = stats.ticketsOverTime || [];

  const isPieDataEmpty = pieData.every((item) => item.value === 0);
  const isBarDataEmpty = barData.length === 0;
  const isLineDataEmpty = lineData.length === 0;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      {/* Header */}
      <Typography variant={isMobile ? "h5" : "h4"} color="primary.main" fontWeight={600} gutterBottom>
        🛠️ Support Agent Overview
      </Typography>

      <Typography variant="body1" mb={4}>
        Hello <strong>{loggedInUser.name}</strong>!<br />
        You’re logged in as <strong>{loggedInUser.role}</strong>.<br />
        This dashboard helps you manage, resolve, and analyze your assigned tickets efficiently.
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={2} mb={4}>
        {[{ label: "Total Tickets", value: stats.totalTickets, color: COLORS[0] }]

          .concat(
            statusColorMap.map((s) => ({
              label: s.label,
              value: stats.statusCounts?.[s.label] || 0,
              color: s.color,
            }))
          )

          .concat([
            {
              label: "Avg. Resolution",
              value: `${stats.avgResolutionTimeInDays || "N/A"} days`,
              color: "#000",
            },
          ])

          .map((item, index) => (
            <Grid item xs={6} sm={4} md={3} lg={2.4} key={index}>
              <Paper
                elevation={3}
                sx={{ p: 2, borderRadius: 3, textAlign: "center", height: "100%" }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontSize: isMobile ? "0.8rem" : "0.95rem" }}
                >
                  {item.label}
                </Typography>
                <Typography variant="h6" sx={{ color: item.color, fontWeight: 600, mt: 1 }}>
                  {item.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: CHART_HEIGHT }}>
            <Typography variant="h6" gutterBottom>
              Ticket Status Distribution
            </Typography>
            <Box sx={{ height: 200 }}>
              {isPieDataEmpty ? (
                <Typography align="center" color="text.secondary" mt={6}>
                  No status data available.
                </Typography>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Box>
            {!isPieDataEmpty && (
              <Stack direction="row" spacing={1} justifyContent="center" mt={2} flexWrap="wrap">
                {statusColorMap.map((s) => (
                  <Chip
                    key={s.label}
                    label={s.label}
                    size="small"
                    sx={{
                      backgroundColor: s.color,
                      color: "#fff",
                      m: 0.5,
                      fontSize: "0.75rem",
                    }}
                  />
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: CHART_HEIGHT }}>
            <Typography variant="h6" gutterBottom>
              Tickets by Category
            </Typography>
            <Box sx={{ height: 200 }}>
              {isBarDataEmpty ? (
                <Typography align="center" color="text.secondary" mt={6}>
                  No category data available.
                </Typography>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1976d2" barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Line Chart */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tickets Over Time
            </Typography>
            {isLineDataEmpty ? (
              <Typography align="center" color="text.secondary" mt={6}>
                No ticket activity over time to display.
              </Typography>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#1976d2" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SupportAgentOverviewPage;
