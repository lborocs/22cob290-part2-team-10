import { useEffect, useState } from 'react';
import TextField, { type TextFieldProps } from '@mui/material/TextField';

export type DebouncedTextFieldProps = Omit<
  TextFieldProps,
  'value' | 'onChange' | 'defaultValue'
> & {
  debounceTimeoutMs: number;
  initialValue?: string;
  onSearchSubmit(value: string): void;
  resetResults(): void;
};

/**
 * A controlled `TextField` that uses debouncing for better performance. Should be used for searching.
 *
 * @param debounceTimeoutMs The amount of time (ms) after user stops typing to wait before calling `onSearchSubmit`
 * @param initialValue The initial value, default `''`
 * @param onSearchSubmit The action to execute `debounceTimeoutMs`ms after user stops typing
 * @param resetResults The action to execute when value is empty
 * @see https://javascript.plainenglish.io/how-to-create-an-optimized-real-time-search-with-react-6dd4026f4fa9
 */
export default function DebouncedTextField({
  debounceTimeoutMs,
  initialValue = '',
  onSearchSubmit,
  resetResults,
  ...props
}: DebouncedTextFieldProps) {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(value);

  // update `value` after `debounceTimeoutMs` from last update of `debouncedValue`
  // i.e. `debounceTimeoutMs` after user stopped typing
  useEffect(() => {
    const timer = setTimeout(() => setValue(debouncedValue), debounceTimeoutMs);
    return () => clearTimeout(timer);
  }, [debounceTimeoutMs, debouncedValue]);

  useEffect(() => {
    if (value) {
      onSearchSubmit(value);
    } else {
      resetResults();
    }
  }, [value, onSearchSubmit, resetResults]);

  return (
    <TextField
      value={debouncedValue}
      onChange={(e) => setDebouncedValue(e.target.value)}
      {...props}
    />
  );
}
