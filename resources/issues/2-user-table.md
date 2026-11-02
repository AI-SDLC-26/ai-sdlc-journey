# GitHub Issue #2: [US] Show all users in a table

- Repository: `AI-SDLC-26/ai-sdlc-journey`
- URL: https://github.com/AI-SDLC-26/ai-sdlc-journey/issues/2
- State: Open
- Label: enhancement

## Submission checklist

- [x] I searched for existing related issues / epics first.
- [x] I described the problem clearly.
- [x] I added testable acceptance criteria.
- [x] I defined what is in scope and out of scope.

## Short summary

Allow platform users to see the list of users.

## User story statement

As a stakeholder of the application I want users to be able to see the list of users with their name, role and status, so they are able to get to know them and probably contact in the future.

## Problem

Right now we have an internal platform where the users are not aware of who is using this new initiative. They think they are alone using the platform which undermines usage and interactions. We want to start giving them the sense of community, and offer new functionalities in the future, like interactions (likes), other types of feedback, and so on.

## Dependencies

API exposing a new endpoint to offer this new user list functionality. On the other hand, the SPA must add a new table component to show this information.

We have no ongoing blockers or related work.

## Acceptance criteria

- Given a user, when they enter the `/users` page, then they will be presented with the list of users with name, status and role.
- Given no users, when they enter the `/users` page, then they will be presented with a `No available users` text.

## In scope

- Create default list of users with mock data on a new endpoint `/users` on the backend.
- Show a basic table, with no controls, no pagination and a default design in the SPA.
- Contemplate the cases where no users are available.

## Out of scope

1. Possible errors of the API.
2. No database for this new user story, just in-memory data.
3. Specific design.

## Comments

No issue comments were present when retrieved from GitHub.
