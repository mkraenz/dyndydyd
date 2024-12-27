# Project dyndydyd

pronounced: done did it

## Requirements

- usable on desktop and android
- great UX for my use-cases
- no lag, but shared
- okay design
- recurring tasks
  - see habitica dailies
    - repeats weekly, daily, etc
    - every x weeks, days, etc
    - if weekly, then on which weekdays
- todos lists
  - sublists under common heading, whole list is also checkable
    - Task with checklist?
  - today (incl automatic date in title)
  - short term
  - mid term
    - weekly/monthly

## Requirements-derived architecture

- [x] Svelte 5
- [ ] mobile-first
- [ ] local-first
- [ ] PWA (installable on desktop mainly. maybe notifications.)
- [ ] Auth (via Google Signin?)
- [ ] Localization (just because i want to)
- [x] pico css for starters
- [ ] icons
- [ ] some backend for sync (maybe hono single sls function)
- [x] routing? (svelte kit)
- [ ] deployment

## sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Runes

```svelte
$props $state $effect
```

## Directives

```svelte
style:transform={flipped  'rotateY(0)' : ''}
style:--bg-1="black"

class:someClassName={mycondition}

use:someAction

# import transitions from svelte/transition
transition:someTransition
in:someTransition
out:someTransition
```

## Actions

js function that attaches to the lifecycle of a component. On mount, it gets called with the node. On unmount, the returned cleanup function gets called.

## Blocks

```svelte
{#if}{:else}{:else if}{/if}
{each colors as color}{/each}
{#key i}
```

svelte 5 todo list / task tracker

similar to habitica

<https://www.youtube.com/watch?v=uSWMvDPpG0k>

## Why

- I want to learn/refresh some Svelte
- habitica often lags and is occasionaly clunky

## How

- inside the mono repo
- with Svelte 5
