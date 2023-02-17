import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';

interface ProgressBarProps {
  value: number;
  max: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max }) => {
  // function to render a progress bar that shows the percentage of tasks that are incomplete
  let percentage;
  if (max != 0) {
    percentage = Math.floor((value / max) * 100);
  } else {
    percentage = 0;
  }

  return (
    <div>
      <Tooltip
        title={
          percentage > 0
            ? 'Percentage based off of the number of tasks completed'
            : ''
        }
      >
        <Paper
          sx={(theme) => ({
            position: 'relative',
            inset: 0,
            margin: 'auto',
            height: '20px',
            width: '90%',
            textAlign: 'center',
            borderRadius: 3,
            [theme.getColorSchemeSelector('light')]: {
              bgcolor: theme.vars.palette.makeItAllGrey.main,
              boxShadow: 3,
            },
          })}
        >
          <div
            style={{
              position: 'absolute',
              textAlign: 'center',
              width: '100%',
            }}
          >
            {max != 0 ? `${percentage}%` : 'No Tasks Assigned'}
          </div>
          <div
            style={{
              backgroundColor: 'grey',
              height: '100%',
              width: `${percentage}%`,
              borderRadius: 'inherit',
              textAlign: 'center',
            }}
          />
        </Paper>
      </Tooltip>
    </div>
  );
};

export default ProgressBar;
