// src/app/pages/tickets/TicketDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  TextField,
  Button,
  Stack,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import dayjs from "dayjs";

// Import API helper
import api from "../../admin/libs/api"; // adjust path based on your project

const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Fetch ticket + comments on mount
  useEffect(() => {
    fetchTicket();
    fetchComments();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      const res = await api.get(`/tickets/${ticketId}`);
      setTicket(res);
    } catch (err) {
      console.error("Error fetching ticket:", err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${ticketId}`);
      setComments(res);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      setLoading(true);
      await api.post(`/comments/${ticketId}`, { text: newComment });
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!ticket) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      {/* Back Button */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIosNewIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Go Back
      </Button>

      {/* Header */}
      <Typography
        variant={isMobile ? "h5" : "h4"}
        fontWeight={600}
        gutterBottom
        color="primary.main"
      >
        🎫 Ticket Details
      </Typography>

      {/* Ticket Details */}
      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, mb: 4 }}>
        <Typography variant="h6" color="text.primary" gutterBottom>
          {ticket.title}
        </Typography>

        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={1}
          alignItems={isMobile ? "flex-start" : "center"}
          mb={2}
        >
          <Chip
            label={`Status: ${ticket.status}`}
            color={
              ticket.status === "Open"
                ? "primary"
                : ticket.status === "In Progress"
                ? "warning"
                : ticket.status === "Resolved"
                ? "success"
                : "default"
            }
          />
          <Chip label={`Priority: ${ticket.priority}`} variant="outlined" />
          <Chip label={`Category: ${ticket.category}`} variant="outlined" />
        </Stack>

        <Typography variant="body2" gutterBottom>
          <strong>Created:</strong> {dayjs(ticket.createdAt).format("YYYY-MM-DD HH:mm")}
        </Typography>

        <Typography variant="body1" mt={2}>
          <strong>Description:</strong>
          <br />
          {ticket.description || "No description provided."}
        </Typography>
      </Paper>

      {/* Comments Section */}
      <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
        💬 Comments
      </Typography>

      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, mb: 4, backgroundColor: "#fff" }}>
        <Stack spacing={2}>
          {comments.map((comment) => (
            <Box
              key={comment._id}
              sx={{
                p: 2,
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                backgroundColor: "#f9f9f9",
              }}
            >
              <Typography variant="body2" fontWeight={600}>
                {(comment.userId && comment.userId.name) || "Unknown User"} —{" "}
                {dayjs(comment.createdAt).format("YYYY-MM-DD HH:mm")}
              </Typography>
              <Typography variant="body1">{comment.text}</Typography>
              {comment.attachment && (
                <Typography variant="body2" color="text.secondary" mt={1}>
                  📎 Attachment: {comment.attachment}
                </Typography>
              )}
            </Box>
          ))}
        </Stack>

        {/* Add Comment */}
        <Box mt={4}>
          <TextField
            label="Add a comment"
            multiline
            rows={isMobile ? 2 : 3}
            fullWidth
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCommentSubmit}
            sx={{ mt: 2, px: 4 }}
            disabled={loading}
            fullWidth={isMobile}
          >
            {loading ? "Posting..." : "Post Comment"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default TicketDetailPage;
