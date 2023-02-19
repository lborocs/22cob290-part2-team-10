import React, { useState } from 'react';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { type Dayjs } from 'dayjs';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import prisma from '~/lib/prisma';
import { SidebarType } from '~/components/Layout';
import DropTarget from '~/components/home/UserDropTarget';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import type { CreateUserTaskResponse } from '~/pages/api/user/task/create-user-task';

import styles from '~/styles/home.module.css';

type SsrProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export type UserTask = Omit<SsrProps['todoList'][number], 'userId'>;

const HomePage: AppPage<SsrProps> = ({ user, todoList }) => {
  const [open, setOpen] = useState(false);
  const [titleTask, setTitle] = useState('');
  const [descriptionTask, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const tagList = tags.split(',');

  const [stage, setStage] = useState('');
  const [tasks, setTasks] = useState<UserTask[]>(todoList);

  const [deadline, setDeadline] = useState<Dayjs | null>(null);

  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setDescription('');
    setTags('');
    setDeadline(null);
  };

  const handleOpen = (stage: string) => {
    setOpen(true);
    setStage(stage);
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    if (
      titleTask.length == 0 ||
      descriptionTask.length == 0 ||
      deadline == null
    ) {
      return;
    }
    saveTask(e);
    handleClose();
  };

  const saveTask = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      const data = (await fetch('/api/user/task/create-user-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userid: user.id,
          stage,
          title: titleTask,
          description: descriptionTask,
          deadline: deadline!.toDate(),
          tags: {
            connectOrCreate: tagList.map((tag) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        }),
      }).then((response) => response.json())) as CreateUserTaskResponse;

      setTasks((tasks) => [
        ...tasks,
        {
          id: data.id,
          title: data.title,
          description: data.description,
          tags: data.tags,
          deadline: data.deadline,
          stage: data.stage,
        },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>Home - Make-It-All</title>
      </Head>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Title"
            id="taskTitle"
            value={titleTask}
            onChange={(event) => setTitle(event.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Description"
            id="taskDescription"
            value={descriptionTask}
            onChange={(event) => setDescription(event.target.value)}
            fullWidth
            multiline
            maxRows={2}
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Tags"
            id="taskTags"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
            placeholder="Separate by commas"
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Pick Deadline"
              value={deadline}
              onChange={(newValue: Dayjs | null) => {
                setDeadline(newValue);
              }}
              renderInput={(params: TextFieldProps) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            onClick={function (event) {
              handleSubmit(event);
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Container className={styles.content} component="main">
        <Box sx={{ fontWeight: 'bold' }}>
          <Typography variant="h4" component="div">
            HOME
          </Typography>
        </Box>

        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
          spacing={3}
        >
          <Grid item md={3} xs={12}>
            <Card className={styles.card}>
              <CardHeader
                titleTypographyProps={{ fontSize: 20 }}
                title="To Do"
              />
              <DndProvider backend={HTML5Backend}>
                <DropTarget tasks={tasks} setTasks={setTasks} stage="TODO" />
              </DndProvider>
              <CardActions className="d-grid">
                <Button variant="contained" onClick={() => handleOpen('TODO')}>
                  Add Task
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item md={3} xs={12}>
            <Card className={styles.card}>
              <CardHeader
                titleTypographyProps={{ fontSize: 20 }}
                title="In Progress"
              />
              <DndProvider backend={HTML5Backend}>
                <DropTarget
                  tasks={tasks}
                  setTasks={setTasks}
                  stage="IN_PROGRESS"
                />
              </DndProvider>
              <CardActions className="d-grid">
                <Button
                  variant="contained"
                  onClick={() => handleOpen('IN_PROGRESS')}
                >
                  Add Task
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item md={3} xs={12}>
            <Card className={styles.card}>
              <CardHeader
                titleTypographyProps={{ fontSize: 20 }}
                title="Code Review"
              />
              <DndProvider backend={HTML5Backend}>
                <DropTarget
                  tasks={tasks}
                  setTasks={setTasks}
                  stage="CODE_REVIEW"
                />
              </DndProvider>
              <CardActions className="d-grid">
                <Button
                  variant="contained"
                  onClick={() => handleOpen('CODE_REVIEW')}
                >
                  Add Task
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item md={3} xs={12}>
            <Card className={styles.completed}>
              <CardHeader
                titleTypographyProps={{ fontSize: 20 }}
                title="Completed"
              />
              <DndProvider backend={HTML5Backend}>
                <DropTarget
                  tasks={tasks}
                  setTasks={setTasks}
                  stage="COMPLETED"
                />
              </DndProvider>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

HomePage.layout = {
  sidebar: {
    type: SidebarType.PROJECTS,
  },
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = session.user as SessionUser;

  const todoList = await prisma.user
    .findUniqueOrThrow({
      where: {
        id: user.id,
      },
      select: {
        todoList: true,
      },
    })
    .todoList();

  const serializableTodoList = todoList.map((task) => ({
    ...task,
    deadline: task.deadline.toISOString(),
  }));

  return {
    props: {
      session,
      user,
      todoList: serializableTodoList,
    },
  };
}

export default HomePage;
