// /pages/support-agent/tickets/[ticketId].jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  TextField,
  Button,
  Divider,
  Stack,
  MenuItem,
  Chip,
  IconButton,
} from "@mui/material";
import dayjs from "dayjs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const statusOptions = ["Open", "In Progress", "Resolved", "Closed"];

const TicketDetailSupportAgent = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchTicket();
    fetchComments();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/tickets/${ticketId}`, {
        withCredentials: true,
      });
      setTicket(res.data);
    } catch (err) {
      console.error("Error fetching ticket:", err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/comments/${ticketId}`, {
        withCredentials: true,
      });
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      setLoading(true);
      await axios.post(
        `http://localhost:3000/api/comments/${ticketId}`,
        { text: newComment },
        { withCredentials: true }
      );
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      setUpdatingStatus(true);
      await axios.patch(
        `http://localhost:3000/api/tickets/${ticketId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      setTicket((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingStatus(false);
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
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" ml={1} color="primary.main" fontWeight={600}>
          Ticket Details
        </Typography>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 4, mb: 4 }} elevation={3}>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          {ticket.title}
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} flexWrap="wrap" mb={2}>
          <Chip label={`Priority: ${ticket.priority}`} variant="outlined" />
          <Chip label={`Category: ${ticket.category}`} variant="outlined" />
          <Chip label={`Status: ${ticket.status}`} color={
            ticket.status === "Open" ? "primary" :
            ticket.status === "In Progress" ? "warning" :
            ticket.status === "Resolved" ? "success" :
            "default"
          } />
        </Stack>

        <Typography variant="body1" mb={1}>
          <strong>Created:</strong> {dayjs(ticket.createdAt).format("YYYY-MM-DD HH:mm")}
        </Typography>

        <Typography variant="body1" mt={2}>
          <strong>Description:</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          {ticket.description || "No description provided."}
        </Typography>

        <Box mt={4}>
          <TextField
            label="Update Status"
            select
            fullWidth
            value={ticket.status}
            onChange={handleStatusChange}
            disabled={updatingStatus}
          >
            {statusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Paper>

      <Typography variant="h5" gutterBottom color="primary.main">
        💬 Comments
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Stack spacing={2}>
          {comments.length === 0 && (
            <Typography color="text.secondary">No comments yet.</Typography>
          )}
          {comments.map((comment) => (
            <Box key={comment._id} sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}>
              <Typography variant="body2" fontWeight="bold">
                {comment.userId?.name || "Unknown"} — {dayjs(comment.createdAt).format("YYYY-MM-DD HH:mm")}
              </Typography>
              <Typography variant="body1" mt={0.5}>
                {comment.text}
              </Typography>
              {comment.attachment && (
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  📎 Attachment: {comment.attachment}
                </Typography>
              )}
            </Box>
          ))}
        </Stack>

        <Box mt={4}>
          <TextField
            label="Add a comment"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleCommentSubmit}
            disabled={loading}
          >
            {loading ? "Posting..." : "Post Comment"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default TicketDetailSupportAgent;
