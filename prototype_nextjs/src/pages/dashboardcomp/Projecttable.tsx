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
import type { ResponseSchema as GetProjectsResponse } from '~/pages/api/projects/dashboardbackend';
import { getServerSideProps } from '../dashboard';

interface Column {
  id: keyof Data;
  label: string;
  minWidth?: number;
  align?: TableCellProps['align'];
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'projectName', label: 'Project Name', minWidth: 170 },
  //{ id: 'tasks', label: 'tasks', minWidth: 100 },
  // {
  //   id: 'deadline',
  //   label: 'deadline',
  //   minWidth: 170,
  //   align: 'right',
  //   format: (value: number) => value.toLocaleString('en-US'),
  // },
  {
    id: 'projectLeader',
    label: 'Project Leader',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'projectProgress',
    label: 'Project Progress',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'noOfTasks',
    label: 'Number of Tasks',
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  // {
  //   id: 'daysleft',
  //   label: 'days left',
  //   minWidth: 170,
  //   align: 'right',
  //   format: (value: number) => value.toFixed(2),
  // },
];

interface Data {
  projectName: string;
  projectLeader: string;
  projectProgress: `${number} / ${number}`;
  // projectProgress: string;
  noOfTasks: number;
}

function createData(
  projectName: Data['projectName'],
  projectLeader: Data['projectLeader'],
  projectProgress: Data['projectProgress'],
  noOfTasks: Data['noOfTasks']
): Data {
  return { projectName, projectLeader, projectProgress, noOfTasks };
}

type Project = InferGetServerSidePropsType<
  typeof getServerSideProps
>['projects'][number];

export type ProjectTableProps = {
  projects: Project[];
};

function getProjectProgress(project: Project): Data['projectProgress'] {
  const total = project.tasks.length;

  const completed = project.tasks.filter(
    (task) => task.stage === 'COMPLETED'
  ).length;

  return `${completed} / ${total}`;
}

export default function ProjectTable({ projects }: ProjectTableProps) {
  const rows: Data[] = projects.map((project) =>
    createData(
      project.name,
      project.leader.name,
      getProjectProgress(project),
      project.tasks.length
    )
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
