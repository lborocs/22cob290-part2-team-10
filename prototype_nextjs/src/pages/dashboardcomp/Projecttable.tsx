import { useState } from 'react';
import type { InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { type TableCellProps } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import type { getServerSideProps } from '../dashboard';
import hashids from '~/lib/hashids';
import SearchAppBar from '../staff comp/Search';

interface Column {
  id: keyof Data;
  label: string;
  minWidth?: number;
  align?: TableCellProps['align'];
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'projectName', label: 'Project Name', minWidth: 170 },
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
  {
    id: 'deadline',
    label: ' Project Deadline',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
];

interface Data {
  projectId: number;
  projectName: string;
  projectLeader: string;
  projectProgress: `${number} / ${number}`;
  // projectProgress: string;
  noOfTasks: number;
  deadline: string;
}

function createData(
  projectId: Data['projectId'],
  projectName: Data['projectName'],
  projectLeader: Data['projectLeader'],
  projectProgress: Data['projectProgress'],
  noOfTasks: Data['noOfTasks'],
  deadline: Data['deadline']
): Data {
  return {
    projectId,
    projectName,
    projectLeader,
    projectProgress,
    noOfTasks,
    deadline,
  };
}

type Project = InferGetServerSidePropsType<
  typeof getServerSideProps
>['projects_'][number];

export type ProjectTableProps = {
  projects: Project[];
};

export default function ProjectTable({ projects }: ProjectTableProps) {
  console.log(projects);
  const rows: Data[] = projects.map((project) =>
    createData(
      project.id,
      project.name,
      project.leader.name,
      `${project.completedtasks} / ${project.nooftasks}`,
      project.nooftasks,
      project.deadline == 'Invalid Date' ? 'N/A' : project.deadline
    )
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const [filteredData, setFilteredData] = useState(rows);

  const handlesearch = (searchTerm: string) => {
    const filtered = rows.filter((project) => {
      return project.projectName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
    setFilteredData(filtered);
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
                  <TableRow hover role="checkbox">
                    {columns.map((column) => {
                      const value = row[column.id];

                      if (column.id === 'projectName') {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <Link
                              href={`/projects/${hashids.encode(
                                row.projectId
                              )}`}
                            >
                              {value}
                            </Link>
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
