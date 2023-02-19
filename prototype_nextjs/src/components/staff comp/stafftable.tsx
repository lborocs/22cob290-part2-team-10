import { useState } from 'react';
import type { InferGetServerSidePropsType } from 'next';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { type TableCellProps } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import type { getServerSideProps } from '../../pages/staff';

import AlertDialogSlide from './dialog';
import SearchAppBar from './Search';

interface Column {
  id: keyof Data;
  label: string;
  minWidth?: number;
  align?: TableCellProps['align'];
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'name', label: 'User Name', minWidth: 170 },

  {
    id: 'email',
    label: 'User email',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'leftCompany',
    label: 'Employee status',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
];

interface Data {
  name: string;
  email: string;
  leftCompany: string;
}

function createData(
  name: Data['name'],
  email: Data['email'],
  leftCompany: Data['leftCompany']
): Data {
  return { name, email, leftCompany };
}

type User = InferGetServerSidePropsType<
  typeof getServerSideProps
>['users'][number];

export type stafftableProps = {
  users: User[];
};

export default function Stafftable({ users }: stafftableProps) {
  console.log(users);
  const rows: Data[] = users.map((user) =>
    createData(user.name, user.email, user.leftCompany ? 'left' : 'not_left')
  );
  console.log('rows =', rows);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filteredData, setFilteredData] = useState(rows);

  const handlesearch = (searchTerm: string) => {
    const filtered = rows.filter((user) => {
      return user.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredData(filtered);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <SearchAppBar onSearch={handlesearch} />

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" key={row.email}>
                    {columns.map((column) => {
                      const value = row[column.id];

                      if (column.id === 'name') {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {value}
                            <AlertDialogSlide email={row.email} />
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
