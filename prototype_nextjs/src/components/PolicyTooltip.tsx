import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip, {
  type TooltipProps,
  tooltipClasses,
} from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

// source: https://mui.com/material-ui/react-tooltip/#customization
const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.vars.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.vars.palette.common.black,
  },
}));

/**
 * A tooltip with a list of password policy requirements.#
 *
 * @see https://mui.com/material-ui/react-tooltip/
 */
export default function PolicyTooltip() {
  return (
    <BootstrapTooltip
      placement="top"
      aria-label="display password policy"
      title={
        <Typography variant="caption">
          At least 1 uppercase
          <br />
          At least 1 lowercase
          <br />
          At least 1 number
          <br />
          At least 1 special symbol
        </Typography>
      }
    >
      <IconButton>
        <InfoIcon />
      </IconButton>
    </BootstrapTooltip>
  );
}
