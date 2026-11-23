# Daymark — To-Do Productivity App

Daymark is a small, responsive task manager MVP. It demonstrates a working task workflow that can run as a static site or in a Docker container. The current MVP stores data in the browser's local storage; it does not yet include accounts, a server API, a database, or AI recommendations.

## MVP features

- Add tasks with an optional due date
- Edit task titles, mark tasks complete, and delete tasks
- Filter the list by all, active, or completed tasks
- See open and completed counts plus completion progress
- Keep tasks between visits in the same browser
- Responsive layout for desktop and mobile

## Run locally

Open `index.html` directly in a modern browser, or serve the project directory with any static web server. No build step or application dependencies are required.

## Run with Docker

Build and start the Nginx container:

```sh
docker build -t daymark-mvp .
docker run --rm -p 8080:8080 daymark-mvp
```

Then open <http://localhost:8080>. Docker must be installed and running.

## Project status and next steps

The Unit 12 MVP implements the core task workflow. It is a front-end-only prototype and is not suitable for multi-user or cross-device task storage yet. Planned follow-up work includes user accounts, a backend and persistent database, AI task assistance, automated deployment, and accessibility review.

## AI usage

ChatGPT was used as a coding assistant to scaffold the MVP, suggest the interaction and layout structure, and draft this documentation. The generated code and instructions should be reviewed and adapted by the project author. No AI API is called by the application.

## Project management and submission links

- GitHub repository: <https://github.com/Eleftherioug/todo-productivity-app>
- Google Cloud Run deployment: <https://todo-productivity-app-592279594473.us-central1.run.app>
- Jira project: add the public project URL here
- Confluence space: add the public space URL here

Replace the Jira and Confluence placeholders with the public project and space URLs before submission.
