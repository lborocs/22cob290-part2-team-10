import { useMemo } from 'react';
import { styled } from '@mui/material/styles';
import Avatar, { type AvatarProps } from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';

import type { TextAvatar } from '~/lib/textAvatar';
import ActionedSplitButton, {
  type Option,
} from '~/components/ActionedSplitButton';

const StyledTextAvatar = styled(
  ({ textAvatar, ...props }: { textAvatar?: TextAvatar } & AvatarProps) => (
    <ListItemAvatar>
      <Avatar {...props} />
    </ListItemAvatar>
  )
)(({ theme, textAvatar }) => ({
  backgroundColor: textAvatar?.['avatar-bg'],
  color: textAvatar?.['avatar-fg'],
  width: '4.5ch',
  height: '4.5ch',
  fontSize: '0.9rem',
}));

export type TextAvatarResetButtonProps = {
  formId?: string;
  initialTextAvatar?: TextAvatar;
  systemDefaultTextAvatar: TextAvatar;
  resetToSystemDefault: () => void;
  disabled: boolean;
};

/**
 * Opinionated component that encapsulates the logic for `ActionedSplitButton` for `TextAvatarEditor`.
 */
export default function TextAvatarResetButton({
  formId,
  initialTextAvatar,
  systemDefaultTextAvatar,
  resetToSystemDefault,
  ...buttonProps
}: TextAvatarResetButtonProps) {
  const resetButtonOptions = useMemo<Option[]>(
    () => [
      {
        actionButtonContent: (
          <>
            <Box display={{ xs: 'none', sm: 'inline' }} component="span">
              Reset to previous
            </Box>
            <Box display={{ xs: 'inline', sm: 'none' }} component="span">
              Previous
            </Box>
          </>
        ),
        menuItemContent: (
          <>
            <StyledTextAvatar textAvatar={initialTextAvatar}>
              A
            </StyledTextAvatar>
            <ListItemText
              primary="Reset to previous"
              secondary="The previous colours of your text avatar"
            />
          </>
        ),
        actionButtonProps: {
          form: formId,
          type: 'reset',
        },
      },
      {
        actionButtonContent: (
          <>
            <Box display={{ xs: 'none', sm: 'inline' }} component="span">
              Reset to default
            </Box>
            <Box display={{ xs: 'inline', sm: 'none' }} component="span">
              Default
            </Box>
          </>
        ),
        menuItemContent: (
          <>
            <StyledTextAvatar textAvatar={systemDefaultTextAvatar}>
              A
            </StyledTextAvatar>
            <ListItemText
              primary="Reset to default"
              secondary="The default text avatar colours"
            />
          </>
        ),
        action: resetToSystemDefault,
      },
    ],
    [formId, initialTextAvatar, systemDefaultTextAvatar, resetToSystemDefault]
  );

  return (
    <ActionedSplitButton
      options={resetButtonOptions}
      variant="contained"
      color="warning"
      size="small"
      sx={{ marginLeft: 1 }}
      disableElevation
      dropDownButtonProps={{
        'aria-label': 'select reset strategy',
        sx: {
          paddingX: 0.5,
          minWidth: '0 !important',
        },
      }}
      menuProps={{
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        MenuListProps: {
          dense: true,
        },
      }}
      {...buttonProps}
    />
  );
}
