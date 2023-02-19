import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import SearchIcon from '@mui/icons-material/Search';
import { TextField } from '@mui/material';

export default function SearchAppBar(props: { onSearch: (arg0: any) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const handlesearch = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchTerm(event.target.value);
    props.onSearch(event.target.value);
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          ></Typography>

          <form>
            <TextField
              id="search"
              label="Search"
              variant="outlined"
              value={searchTerm}
              onChange={handlesearch}
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
            />
          </form>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
