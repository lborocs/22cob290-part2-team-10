import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Stack from '@mui/material/Stack';

import StyledCloseButtonDialog from '~/components/StyledCloseButtonDialog';
import SignedInUserAvatar from '~/components/avatar/SignedInUserAvatar';
import ImageEditor from '~/components/profile/avatar/ImageEditor';

import styles from '~/styles/profile/TextAvatarEditor.module.css';

// modal:
// TODO: toggler between image url & text avatar
// TODO: image url setter with API route

// TODO: on text avatar editor, will need to invalidate swr cache for user (to re-fetch text avatar)

export default function AvatarEditor() {
  // TODO
  const [showDialog, setShowDialog] = useState(false);

  const [tab, setTab] = useState('1');

  const handleOpen = () => setShowDialog(true);
  const handleClose = () => setShowDialog(false);

  const handleTabChange = (event: React.SyntheticEvent, newTab: typeof tab) => {
    setTab(newTab);
  };

  return (
    <article>
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
        <StyledCloseButtonDialog
          open={showDialog}
          onClose={handleClose}
          maxWidth="xs"
          fullWidth
          dialogTitle={
            // icl this currently looks DOO DOO
            <Stack direction="row" alignItems="center" gap={4}>
              Avatar
              <Box borderBottom={1} borderColor="divider" width="fit-content">
                <TabList
                  onChange={handleTabChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Text avatar" value="1" />
                  <Tab label="Image" value="2" />
                </TabList>
              </Box>
            </Stack>
          }
        >
          <DialogContent
            sx={(theme) => ({
              px: `${theme.spacing(1)} !important`, // idk what is causing this to have to be important
              py: 0,
            })}
            dividers
          >
            <TabPanel value="1" sx={{ px: 2, py: 0.5 }}>
              {/* TODO: new TextAvatarEditor */}
              TextAvatarEditor
            </TabPanel>
            <TabPanel value="2" sx={{ px: 2, py: 0.5 }}>
              <ImageEditor />
            </TabPanel>
          </DialogContent>

          <DialogActions>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={handleClose}
              // disabled={isSaving}
              disableElevation
            >
              Close
            </Button>
          </DialogActions>
        </StyledCloseButtonDialog>
      </TabContext>
    </article>
  );
}
