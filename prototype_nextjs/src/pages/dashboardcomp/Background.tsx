import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

// unused file? delete?

interface Column {
  id:
    | 'projectName'
    | 'dateAssigned'
    | 'deadline'
    | 'projectLeader'
    | 'daysleft';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'projectName', label: 'Project Name', minWidth: 170 },
  { id: 'dateAssigned', label: 'Date Assigned', minWidth: 100 },
  {
    id: 'deadline',
    label: 'deadline',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'projectLeader',
    label: 'Project Leader',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'daysleft',
    label: 'days left',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toFixed(2),
  },
];

interface Data {
  projectName: string;
  dateAssigned: string;
  deadline: string;
  projectLeader: string;
  daysleft: number;
}

function createData(
  projectName: string,
  dateAssigned: string,
  deadline: string,
  projectLeader: string,
  daysleft: number
): Data {
  return { projectName, dateAssigned, deadline, projectLeader, daysleft };
}

const rows = [
  createData('Project 1', '01/01/2023', '01/01/2023', 'John', 5),
  createData('Project 2', '02/01/2023', '01/01/2023', 'Cerys', 6),
  createData('Project 3', '03/01/2023', '01/01/2023', 'Goob', 5),
  createData('Project 4', '04/01/2023', '01/01/2023', 'Hamm', 5),
  createData('Project 5', '05/01/2023', '01/01/2023', 'Hanks', 7),
  createData('Project 1', '01/01/2023', '01/01/2023', 'John', 5),
  createData('Project 2', '02/01/2023', '01/01/2023', 'Cerys', 6),
  createData('Project 3', '03/01/2023', '01/01/2023', 'Goob', 5),
  createData('Project 4', '04/01/2023', '01/01/2023', 'Hamm', 5),
  createData('Project 5', '05/01/2023', '01/01/2023', 'Hanks', 7),
  createData('Project 3', '03/01/2023', '01/01/2023', 'Goob', 5),
  createData('Project 4', '04/01/2023', '01/01/2023', 'Hamm', 5),
  createData('Project 5', '05/01/2023', '01/01/2023', 'Hanks', 7),
];

export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox">
                    {columns.map((column) => {
                      const value = row[column.id];
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
