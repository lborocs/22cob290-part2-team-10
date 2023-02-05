import { useEffect, useState } from 'react';
import type { SxProps } from '@mui/material';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import LoadingButton from '@mui/lab/LoadingButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios, { type AxiosRequestConfig } from 'axios';

import StyledCloseButtonDialog from '~/components/StyledCloseButtonDialog';
import { copyToClipboard } from '~/utils';
import type { ResponseSchema as InviteUrlResponse } from '~/pages/api/user/get-invite-url';

import styles from '~/styles/Profile.module.css';

enum CopyStatus {
  NOT_COPIED,
  FAILED,
  SUCCEEDED,
}

/**
 * Component providing functionality for the user to invite an employee to join
 *  the system.
 */
export default function InviteEmployeeSection() {
  const [showDialog, setShowDialog] = useState(false);

  const handleOpen = () => setShowDialog(true);
  const handleClose = () => setShowDialog(false);

  const [inviteUrl, setInviteUrl] = useState('');

  const [copyStatus, setCopyStatus] = useState(CopyStatus.NOT_COPIED);
  const [copyFailedFeedback, setCopyFailedFeedback] = useState('');

  const fetchingInviteUrl = inviteUrl === '';

  const copySucceeded = copyStatus === CopyStatus.SUCCEEDED;
  const copyFailed = copyStatus === CopyStatus.FAILED;

  const reset = () => {
    setInviteUrl('');
    setCopyStatus(CopyStatus.NOT_COPIED);
  };

  const fetchInviteUrl = async (config?: AxiosRequestConfig) => {
    try {
      const { data } = await axios.get<InviteUrlResponse>(
        '/api/user/get-invite-url',
        config
      );
      setInviteUrl(data.inviteUrl);
    } catch (e) {
      console.error(e);
    }
  };

  const copyInviteUrl = async () => {
    try {
      await copyToClipboard(inviteUrl);
      setCopyStatus(CopyStatus.SUCCEEDED);
    } catch (e: unknown) {
      setCopyStatus(CopyStatus.FAILED);
      setCopyFailedFeedback(String(e ?? ''));
    }
  };

  const regenerateInvite = async () => {
    reset();

    // artificial delay (only in development)
    process.env.NODE_ENV === 'development' &&
      (await new Promise((res) => setTimeout(res, 1000)));

    await fetchInviteUrl();
  };

  useEffect(() => {
    if (showDialog) {
      const controller = new AbortController();
      const signal = controller.signal;

      fetchInviteUrl({ signal });

      return () => {
        controller.abort();
      };
    } else {
      reset();
    }
  }, [showDialog]);

  // Mui's TextField/FormControl API doesn't provide functionality
  // for success state, only for error state. So we have to implement it
  // ourselves
  const formControlSx: SxProps | undefined = copySucceeded
    ? {
        '& .MuiFormHelperText-root': {
          color: 'success.main',
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'success.main',
          },
          '&:hover fieldset': {
            borderColor: 'success.main',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'success.main',
          },
        },
      }
    : undefined;

  const copyIconColor: IconButtonProps['color'] = (
    {
      [CopyStatus.NOT_COPIED]: undefined,
      [CopyStatus.SUCCEEDED]: 'success',
      [CopyStatus.FAILED]: 'error',
    } as const
  )[copyStatus];

  const helperText = {
    [CopyStatus.NOT_COPIED]: '',
    [CopyStatus.SUCCEEDED]: 'Copied!',
    [CopyStatus.FAILED]:
      copyFailedFeedback || 'Failed to copy, please try again.',
  }[copyStatus];

  return (
    <div>
      <Typography variant="h5" fontWeight={500} component="h2">
        Invite Employee
      </Typography>
      <Button
        variant="contained"
        color="contrast"
        onClick={handleOpen}
        className={styles.button}
      >
        Generate invite
      </Button>

      <StyledCloseButtonDialog
        open={showDialog}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        dialogTitle="Invite URL (valid for 7 days)"
      >
        <DialogContent sx={{ paddingY: 2 }} dividers>
          <FormControl
            variant="outlined"
            color="secondary"
            sx={formControlSx}
            error={copyFailed}
            disabled={fetchingInviteUrl}
            fullWidth
          >
            <OutlinedInput
              size="small"
              aria-label="invite URL"
              value={fetchingInviteUrl ? 'Generating...' : inviteUrl}
              readOnly
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    color={copyIconColor}
                    aria-label="copy"
                    onClick={copyInviteUrl}
                    disabled={fetchingInviteUrl}
                  >
                    <ContentCopyIcon fontSize="inherit" />
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText>{helperText}</FormHelperText>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ paddingY: 1.5 }}>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            startIcon={<CloseIcon />}
            onClick={handleClose}
          >
            Close
          </Button>
          <LoadingButton
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<RefreshIcon />}
            loadingPosition="start"
            onClick={regenerateInvite}
            loading={fetchingInviteUrl}
            disableElevation
          >
            Regenerate
          </LoadingButton>
        </DialogActions>
      </StyledCloseButtonDialog>
    </div>
  );
}
