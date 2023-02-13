# Quickstart

From the project root, run these commands in the terminal:

1. Open Part 2 directory

```
cd prototype_nextjs
```

> **You need to have [pnpm](https://pnpm.io/) installed**

2. Install dependencies

```
pnpm install
```

3. Setup local development database

```
pnpm migrate:dev
```

> Note it may give an error like `email` failed unique constant. This is because some users are generated
> randomly and not in a collision-resistant way so some users could have the same email.
>
> Just delete the database file (`prisma/dev.db`) and rerun the command.
>
> Repeat this until it works (should work first time tbh)

4. Run

```
pnpm dev
```

5. Open `http://localhost:3000/` in your browser


## Shorthand

```
cd prototype_nextjs && pnpm i && pnpm migrate:dev && pnpm dev
```
