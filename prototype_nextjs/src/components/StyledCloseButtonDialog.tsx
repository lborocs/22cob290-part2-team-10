import { styled } from '@mui/material/styles';
import Dialog, { type DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import CloseIcon from '@mui/icons-material/Close';

const StyledDialog = styled(Dialog)(({ theme }) => theme.unstable_sx({
  '& .MuiPaper-root > *': {
    paddingX: 2,
  },
  '& .MuiDialogActions-root': {
    paddingY: {
      xs: 2,
      md: 1.5,
    },
  },
}));

export type StyledCloseButtonDialogProps = DialogProps & {
  dialogTitle: React.ReactNode
  noCloseButton?: boolean
};

/**
 * A styled dialog (less padding) with a close button in the header.
 *
 * @param dialogTitle The title of the dialog
 * @param noCloseButton
 * @returns
 */
export default function StyledCloseButtonDialog({
  dialogTitle,
  noCloseButton,
  children,
  ...props
}: StyledCloseButtonDialogProps) {
  return (
    <StyledDialog {...props} disableEnforceFocus>
      {noCloseButton ? (
        <DialogTitle sx={{ padding: 1.5 }}>
          {dialogTitle}
        </DialogTitle>
      ) : (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          paddingY={1.5}
        >
          <DialogTitle sx={{ padding: 0 }}>
            {dialogTitle}
          </DialogTitle>
          <IconButton
            edge="end"
            // @ts-expect-error it works so :shrug:
            onClick={() => props.onClose?.()}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      )}
      {children}
    </StyledDialog >
  );
}
