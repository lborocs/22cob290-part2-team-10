import { type Theme, styled } from '@mui/material/styles';

export type CircularColorInputProps = React.ComponentProps<'input'> & {
  inputSize?: React.CSSProperties['width'];
};

/**
 * Calculates a slightly lighter/darker color than `color`, depending on if it
 *  dark or light. If `color` is dark, returns a lighter color and vice versa.
 *
 * Figure out a color is dark by checking the return value of
 *  `theme.palette.getContrastText`.
 *
 * Calculate the similar color using `theme.palette.augmentColor`.
 *
 * @param color
 * @param theme
 */
function calculateBorderColor(color: string, theme: Theme): string {
  const contrastTextColor = theme.palette.getContrastText(color);

  const isDarkColor = contrastTextColor === '#fff';

  const augmented = theme.palette.augmentColor({
    color: {
      main: color,
    },
  });

  if (isDarkColor) return augmented.light;
  return augmented.dark;
}

// color input styling: https://stackoverflow.com/a/56814437
// there is also https://stackoverflow.com/a/41884762, but it's not a cross browser solution
/**
 * Custom circular color input. Because MUI doesn't have a proper implementation
 *  of `type=color`.
 */
export default styled(function CircularColorInput({
  inputSize,
  className,
  ...props
}: CircularColorInputProps) {
  return (
    <div className={className}>
      <input type="color" {...props} />
    </div>
  );
})(({ theme, inputSize = '2rem', value }) =>
  theme.unstable_sx({
    width: inputSize,
    aspectRatio: '1',
    overflow: 'hidden',
    bgcolor: value as string, // needed to fill
    borderRadius: '50%',
    border: '0.175em solid',
    borderColor: calculateBorderColor(value as string, theme),

    '& input': {
      width: '200%',
      height: '200%',
      // border: 0,
      // padding: 0,
      cursor: 'pointer',
      transform: 'translate(-25%, -25%)',
    },
  })
);
