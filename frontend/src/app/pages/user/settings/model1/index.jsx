import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Stack,
} from "@mui/material";
import { JumboForm, JumboInput } from "@jumbo/vendors/react-hook-form";
import { LoadingButton } from "@mui/lab";
import * as yup from "yup";
import axios from "axios";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { toast } from "react-toastify";

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

const EditProfileModal = ({ open, onClose }) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const handleSubmit = async (data) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.put(
        "http://localhost:3000/api/users/profile",
        data,
        { withCredentials: true }
      );
      updateUser(res.data.user);
      setSuccess("Profile updated successfully");
      toast.success("Profile updated");
      onClose(); // close modal
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update profile";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <JumboForm
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Stack spacing={2} mt={1}>
            <JumboInput
              fieldName="name"
              label="Full Name"
              defaultValue={user?.name || ""}
            />
            <JumboInput
              fieldName="email"
              label="Email"
              type="email"
              defaultValue={user?.email || ""}
            />
            <LoadingButton type="submit" variant="contained" loading={loading}>
              Save Changes
            </LoadingButton>
          </Stack>
        </JumboForm>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileModal;
