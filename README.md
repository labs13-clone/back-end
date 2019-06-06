# API Documentation

## Backend delpoyed at [Heroku](https://clone-coding-server.herokuapp.com/) <br>

##  Getting started
- Clone this repo
- **yarn install** to install all required dependencies
- **yarn dev** to start the local server
- **yarn test** to start server using testing environment

  
- **yarn db_start_dev** to start docker development postgres database
- **yarn db_start_test** to start docker testing database
- **yarn db_reset_dev** to migrate and rollback seeds in developer database
- **yarn db_reset_test** to migrate and rollback seeds in developer tests
- **yarn db_stop_dev** burns down development database
- **yarn db_stop_test** burn down tests database
  
## Made using Express backend framework

### We used this framework for these reasons

-  Minimal and flexible.
-  Highly customizable.
-  Written in javascript, allowing us to write in same language for front and backend.
- Compatable with AuthO libraries.

# Route List
## Get user ID out of the req.headers.users which is populated in the auth middleware
* /api/user
* /api/challenges
* /api/challenges/:id
* /api/challenges
* /api/submissions
* /api/validation/:id

# Getting user profile information

## GET /api/user

- Xp level / Experience
--- Sent 

```
{
 access token in header
}
```

--- Received 201

```
{
  xp : Number
}
```

---

# Creating a new code challenge

## POST /api/challenges

- Allow any registered user to create a challenge
- Double check the approved column is false
- Validate format of payload

--- Sent body payload

```
{
  title: STRING - Required - Unique
  description: STRING - Required
  tests: STRING - Required
  skeleton_function: STRING - Required
  solution: STRING - Required
  difficulty: STRING - Required
}
```

--- Received 201

```
{
  id:NUMBER
  title: STRING - Required - Unique
  description: STRING - Required
  tests: STRING - Required
  skeleton_function: STRING - Required
  solution: STRING - Required
  difficulty: STRING - Required
}
```

# Editing an existing code challenge

## PUT /api/challenges/:id

- Only owner of challenge can edit
- For users to edit unapproved challenges they created
- For admins to edit any unapproved challenges
- Expects a payload of challenge data
- Validate payload data

--- Sent, id is route parameter

```
{
  title: STRING - Required - Unique
  description: STRING - Required
  tests: STRING - Required
  skeleton_function: STRING - Required
  solution: STRING - Required
  difficulty: STRING - Required
}
```

--- Received 201

```
{
  id:NUMBER
}
```

# Getting Available Challenges

## GET /api/challenges

- Query parameters can be used to filter results
- By default it returns all approved challenges
- Any registered user can access this endpoint
- Regular users should only be able to access approved challenges no matter if they created them or not, and unapproved challenges that they created
- Only admins can access all challenges
- Returns an array of challenges

--- Sent query parameter for difficulty, created_by, approved, id

```
{

}
```

--- Received 200

```
[
  {
    id number 
    title: STRING - Required - Unique
    description: STRING - Required
    tests: STRING - Required
    skeleton_function: STRING - Required
    solution: STRING - Required
    difficulty: STRING - Required
  }
]
```
---

# Updating a Submission

## PUT /api/submissions
* Save a user's submission answer and completed state from true to false
* Takes the ID of the submission
* Solution should be the only column users are allowed to updated
* Users should only be able to update their own submissions
* Check to make sure the submission exists- If not throw an error

--- Sent

```
{
  id: number - Required
  completed: boolean - optional
  solution: STRING - optional
}
```

--- Received 200

```
{
   id
  challenge_id
  attempts
  completed
  solution
}
```

# Creating a Challenge Submission

## POST /api/submissions
- Populate skeleton function 
- Takes the ID of the challenge
- Check to make sure the challenge exists- If not throw an error
- check to make sure submission does not exist for user- if one exists throw error

--- Sent

```
{
  challenge_id - required
}
```

--- Received, 201

```
{
  id
  challenge_id
  attempts
  completed
  solution
}
```

# Getting Challenge Submissions

## GET /api/submissions

- Object-literal query parameters located in req.query can be used to filter query results
- Users should only be able to access their own submissions
- Any registered user can access this endpoint
- Returns an array of submissions

--- Sent challenge_id, completed

```
{
 
}
```

--- Received, array of challenge submissions

```
[
  {
   id
   challenge_id
   attempts
   completed
   solution
  }
]
```

# Validating a Challenge Submission (to validate they have the correct answer)

## PUT /api/validation/:id
* Validate a user has the correct answer and update the database entry accordingly
* similar too /api/submissions PUT tests code
* Uses the ID of the applicable user_submission entry 
* Users should only be able to request validation on submissions they created
* Users should only be able to request validation of solutions which have not already been verified as correct

--- Sent submission id as route parameter

```
{

}
```

--- Received

```
  {
    id
   challenge_id
   attempts
   completed
   solution
  }

```

# Data Model
## The following represesents the tables in the database.


#  users

---

```
{
  id: UUID
  created_at: DATE - Optional - Defaults to current time
  sub_id: STRING - Required - Unique - Auth0 sub id
}
```

# categories

---

```
{
  id: UUID
  created_at: DATE - Optional - Defaults to current time
  name: STRING - Required - Unique
}
```

# challenges
---
```
{
  id: UUID
  created_at: DATE - Optional - Defaults to current time
  created_by: UUID - Required - Foreign key in USERS table
  title: STRING - Required - Unique
  description: STRING - Required
  tests: STRING - Required
  skeleton_function: STRING - Required
  solution: STRING - Required
  difficulty: STRING - Required
  approved: BOOLEAN - Optional - Defaults to false
}
```

## challenges_categories

---

```
{
  id: UUID
  challenges_id: UUID - Required - Foreign key in CHALLENGES table
  categories_id: UUID - Required - Foreign key in CATEGORIES table
}
```

## user_submissions

---

```
{
  id: UUID
  created_at: DATE - Optional - Defaults to current time
  created_by: UUID - Required - Foreign key in USERS table
  challenge_id: UUID - Required - Foreign key in CHALLENGES table
  attempts: INTEGER - Required - Defaults to 1
  completed: BOOLEAN - Optional - Defaults to false
  solution: STRING - Optional - Defaults to skeleton code
}
```


#  Environment Variables
## Production enviroment variables
* DATABASE_URL
* NODE_ENV
---
## Local Variable
* DB_IP

