# Team 10 Group Project <!-- omit in toc -->

[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-f4981d0f882b2a3f0472912d15f9806d57e124e0fc890972558857b51b24a6f9.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=9416931)

## Table of Contents <!-- omit in toc -->

<!-- TOC -->
- [Part 1 (Prototype)](#part-1-prototype)
  - [How it works](#how-it-works)
    - [Submitted version](#submitted-version)
    - [Updated version](#updated-version)
  - [Pages](#pages)
  - [Libraries](#libraries)
- [Part 2 (Next.JS)](#part-2-nextjs)
  - [TODO (feedback from Part 1 presentation)](#todo-feedback-from-part-1-presentation)
  - [TODO (not from feedback)](#todo-not-from-feedback)
  - [How it works (Overview)](#how-it-works-overview)
  - [Architecture (?)](#architecture-)
    - [MUI](#mui)
    - [Docker](#docker)
  - [How we need to code](#how-we-need-to-code)
    - [Layout/Sidebar](#layoutsidebar)
      - [Examples](#examples)
    - [User](#user)
    - [Client-side state management](#client-side-state-management)
    - [Code Style/Formatting](#code-styleformatting)
      - [Absolute Imports](#absolute-imports)
      - [Import Order](#import-order)
  - [Pages](#pages-1)
    - [Dynamic Routes](#dynamic-routes)
  - [Database](#database)
    - [Entities](#entities)
    - [User passwords](#user-passwords)
    - [Using in development](#using-in-development)
  - [Libraries](#libraries-1)
<!-- TOC -->

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

## Part 2 (Next.JS)

URL: `TODO`

Deploy to Vercel for development before using GCP?

https://cloud.google.com/nodejs/getting-started/getting-started-on-compute-engine

> Think we also misunderstood the dashboard:
>
> "There should also be a manager’s dashboard so that the managers or team lead‐
> ers can keep track of the progression of the project they are responsible for."
>
> The dashboard is for _each_ project, and is more akin to the project overview that we were doing

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
- [x] Searchbar for projects in sidebar

### TODO (not from feedback)

- [ ] Project name editable (managers/team leaders only)
- [ ] Delete project (managers/team leaders only with confirmation dialog)
- [ ] Make page for creating a new project instead of using a modal
- [ ] Decide what goes in manager dashboard sidebar
  - Same as every other page? (list of projects)

### How it works (Overview)

- Using [NextAuth.js](https://next-auth.js.org/getting-started/client#usesession) which creates a session (with a JWT storing the user's info)

### Architecture (?)

TODO

- Package Manager: pnpm
- UI: React.Js
- Component Library: MUI Material UI
- Full stack framework (handles routing, SSR, etc.): Next.Js
- Database: MySQL
- Database ORM: Prisma
- HTTP Client: axios
- Containerisation: Docker
- Deployment: GCP

#### MUI

We are using an _experimental_ version of MUI's theming that supports
[CSS variables](https://mui.com/material-ui/experimental-api/css-theme-variables/overview/).
Despite it being "experimental", it has a lot of
[benefits](https://mui.com/material-ui/experimental-api/css-theme-variables/overview/#advantages)
such as:

- Prevents dark-mode SSR flickering
- Color scheme is automatically synced between browser tabs

The MUI docs explains how using it is
[different](https://mui.com/material-ui/experimental-api/css-theme-variables/overview/#mental-model)
to the standard use of MUI.

#### Docker

Using Docker Compose to run both the app and database together.

> > This Docker Compose file defines two services: `db` and `app`. The `db` service is based on the mysql:8.0 image
> > and exposes port 3306. It also defines several environment variables that configure the database. The `app`
> > service is built from the current directory and exposes port 3000. It also depends on the `db` service, which
> > means that the `db` service will be started before the `app` service. Finally, the file defines a volume called
> > `db-data`, which is used by the `db` service to store persistent data.
>
> ChatGPT explaining [docker-compose.prod.yaml](prototype_nextjs/docker-compose.prod.yaml)

### How we need to code

- For pages, you can copy and paste from [page_template](prototype_nextjs/src/pages/examples/page_template.tsx)
  - Already done for the pages available in navbar (`home`, `forum`, etc.)
  - For the pages already templated, you can do whatever you want with the actual component
- Use API routes to update database (e.g. for things like adding task)
- Use [SSR](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props) to get info for page (e.g. getting a user's todo list)
  - See [example](prototype_nextjs/src/pages/examples/user_ssr.tsx) for how to get user during SSR
  - Don't make API route for getting data that is gotten during SSR
- Run locally and see all examples at [`http://localhost:3000/examples`](http://localhost:3000/examples)

#### Layout/Sidebar

Your page component needs to be of type `AppPage`, e.g.:

```tsx
import type { AppPage } from '~/types';

const Page: AppPage = () => (
  <>
    Example
  </>
);

export default Page;
```

To use our defined layout (sidebar and nav in top), you need to [add the property `layout` to the file's default export](https://youtube.com/watch?v=R59e1Vl5lO8&t=331&si=EnSIkaIECMiOmarE):

| Prop                   | Type                                                     | Description                                  |
|------------------------|----------------------------------------------------------|----------------------------------------------|
| layout                 | `PageLayout`                                             | Basically `Layout`'s props                   |
| layout.sidebar         | `Sidebar`                                                |                                              |
| layout.sidebar.type    | `SidebarType`                                            |                                              |
| layout.sidebar.content | `ReactNode?` (only needed if `sidebarType` === `CUSTOM`) |                                              |

> `AppPage` adds type hints for the above for you

- Most pages will have a `layout.sidebar.type` of `PROJECTS`
  - e.g. main forum page should be `CUSTOM`
    - The different forum pages will probably have different sidebar content

If this is unclear, see examples:

##### Examples

- [Sidebar that lists the user's assigned projects](prototype_nextjs/src/pages/examples/projects_sidebar.tsx)
- [Custom sidebar](prototype_nextjs/src/pages/examples/custom_sidebar.tsx)
- [No sidebar](prototype_nextjs/src/pages/examples/no_sidebar.tsx)

#### User

There are two ways to know the user that is signed in:
1. Reading the `user` prop passed to the page component by `getServerSideProps` ([example](prototype_nextjs/src/pages/examples/user_ssr.tsx))
2. Reading `state.user` from the client-side store `store/userStore` (see next section) ([example](prototype_nextjs/src/pages/examples/user_userstore.tsx))

If on a page:
- if anything about the user can change while on your page (e.g. changing name), use number 1.
- else, prefer using number 2 but it's ntd

In a component:
- use number 2 because it won't be able to access `user` from `getServerSideProps` without passing it as a prop from the page

Example of using `useUserStore` (number 2):

```tsx
import useUserStore from '~/store/userStore';

export default function ExamplePage() {
  // this component will re-render whenever `name` changes
  const name = useUserStore((state) => state.user.name);

  return (
    <div>Your name is: {name}</div>
  );
}
```

#### Client-side state management

- Using [zustand](https://github.com/pmndrs/zustand)
- [Decent zustand youtube tutorial](https://youtu.be/sqTPGMipjHk)

We are using zustand in a way that is essentially dependency injection - we inject the user in `_app.jsx`. We do this
so that we don't repeatedly set the user in each page: instead we just set the user in one place - in `_app.jsx`.

#### Code Style/Formatting

- [Prettier](https://prettier.io/) (formatting) has been set up because it's a waste of time debating code format
  - If using VSCode, install the Prettier plugin and you just have to save a file to run the formatter
  - See https://prettier.io/docs/en/editors.html if not using VSCode
  - A git pre-commit hook has been set up to automatically format changed files using [pretty-quick](https://prettier.io/docs/en/precommit.html#option-2-pretty-quickhttpsgithubcomazzpretty-quick)
- ESLint (code style) has been set up
  - **Make sure your editor/IDE has ESLint support enabled, e.g. VSCode has the ESLint extension**

##### Absolute Imports

**Always** use absolute imports. It has been setup in the `tsconfig` to use a custom
[path](https://www.typescriptlang.org/tsconfig#paths) `~` with `/src` as the baseUrl.
E.g. to import the default export of `/src/components/ExampleComponent.ts` from _anywhere_, you would use

```ts
import ExampleComponent from '~/src/components/ExampleComponent';
```

E.g. to import `/public/exampleImage.png`:

```ts
import ExampleImage from '~/../public/exampleImage.png';
```

##### Import Order

Imports should be in the order ([example](prototype_nextjs/src/pages/profile.tsx)):

- External libraries
  - react (e.g. `useState`)
  - NextJs (e.g. `GetServerSidePropsContext`)
  - NextJs subpackages (e.g. `Head` from `next/head`)
  - Next-Auth (e.g. `signIn` from `next-auth/next`)
  - React Boostrap/UI library (e.g. `IconButton` from `@mui/material/IconButton`)
  - _Any other external libraries (e.g. `axios`)_
- [space]
- Our code e.g. from `~/types`
- [space]
- Other
  - External CSS
  - Our CSS (e.g. `[componentname].module.css`)
  - Images
  - _Anything else_

> Below isn't really necessary, but is nice, the grouping above is more important

In each of the above groups, imports should be in alphabetic order of the file they're being imported from or logically grouped:
- e.g. `next/head` imports go before `next/link`
- the meaning of "logically grouping" is very loose here, as long as the imports aren't a mess you're gucci

### Pages

Use dynamic routes instead of URL params, with similar functionality to a REST API

> Not sure about the forum pages that aren't yet templated
>
> Will want a page/option to list posts made by a certain user.
> Maybe on a post, make the author's name clickable, and it'll take u to /forum/authors/[authorId]
>
> > Atm there's a link to `/forum/authors` in the forum sidebar

| Page URL/Route            | Owner   | Status   | Completed             | Notes                                                                                    |
|---------------------------|---------|----------|-----------------------|------------------------------------------------------------------------------------------|
| `/`                       | Dara    | Complete | <ul><li>[x] </li><ul> | Automatically redirects to `/home` if signed in.                                         |
| `/home`                   | Michael | Complete | <ul><li>[x] </li><ul> |                                                                                          |
| `/projects`               | Lu      | Complete | <ul><li>[x] </li><ul> | Display all projects                                                                     |
| `/projects/[id]`          | Michael | Complete | <ul><li>[x] </li><ul> | A specific project, use `components/Task` and `components/KanbanBoard`                   |
| `/projects/[id]/overview` | Faye    | Complete | <ul><li>[x] </li><ul> | Manager's overview of a project. Can assign project members, update project leader/title |
| `/projects/new`           | Faye    | Complete | <ul><li>[x] </li><ul> | Creating a new project (accessed from manager dashboard)                                 |
| `/forum`                  | Ade     | Complete | <ul><li>[x] </li><ul> | ...                                                                                      |
| `/forum/authors/`         | Sean    | Complete | <ul><li>[x] </li><ul> | List authors                                                                             |
| `/forum/authors/[id]`     | Sean    | Complete | <ul><li>[x] </li><ul> | Display posts by a specific author                                                       |
| `/dashboard`              | David   | Complete | <ul><li>[x] </li><ul> | Projects progress                                                                        |
| `/staff`                  | David   | Complete | <ul><li>[x] </li><ul> |                                                                                          |
| `/profile`                | Dara    | Complete | <ul><li>[x] </li><ul> |                                                                                          |
| `/signup`                 | Lu      | Complete | <ul><li>[x] </li><ul> |                                                                                          |

#### Dynamic Routes

Use [hashids](https://hashids.org/) to mask IDs in URLs. Already done in:
- `projects/[id]/*`
- `/forum/posts/[id]/*`

### Database

We are using [Prisma](https://github.com/prisma/prisma) as an ORM, so we have type safety + don't have to write SQL.
Prisma also has nice features such as
[auto-joins](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#nested-reads)
and
[implicit many-to-many relations](https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/working-with-many-to-many-relations#implicit-relations).

#### Entities

All have unique IDs (`autoincrement`/`uuid`)

<details>
<summary>User</summary>

| Name               | Type            | Default   | Relation        | Description                                                                   |
|--------------------|-----------------|-----------|-----------------|-------------------------------------------------------------------------------|
| id                 | `String` (UUID) | `uuid()`  |                 |                                                                               |
| email              | `String`        |           |                 |                                                                               |
| hashedPassword     | `String`        |           |                 |                                                                               |
| name               | `String`        |           |                 |                                                                               |
| isAdmin            | `Boolean`       | `false`   |                 |                                                                               |
| leftCompany        | `Boolean`       | `false`   |                 |                                                                               |
| inviteToken        | `String?`       |           |                 | The invite token they used to sign up.                                        |
| avatarBg           | `String`        | `#e2ba39` |                 |                                                                               |
| avatarFg           | `String`        | `#ffffff` |                 |                                                                               |
| todoList           | -               |           | `UserTask[]`    | Implicit many-to-many relation.                                               |
| isManager          | `Boolean`       | `false`   |                 |                                                                               |
| ledProjects        | -               |           | `Project[]`     | Implicit many-to-many relation. The projects where the user is a team leader. |
| assignedProjects   | -               |           | `Project[]`     | Implicit many-to-many relation. The projects where the user is a team member. |
| permittedTasks     | -               |           | `ProjectTask[]` | Implicit many-to-many relation.                                               |
| posts              | -               |           | `Post`          | Implicit many-to-many relation.                                               |
| editedPostsHistory | -               |           | `PostHistory[]` | Implicit many-to-many relation.                                               |
| upvotedPosts       | -               |           | `Post`          | Implicit many-to-many relation.                                               |

</details>

<details>
<summary>User Task</summary>

| Name        | Type            | Default           | Relation        | Description                     |
|-------------|-----------------|-------------------|-----------------|---------------------------------|
| id          | `Int`           | `autoincrement()` |                 |                                 |
| userId      | `String` (UUID) |                   | `User`          |                                 |
| stage       | `String`        |                   |                 |                                 |
| title       | `String`        |                   |                 |                                 |
| description | `String`        |                   |                 |                                 |
| deadline    | `DateTime`      |                   |                 |                                 |
| tags        | -               |                   | `UserTaskTag[]` | Implicit many-to-many relation. |

- `UserTaskTag` is just `{ name: string }`

</details>

<details>
<summary>Project</summary>

| Name     | Type            | Default           | Relation        | Description                     |
|----------|-----------------|-------------------|-----------------|---------------------------------|
| id       | `Int`           | `autoincrement()` |                 |                                 |
| name     | `String`        |                   |                 |                                 |
| leaderId | `String` (UUID) |                   | `User`          |                                 |
| members  | -               |                   | `User[]`        | Implicit many-to-many relation. |
| tasks    | -               |                   | `ProjectTask[]` |                                 |

</details>

<details>
<summary>Project Task</summary>

| Name        | Type            | Default           | Relation           | Description                                                                           |
|-------------|-----------------|-------------------|--------------------|---------------------------------------------------------------------------------------|
| id          | `Int`           | `autoincrement()` |                    |                                                                                       |
| projectId   | `Int`           |                   | `Project`          |                                                                                       |
| stage       | `String`        |                   |                    |                                                                                       |
| title       | `String`        |                   |                    |                                                                                       |
| description | `String`        |                   |                    |                                                                                       |
| deadline    | `DateTime`      |                   |                    |                                                                                       |
| tags        | -               |                   | `ProjectTaskTag[]` | Implicit many-to-many relation.                                                       |
| assigneeId  | `String` (UUID) |                   | `User`             |                                                                                       |
| permitted   | -               |                   | `User[]`           | Implicit many-to-many relation. The team member that are permitted to view this task. |

- `ProjectTaskTag` is just `{ name: string }`

</details>

<details>
<summary>Post</summary>

| Name     | Type            | Default           | Relation        | Description                     |
|----------|-----------------|-------------------|-----------------|---------------------------------|
| id       | `Int`           | `autoincrement()` |                 |                                 |
| authorId | `String` (UUID) |                   | `User`          |                                 |
| topics   | -               |                   | `PostTopic[]`   | Implicit many-to-many relation. |
| upvoters | -               |                   | `User[]`        | Implicit many-to-many relation. |
| history  | -               |                   | `PostHistory[]` |                                 |

- `PostTopic` is just `{ name: string }`

</details>

<details>
<summary>PostHistory</summary>

Many-to-many relationship table representing User (editor) <-> Post,
with additional properties.

| Name     | Type       | Default           | Relation | Description |
|----------|------------|-------------------|----------|-------------|
| id       | `Int`      | `autoincrement()` |          |             |
| postId   | `Int`      |                   | `Post`   |             |
| editorId | `String`   |                   | `User`   |             |
| date     | `DateTime` | `now()`           |          |             |
| title    | `String`   |                   |          |             |
| summary  | `String`   |                   |          |             |
| content  | `String`   |                   |          |             |

</details>

TODO: ERM diagram?

#### User passwords

- Store a hash of each user's password in database
  - User's raw password is not stored in database :heavy_check_mark:
- Hash their passwords using bcrypt
(
[Article](https://codahale.com/how-to-safely-store-a-password/) -
[Library](https://github.com/kelektiv/node.bcrypt.js) -
[Wikipedia](https://en.wikipedia.org/wiki/Bcrypt)
)

> Should we implement functionality to reset password?
>
> But how would it work?
>
> A possible impl.:
>   - manager gets a link to give to employee (with like a token specifying the employee)
>   - employee opens that link and resets their password
>
> cons:
>   - manager could reset the password of any employee they want (could abuse it)
>     - we should ask client about this?

#### Using in development

When running for the first time, run the following commands (in `prototype_nextjs`):

```shell
npm run migrate:dev
```

This will create a local SQLite database (`prototype_nextjs/prisma/dev.db`), apply our schema to it and
[populate it with data](https://www.prisma.io/docs/guides/database/seed-database)
from the
[seed](prototype_nextjs/prisma/seed.ts).

### Libraries

| Name                                                                                  | Minor Version | Purpose                                                                                                |
|---------------------------------------------------------------------------------------|---------------|--------------------------------------------------------------------------------------------------------|
| [TypeScript](https://www.typescriptlang.org/)                                         | 4.9           | Programming language                                                                                   |
| [ESLint](https://eslint.org/)                                                         | 8.31          | Static code analysis                                                                                   |
| [Typescript ESLint](https://typescript-eslint.io/)                                    | 5.48          | ESLint Typescript support                                                                              |
| [Prettier](https://prettier.io/)                                                      | 2.8           | Code formatting ([#56][iPrettier])                                                                     |
| [husky](https://github.com/typicode/husky)                                            | 8.0           | Git hooks                                                                                              |
| [pretty-quick](https://github.com/azz/pretty-quick)                                   | 3.1           | Run prettier on changed files as part of pre-commit Git hook                                           |
| [React](https://reactjs.org/)                                                         | 18.2          | UI library                                                                                             |
| [Next.Js](https://nextjs.org/)                                                        | 13.1          | Full stack framework                                                                                   |
| [NextAuth.js](https://next-auth.js.org/)                                              | 4.17          | Authentication                                                                                         |
| [sharp](https://nextjs.org/docs/messages/sharp-missing-in-production)                 | 0.31          | Next.Js Image Optimization (not used explicitly by us)                                                 |
| [next-superjson-plugin](https://github.com/blitz-js/next-superjson-plugin)            | 0.5           | SuperJSON plugin for Next.Js pages, so we dont have to manually serialie & deserialize dates           |
| [MUI Material UI](https://mui.com/)                                                   | 5.11          | Component Library ([#40][iMui])                                                                        |
| [MUI Material UI Lab](https://mui.com/material-ui/about-the-lab/)                     | 5.0           | MUI Components not yet added to core (e.g. `LoadingButton`)                                            |
| [MUI Material Icons](https://mui.com/material-ui/getting-started/installation/#icons) | 5.11          | MUI Icons                                                                                              |
| [Emotion](https://emotion.sh/)                                                        | 11.10         | Styling engine for MUI, and styled components                                                          |
| [Roboto](https://mui.com/material-ui/getting-started/installation/#roboto-font)       | 4.5           | MUI default font                                                                                       |
| [react-hot-toast](https://react-hot-toast.com/)                                       | 2.4           | Toasts                                                                                                 |
| [Axios](https://axios-http.com/)                                                      | 1.2           | HTTP client (use instead of the `fetch` API)                                                           |
| [zustand](https://github.com/pmndrs/zustand)                                          | 4.2           | State management                                                                                       |
| [Prisma](https://www.prisma.io/)                                                      | 4.8           | Database ORM ([#12][iPrisma])                                                                          |
| [ts-node](https://typestrong.org/ts-node/)                                            | 10.9          | Run code to [seed Prisma database](https://www.prisma.io/docs/guides/database/seed-database)           |
| [node.bcrypt.js](https://github.com/kelektiv/node.bcrypt.js)                          | 5.1           | Hashing user passwords                                                                                 |
| [Zod](https://zod.dev/)                                                               | 3.20          | Object schema validation ([#1][pFormikZod])                                                            |
| [Formik](https://formik.org/)                                                         | 2.2           | Form validation ([#1][pFormikZod])                                                                     |
| [formik-validator-zod](https://github.com/Glazy/formik-validator-zod)                 | 1.0           | Zod adapter for Formik ([Formik uses Yup](https://formik.org/docs/guides/validation#validationschema)) |
| [SWR](https://swr.vercel.app/)                                                        | 4.18          | Client-side data fetching                                                                              |
| [hashids](https://hashids.org/)                                                       | 2.2           | Mask IDs in URLs ([#16][iHashids])                                                                     |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)                            | 9.0           | Generate invite tokens ([#19][iJwt])                                                                   |
| [dotenv](https://github.com/motdotla/dotenv)                                          | 16.0          | Load development environment variables during database seeding                                         |
| [lodash](https://lodash.com/)                                                         | 4.17          | Utility library                                                                                        |
| [lorem-ipsum](https://github.com/knicklabs/lorem-ipsum.js)                            | 2.0           | Generating placeholder text (for seeding)                                                              |
| [usehooks-ts](https://usehooks-ts.com/)                                               | 2.9           | Utility React hooks                                                                                    |
| [type-fest](https://github.com/sindresorhus/type-fest)                                | 3.5           | Utility TypeScript types                                                                               |
| [clsx](https://github.com/lukeed/clsx)                                                | 1.2           | Utility library for constructing classnames                                                            |
| [remarkable](https://github.com/jonschlinkert/remarkable)                             | 2.0           | Rendering markdown content                                                                             |
| ...                                                                                   |               |                                                                                                        |

<!-- https://stackoverflow.com/a/42424860 -->
[pFormikZod]: https://github.com/lborocs/22cob290-part2-team-10/pull/1
[iPrisma]: https://github.com/lborocs/22cob290-part2-team-10/pull/12
[iHashids]: https://github.com/lborocs/22cob290-part2-team-10/issues/16
[iJwt]: https://github.com/lborocs/22cob290-part2-team-10/issues/19
[iMui]: https://github.com/lborocs/22cob290-part2-team-10/issues/40
[iPrettier]: https://github.com/lborocs/22cob290-part2-team-10/issues/56
