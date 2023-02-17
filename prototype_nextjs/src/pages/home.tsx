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
import TextField, { TextFieldProps } from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import prisma from '~/lib/prisma';
import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

import styles from '~/styles/home.module.css';
import DropTarget from '~/components/UserDropTarget';

// TODO: HomePage
const HomePage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ user, userTodoList }) => {
  const [open, setOpen] = useState(false);
  const [titleTask, setTitle] = useState('');
  const [descriptionTask, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const tagList = tags.split(',');

  const [stage, setStage] = useState('');
  const [tasks, setTasks] = useState<any[]>(userTodoList);

  const [deadlineTask, setDeadline] = useState<Dayjs | null>(null);

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
      tags.length == 0 ||
      deadlineTask == null
    ) {
      return;
    }

    setTasks([
      ...tasks,
      {
        id: tasks.length + 1,
        title: titleTask,
        description: descriptionTask,
        tags: tagList,
        deadline: deadlineTask,
        stage,
      },
    ]);

    saveTask(e);

    handleClose();
  };

  const saveTask = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      await fetch('~/api/user/create-user-task', {
        method: 'POST',
        body: JSON.stringify({
          userId: user.id,
          User: user,
          title: titleTask,
          description: descriptionTask,
          tags: tagList,
          deadline: deadlineTask,
          stage,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
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
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Pick Deadline"
              value={deadlineTask}
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

      <Container className={styles.content}>
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
    </main>
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

  // TODO: get their todo list from prisma
  const userTodoList = await prisma.user.findMany({
    where: {
      id: user.id,
    },
    select: {
      todoList: {
        select: {
          id: true,
          stage: true,
          title: true,
          description: true,
          deadline: true,
          tags: true,
        },
      },
    },
  });

  return {
    props: {
      session,
      user,
      userTodoList,
    },
  };
}

export default HomePage;
