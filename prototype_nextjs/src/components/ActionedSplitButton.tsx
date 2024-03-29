import { useCallback, useState, useId, useMemo } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import Button, { type ButtonProps } from '@mui/material/Button';
import ButtonGroup, { type ButtonGroupProps } from '@mui/material/ButtonGroup';
import Menu, { type MenuProps } from '@mui/material/Menu';
import MenuItem, { type MenuItemProps } from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// https://mui.com/system/getting-started/the-sx-prop/#passing-the-sx-prop
function getSx(sx?: SxProps<Theme>) {
  if (!sx) return [];

  return Array.isArray(sx) ? sx : [sx];
}

/**
 * Removes the `sx` prop from the given props.
 */
function withoutSx(props: any) {
  if (props && props.sx) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { sx, ...rest } = props;
    return rest;
  }
  return props;
}

type Props<T> = Omit<T, 'onClick' | 'children'>;

type DropDownButtonProps = Omit<
  Props<ButtonProps>,
  'aria-controls' | 'aria-expanded'
>;

type BaseOption = {
  action?(): void;
  actionButtonProps?: Props<ButtonProps>;
  dropDownButtonProps?: DropDownButtonProps;
  menuItemProps?: Props<MenuItemProps>;
};

type SameContentOption = BaseOption & {
  content: React.ReactNode;
  actionButtonContent?: never;
  menuItemContent?: never;
};

type CustomContentOption = BaseOption & {
  content?: never;
  actionButtonContent: React.ReactNode;
  menuItemContent: React.ReactNode;
};

export type Option = SameContentOption | CustomContentOption;

export type ActionedSplitButtonProps = Props<ButtonGroupProps> & {
  options: Option[];
  defaultIndex?: number;
  actionButtonProps?: Props<ButtonProps>;
  dropDownButtonProps?: DropDownButtonProps;
  menuProps?: Omit<MenuProps, 'open' | 'onClose' | 'id'>;
  menuItemProps?: Props<MenuItemProps>;
};

/**
 * A wrapper around a `ButtonGroup` that allows configuration
 *   of each option.
 *
 * Tried to give **as much as possible** freedom & customization by basically letting you
 *   customize all inner components through both this component's props and most components
 *   through `options`.
 *
 * Can specify form-related actions for buttons e.g. `type="submit"` by using
 *   `options[].actionButtonProps.type: 'submit'`.
 *
 * [Inspiration](https://mui.com/material-ui/react-button-group/#split-button)
 *
 * @param options
 * @param defaultIndex
 * @param actionButtonProps
 * @param dropDownButtonProps
 * @param menuProps
 * @param menuItemProps
 * @summary make sure to use `useMemo` for `options`, and `useCallback` for `options[].action`
 */
export default function ActionedSplitButton({
  options,
  defaultIndex = 0,
  actionButtonProps: { sx: actionButtonSx, ...actionButtonProps } = { sx: [] },
  dropDownButtonProps: { sx: dropDownButtonSx, ...dropDownButtonProps } = {
    sx: [],
  },
  menuProps,
  menuItemProps: { sx: menuItemSx, ...menuItemProps } = { sx: [] },
  ...props
}: ActionedSplitButtonProps) {
  const menuId = useId();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

  const selectedOption = useMemo(
    () => options[selectedIndex],
    [options, selectedIndex]
  );

  const open = anchorEl !== null;

  const handleOpenMenu = (event: React.MouseEvent) =>
    setAnchorEl(event.currentTarget.parentElement);
  const handleCloseMenu = useCallback(() => setAnchorEl(null), []);

  const handleToggleMenu = useCallback(
    (event: React.MouseEvent) => {
      open ? handleCloseMenu() : handleOpenMenu(event);
    },
    [open, handleCloseMenu]
  );

  const handleClick = () => {
    handleCloseMenu();
    selectedOption.action?.();
  };

  const handleMenuItemClick = (index: number) => {
    setSelectedIndex(index);
    handleCloseMenu();
  };

  return (
    <>
      <ButtonGroup {...props}>
        <Button
          onClick={handleClick}
          sx={[
            ...getSx(actionButtonSx),
            ...getSx(selectedOption.actionButtonProps?.sx),
          ]}
          {...actionButtonProps}
          {...withoutSx(selectedOption.actionButtonProps)}
        >
          {selectedOption.content ?? selectedOption.actionButtonContent}
        </Button>
        <Button
          aria-controls={open ? menuId : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select option"
          aria-haspopup="menu"
          onClick={handleToggleMenu}
          sx={[
            ...getSx(dropDownButtonSx),
            ...getSx(selectedOption.dropDownButtonProps?.sx),
          ]}
          {...dropDownButtonProps}
          {...withoutSx(selectedOption.dropDownButtonProps)}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Menu
        id={menuId}
        aria-expanded={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={open}
        onClose={handleCloseMenu}
        {...menuProps}
      >
        {options.map((option, index) => (
          <MenuItem
            key={index}
            selected={selectedIndex === index}
            onClick={() => handleMenuItemClick(index)}
            sx={[...getSx(menuItemSx), ...getSx(option.menuItemProps?.sx)]}
            {...menuItemProps}
            {...withoutSx(option.menuItemProps)}
          >
            {option.content ?? option.menuItemContent}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
