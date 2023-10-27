# [Exercise Tracker](https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/exercise-tracker)

## Link to Live Page:
[Replit Link](https://replit.com/@DanielSandova11/boilerplate-project-exercisetracker#.replit)

## Description:
The Exercise Tracker is a web application designed to help users keep track of their exercises and workouts. It allows users to create exercise entries, view exercise logs, and retrieve information about specific exercises. This tool is particularly beneficial for individuals who want to maintain detailed exercise records or for trainers who need to monitor the progress of their clients.

## Testing Instructions:
To test the Exercise Tracker project, you can use the provided user stories as test cases. Here are the specific requirements to check:

1. **User Story #1:** You can create a new user by making a POST request to `**/api/users**` with a username. The response should contain the new user object, including a unique `_id`.
2. **User Story #2:** You can retrieve a full list of users by making a GET request to `/api/users`. The response should contain an array of user objects.
3. **User Story #3:** You can add a new exercise to a user by making a POST request to `/api/users/:_id/exercises`. The response should contain the user's details and the added exercise.
4. **User Story #4:** You can retrieve an exercise log for a specific user by making a GET request to `/api/users/:_id/exercises`. The response should contain the user's details, an array of exercises, and their respective details.
5. **User Story #5:** You can retrieve an exercise log for a specific user with specific filters (from, to, and limit) by making a GET request to `/api/users/:_id/exercises`. The response should contain the user's details, an array of exercises meeting the specified criteria, and their details.
