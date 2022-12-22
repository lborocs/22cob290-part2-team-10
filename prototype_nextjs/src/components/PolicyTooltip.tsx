import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip, { type TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

// source: https://mui.com/material-ui/react-tooltip/#customization
const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

export default function PolicyTooltip() {
  return (
    <BootstrapTooltip
      placement="top"
      title={
        <Typography variant="caption">
          At least 1 uppercase<br />
          At least 1 lowercase<br />
          At least 1 number<br />
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
