import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function AlertDialog(props:any) {
  const handleClose = () => {
    props.clickClose();
  };
  const handleYes = () => {
    props.clickYes();
  };
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={props.maxWidth}
        fullWidth = {true}
      >
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.content}
          </DialogContentText>
        </DialogContent>
        {props.hasActions && (
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              no
            </Button>
            <Button onClick={handleYes} color="primary" autoFocus>
              yes
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
}
