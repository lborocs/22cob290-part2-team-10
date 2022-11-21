# Team 10 Group Project <!-- omit in toc -->

## Table of Contents <!-- omit in toc -->

<!-- TOC -->
- [TODO](#todo)
- [Part 1 (Prototype)](#part-1-prototype)
  - [How it works](#how-it-works)
    - [Submitted version](#submitted-version)
    - [Updated version](#updated-version)
  - [Pages](#pages)
  - [Libraries](#libraries)
- [Part 2 Plan (Next.JS)](#part-2-plan-nextjs)
  - [TODO (feedback from Part 1 presentation)](#todo-feedback-from-part-1-presentation)
  - [TODO (not from feedback)](#todo-not-from-feedback)
  - [How it works](#how-it-works-1)
  - [How we need to code](#how-we-need-to-code)
    - [Layout/Sidebar](#layoutsidebar)
      - [Examples](#examples)
  - [Pages](#pages-1)
  - [Libraries](#libraries-1)
<!-- TOC -->

## TODO

TODO at some point (not feedback from client):

- [x] Store logged-in user using cookies
- [ ] Move template CSS & JS to 1 file which get imported into all pages to repeat less
- [ ] Move hardcoded values from JS to PHP backend (not that much)
  - [ ] I think this is only needed for staff assignment page

> **Might not need to do these at all for Part 2**

## Part 1 (Prototype)

URL: `http://team10.sci-project.lboro.ac.uk/` (submitted)

or `http://team10.sci-project.lboro.ac.uk/t10/` (updated)

### How it works

Top-level PHP files acting as pages (using a custom `.htaccess` file to hide file extension)

#### Submitted version

- A redirect is made in the form of a POST request to the new page, with the user's details as form parameters
\- [redirect/index.ts](https://github.com/f-okd/Team-10-Team-Project/blob/f550d80308126a3c18ea113c5e857acf5d65ad23/prototype/src/utils/redirect/index.ts)
- The user's email and role are stored in the attribute `data-user` of the `html` tag

#### Updated version

- Store logged-in user's email in a cookie (1 hour expiry - can change)
- Cookie is automatically sent to server whenever they change page
- If the cookie is not detected, they will be redirected to the login page.

### Pages

| Page URL            | Owner      | Notes                                                                                |
|---------------------|------------|--------------------------------------------------------------------------------------|
| `/`                 | Dara       | Can make `/` display home instead and if user isn't logged in, redirect to `/login`? |
| `/home`             | Michael/Lu |                                                                                      |
| `/projects`         | Michael/Lu | Displays a grid of assigned projects (only on updated version)                       |
| `/projects?name=`   | Michael/Lu | Displays the kanban board for that project                                           |
| `/forum`            | Ade        |                                                                                      |
| `/dashboard`        | David      |                                                                                      |
| `/staff_assignment` | Faye       |                                                                                      |
| `/profile`          | Dara       |                                                                                      |
| `/signup`           | Dara       | Can merge signup and login?                                                          |

### Libraries

- jQuery 3.6.1
- Bootstrap 5/5.2/4.1.0
  - Popper.js
- Bootstrap Icons 1.9.1
- Font-Awesome (only icons used?) 5.0.13

## Part 2 Plan (Next.JS)

URL: `TODO`

Deploy to Vercel for development before using GCP?

https://cloud.google.com/nodejs/getting-started/getting-started-on-compute-engine

### TODO (feedback from Part 1 presentation)

- Forum
  - Redesign
  - Organised by topics
  - Should be more like Wikipedia
- Projects
  - More detailed info about tasks (maybe display a modal containing task info when it is clicked on)
    - Deadline
    - Estimated time to take? (hours)
- Dashboard
  - Progress display needs to be in terms of time not % of tasks completed
  - Searchbar to find project
  - Searchbar to find employee
  - Create project
    - Assign team leader
    - More info when adding project
      - How many hours for project etc.
- Searchbar for projects in sidebar

### TODO (not from feedback)

- [ ] Project name editable (managers/team leaders only)
- [ ] Make page for creating a new project instead of using a modal
- [ ] Decide what goes in manager dashboard sidebar
  - Same as every other page? (list of projects)

### How it works

- Using [NextAuth.js](https://next-auth.js.org/getting-started/client#usesession) which creates a session (with a JWT storing the user's info)

### How we need to code

- Use API routes to update database (e.g. for things like adding task)
- Use [SSR](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props) to get info for page (e.g. getting a user's todo list)
  - See [example](prototype_nextjs/src/pages/examples/user_ssr.tsx) for how to get user during SSR
  - Don't make API route for getting data that is gotten during SSR
  - Access `/server/store` functions directly instead
    - Make them all `async` because database operations will be `async`
- You can copy and paste from [page_template](prototype_nextjs/src/pages/examples/page_template.tsx)
  - Already done for the pages available in navbar (`home`, `forum`, etc.)
- Run locally and see all examples at [`http://localhost:3000/examples`](http://localhost:3000/examples)

#### Layout/Sidebar

Need to wrap your page's content in a `Layout` component

| Prop           | Type                                                  | How to get it                                                                                                   |
|----------------|-------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| sidebarType    | 'project' &#124; 'custom'                             | Use your brain                                                                                                  |
| sidebarContent | `ReactNode` (only needed if `sidebarType` === custom) | Create a custom component (see [custom sidebar example](prototype_nextjs/src/pages/examples/custom_sidebar.tsx) |
| user           | `UserInfo` (server/store/users)                       | Get from SSR                                                                                                    |

- Most pages will have a `sidebarType` of `project`
  - e.g. forum should be `custom`

##### Examples

- [Sidebar that lists the user's assigned projects](prototype_nextjs/src/pages/examples/projects_sidebar.tsx)
- [Custom sidebar](prototype_nextjs/src/pages/examples/custom_sidebar.tsx)

### Pages

Use dynamic routes instead of URL params, with similar functionality to a REST API

> Not sure about the forum pages

| Page URL                              | Owner | Status       | Completed             | Notes                                                                                  |
|---------------------------------------|-------|--------------|-----------------------|----------------------------------------------------------------------------------------|
| `/`                                   | Dara  | Complete     | <ul><li>[x] </li><ul> | Can make `/` display home instead and if user isn't logged in, redirect to `/login`?   |
| `/home`                               |       | Templated    |                       |                                                                                        |
| `/projects`                           |       | Templated    |                       | Display all projects                                                                   |
| `/projects/[name]`                    |       | Templated    |                       | A specific project, use `components/Task` and `components/KanbanBoard`                 |
| `/forum`                              |       | Templated    |                       | Displays all forum topics (TODO: forum redesign)                                       |
| `/forum?topics=[topic1],[topic2],...` |       |              |                       | Posts with the specified topics (dynamic page with updating url without changing page) |
| `/forum/[topicname]`?                 |       |              |                       | Displays post summaries for a topic (click to open the page for that post)             |
| `/forum/posts`                        |       |              |                       | Display all posts                                                                      |
| `/forum/posts/[id]`                   |       |              |                       | Display a specific post                                                                |
| `/dashboard`                          |       | Templated    |                       |                                                                                        |
| `/staff_assignment`                   |       |              |                       | I think we should rename this URL                                                      |
| `/profile`                            | Dara  | In progress  | <ul><li>[ ] </li><ul> |                                                                                        |
| `/signup`                             |       | Templated    |                       | Can merge signup and login?                                                            |

### Libraries

- TypeScript 4.9
- Next.js 13
  - Next-Auth
- React 18
- Bootstrap 5.2
- React Bootstrap 2.6
- React Boostrap Icons 1.9
- Font Awesome Icons 6.2
- ESLint 8.27
  - TODO: setup Prettier
- Prisma
- Axios 1.1
- ...
