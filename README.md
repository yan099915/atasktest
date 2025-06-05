# GitHub User Search App

## Project Overview

This React project is a GitHub user search app that allows users to:

- Search GitHub users by username query.
- Display up to 5 matched users.
- Click on a user to fetch and show their public repositories.
- View repository details including name, watchers, and description.

The app uses the GitHub public API for fetching users and repositories.

---

## Features

- User search with input validation (cannot be empty).
- Display user avatars, usernames with clickable GitHub links.
- Expand user to show repositories with name, watchers, and description.
- Loading indicators while fetching repositories.
- Handles cases when no repositories are found.

---

## Tech Stack

- React (Client-side rendering)
- TypeScript
- Tailwind CSS for styling
- Jest & React Testing Library for unit and integration testing
- Mocking `fetch` API calls in tests

---

## Getting Started

### Prerequisites

- Node.js (v16 or newer recommended)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/github-user-search.git
   cd github-user-search
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Running the App
   ```
   npm run dev
   ```
4. Running testing
   ```
   npm run test
   ```

## What Is Tested

- Rendering of search input and search button.
- Validation preventing empty searches.
- Searching users and rendering a list of up to 5 users.
- Clicking on a user to fetch and display their repositories.
- Displaying loading states and handling empty repository lists.
- Integration flow from input, search, user selection, to repository display.
