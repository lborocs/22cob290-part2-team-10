import { styled } from '@mui/material/styles';
import Dialog, { type DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import CloseIcon from '@mui/icons-material/Close';

export const StyledDialog = styled(Dialog)(({ theme }) =>
  theme.unstable_sx({
    '& .MuiPaper-root > *': {
      paddingX: 2,
    },
    '& .MuiDialogActions-root': {
      paddingY: {
        xs: 2,
        md: 1.5,
      },
    },
  })
);

export type OnCloseReason =
  | Parameters<NonNullable<DialogProps['onClose']>>[1]
  | 'closeButtonClick';

export type StyledCloseButtonDialogProps = DialogProps & {
  dialogTitle: React.ReactNode;
  noCloseButton?: boolean;
  onClose?: (event: React.SyntheticEvent, reason: OnCloseReason) => void;
};

/**
 * A styled dialog (less padding) with an optional (default enabled) close button
 *   in the header.
 *
 * @param dialogTitle The title of the dialog
 * @param noCloseButton
 * @see https://mui.com/material-ui/react-dialog/
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
        <DialogTitle sx={{ padding: 1.5 }}>{dialogTitle}</DialogTitle>
      ) : (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          paddingY={1.5}
        >
          <DialogTitle sx={{ padding: 0 }}>{dialogTitle}</DialogTitle>
          <IconButton
            edge="end"
            onClick={(event) => props.onClose?.(event, 'closeButtonClick')}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      )}
      {children}
    </StyledDialog>
  );
}
