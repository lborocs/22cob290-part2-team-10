import { useRef, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CloseIcon from '@mui/icons-material/Close';

import useUserStore from '~/store/userStore';
import { StyledDialog } from '~/components/StyledCloseButtonDialog';
import SignedInUserAvatar from '~/components/avatar/SignedInUserAvatar';
import TextAvatarEditor from '~/components/profile/avatar/TextAvatarEditor';
import ImageEditor from '~/components/profile/avatar/ImageEditor';

import styles from '~/styles/profile/TextAvatarEditor.module.css';

export default function AvatarEditor() {
  const image = useUserStore((state) => state.user.image);

  const [showDialog, setShowDialog] = useState(false);

  // default to image when user has image
  const [tab, setTab] = useState<'text' | 'image'>(image ? 'image' : 'text');

  const handleOpen = () => setShowDialog(true);
  const handleClose = () => setShowDialog(false);

  const handleTabChange = (event: React.SyntheticEvent, newTab: typeof tab) => {
    setTab(newTab);
  };

  const actionsPortalRef = useRef<HTMLElement>(null);

  return (
    <div>
      <SignedInUserAvatar
        size="120px"
        className={styles.textAvatar}
        style={{
          fontSize: '3rem',
        }}
        onClick={handleOpen}
        role="button"
      />

      <TabContext value={tab}>
        <StyledDialog
          open={showDialog}
          onClose={handleClose}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle
            sx={{
              padding: '0 !important',
              borderBottom: 1,
              borderColor: 'divider',
              position: 'relative',
            }}
          >
            <TabList
              onChange={handleTabChange}
              aria-label="Avatar editor"
              sx={(theme) => ({
                height: theme.spacing(8),
                '[role="tablist"]': {
                  height: 1,
                },
              })}
            >
              <Tab label="Text avatar" value="text" />
              <Tab label="Image" value="image" />
            </TabList>

            <IconButton
              edge="end"
              onClick={handleClose}
              aria-label="close"
              sx={(theme) => ({
                position: 'absolute',
                right: theme.spacing(2),
                top: '50%',
                transform: 'translateY(-50%)',
              })}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            <TabPanel value="text" sx={{ padding: 0 }}>
              <TextAvatarEditor
                actionsPortalRef={actionsPortalRef}
                handleClose={handleClose}
              />
            </TabPanel>
            <TabPanel value="image" sx={{ padding: 0 }}>
              <ImageEditor
                actionsPortalRef={actionsPortalRef}
                handleClose={handleClose}
              />
            </TabPanel>
          </DialogContent>

          <DialogActions ref={actionsPortalRef} />
        </StyledDialog>
      </TabContext>
    </div>
  );
}
