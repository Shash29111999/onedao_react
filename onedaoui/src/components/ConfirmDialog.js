import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

function ConfirmDialog({ open, title, content, onClose, onConfirm }) {
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>{title || "Confirm"}</DialogTitle>
			<DialogContent>
				<DialogContentText>{content || "Are you sure?"}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={onConfirm} color="error">
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ConfirmDialog;
