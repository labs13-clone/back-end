# API Documentation

## Backend Deployed On Heroku [https://clone-coding-server.herokuapp.com/](https://clone-coding-server.herokuapp.com/) <br>

##  Getting Started

### Scripts

- **yarn install** to install all required dependencies
- **yarn dev** to start the local server
- **yarn test** to start server using testing environment  
- **yarn db_start_dev** to start docker development Postgres database
- **yarn db_start_test** to start docker testing database
- **yarn db_reset_dev** to migrate and rollback seeds in developer database
- **yarn db_reset_test** to migrate and rollback seeds in developer tests
- **yarn db_stop_dev** burns down development database
- **yarn db_stop_test** burn down testing database
  
## Using Express Backend Framework

### We used this framework for these reasons

- Minimal and flexible
- Highly customizable
- Written in Javascript, allowing us to write in same language for frontend and backend
- Compatible with AuthO libraries

# Route List
## Get user ID out of the req.headers.users which is populated in the auth middleware
- **GET /api/users**
  - Get logged in user profile information
    - Can be used to get the role of the user
    - Can be used to get the user's picture or nickname
- **GET /api/categories**
  - Get an array of categories for:
    - Create Challenge Form
    - Search Challenges Category Filter
- **POST /api/categories/challenges**
  - Attach categories to challenges:
    - Accepts a single category or multiple categories
- **POST /api/challenges**
  - Create a new code challenge
- **PUT /api/challenges**
  - Edit a code challenge
    - Admins can approve a challenge
- **GET /api/challenges**
  - Get code challenge(s)
    - All users can get approved challenges
    - Filter challenges by numerous query parameters
    - Users can get unapproved challenges they created
    - Admins can get any unapproved challenges
- **POST /api/submissions**
  - Create a new submission
    - User is starting a code challenge
- **GET /api/submissions**
  - Get submission(s)
    - Users can get all submissions they created
    - Users can get all submissions they completed
    - Users can get all submissions they started
    - Users can get a submission for a specific challenge
- **PUT /api/submissions/exec**
  - User executed code client-side while attempting a challenge
    - Users can optionally update their answer
- **PUT /api/submissions/test**
  - User executed tests client-side while attempting a challenge
    - Users can optionally update their answer
- **PUT /api/submissions/attempt**
  - User submitted their solution for a code challenge
    - Users can optionally update their answer when validating
- **PUT /api/submissions/reset**
  - User can reset an already completed challenge to retake it

# Getting user profile information

## GET /api/users

- Get user profile information
- User ID is acquired using the access token in the Authorization header
- Will return an error if token is invalid
- Can be used to confirm user is logged in

### --- Sent 

#### Request Body:
```
{

}
```

### --- Received 201

#### Returns user information:
```
{
  id: INTEGER
  xp: INTEGER
  role: STRING
}
```

---

# Getting category information

## GET /api/categories

- Get an array of category information 

### --- Sent 

#### Request Body:
```
{

}
```

### --- Received 201

#### Returns an array of category information:
```
[
  {
    id: INTEGER
    name: STRING
    created_at: DATE
  }
]
```

---

# Attach a category (or multiple categories) to a challenge

## POST /api/categories/challenges

- Accepts an array of objects (or a single object) containing category and challenge information

### --- Sent 

#### Request Body:
```
[
  {
    challenge_id: INTEGER - Required
    categories_id: INTEGER - Required
  },
  ...
]
```
## OR
```
{
  challenge_id: INTEGER - Required
  categories_id: INTEGER - Required
}
```
### --- Received 201

#### Returns the challenge's information:
```
{
  id: NUMBER
  approved: BOOLEAN
  title: STRING
  description: STRING
  tests: JSON
  skeleton_function: STRING
  solution: STRING
  difficulty: INTEGER
  popularity: INTEGER
  challenges: [
    {
      id: NUMBER
      name: STRING
    },
    {
      id: NUMBER
      name: STRING
    },
    ...
  ]
}
```

---

# Creating a new code challenge

## POST /api/challenges

- Any registered user can create a challenge
- Challenges need to be manually approved by an administrator

### --- Sent

#### Request Body:
```
{
  title: STRING - Required - **Unique**
  description: STRING - Required
  tests: JSON - Required
  skeleton_function: STRING - Required
  solution: STRING - Required
  difficulty: INTEGER - Required - Inbetween 1 to 100 (inclusive)
}
```

### --- Received 201

#### Returns the new challenge:
```
{
  id: INTEGER
  title: STRING
  description: STRING
  tests: JSON
  skeleton_function: STRING
  solution: STRING
  difficulty: INTEGER
  popularity: INTEGER
  challenges: [
    {
      id: NUMBER
      name: STRING
    },
    {
      id: NUMBER
      name: STRING
    },
    ...
  ]
}
```

# Editing an existing code challenge

## PUT /api/challenges/
- Currently only used for admins to approve challenges

### --- Sent

#### Request Body:
```
{
  id: INTEGER - Required
  approved: BOOLEAN - Required
}
```

### --- Received 201

#### Returns the updated challenge:
```
{
  id: INTEGER
  title: STRING
  description: STRING
  tests: JSON
  skeleton_function: STRING
  solution: STRING
  difficulty: INTEGER
  popularity: INTEGER
  challenges: [
    {
      id: NUMBER
      name: STRING
    },
    {
      id: NUMBER
      name: STRING
    },
    ...
  ]
}
```

# Getting Available Challenges

## GET /api/challenges

- Any registered user can access this endpoint
- Returns an array of challenges
- Returns all approved challenges by default
- Query parameters can be used to filter results
- Regular users can only access approved challenges they did not create, and unapproved challenges that they created
- Admins can access all challenges

### --- Sent

#### Query Parameters:
 - difficulty: RANGE (STRING) - Optional - `1-100' (all), '1-33' (easy), '33-66' (medium), or '66-100' (hard)
 - approved: BOOLEAN - Optional - Whether the challenge should be approved or unapproved
 - id: NUMBER - Optional - ID of challenge
 - category_name: STRING - Optional - Search by name of category - Case insensitive and partial match supported
 - category_id: NUMBER - Optional - ID of category
 - created: Boolean - Optional - Currently only works for true
 - completed: Boolean - Optional - Currently only works for true
 - started: Boolean - Optional - Currently only works for true

#### Request Body:
```
{

}
```

### --- Received 200

#### Returns an array of challenges:
```
[
  {
    id: NUMBER
    approved: BOOLEAN
    title: STRING
    description: STRING
    tests: JSON
    skeleton_function: STRING
    solution: STRING
    difficulty: INTEGER
    popularity: INTEGER
    challenges: [
      {
        id: NUMBER
        name: STRING
      },
      {
        id: NUMBER
        name: STRING
      },
      ...
    ]
  }
]
```
---

# Creating A Submission

## POST /api/submissions
- Needs the ID of the challenge
- Automatically populates a skeleton function

### --- Sent

#### Request Body:
```
{
  challenge_id - INTEGER - Required
}
```

### --- Received, 201

#### Returns the new challenge submission:
```
{
  id - INTEGER
  challenge_id - INTEGER
  attempts - INTEGER
  total_attempts - INTEGER
  code_execs - INTEGER
  total_code_execs - INTEGER
  test_execs - INTEGER
  total_test_execs - INTEGER
  completed - BOOLEAN
  solution - STRING
}
```

# Getting Challenge Submissions

## GET /api/submissions

- Any registered user can access this endpoint
- Users can only access their own submissions
- Object-literal query parameters located in req.query can be used to filter query results
- Returns an array of submissions

### --- Sent

#### Query Parameters:
 - challenge_id - INTEGER - Optional
 - completed - BOOLEAN - Optional

#### Request Body:
```
{
 
}
```

### --- Received

#### Array of challenge submissions:
```
[
  {
    id - INTEGER
    challenge_id - INTEGER
    attempts - INTEGER
    total_attempts - INTEGER
    code_execs - INTEGER
    total_code_execs - INTEGER
    test_execs - INTEGER
    total_test_execs - INTEGER
    completed - BOOLEAN
    solution - STRING
  }
]
```

# User executed code client-side while attempting a challenge

## PUT /api/submissions/exec
* Requires the ID of the submission
* Saves a user's solution if included in the request
* Users can only update their own submissions
* Increments `code_execs` and `total_code_execs` by one

### --- Sent

#### Request Body:
```
{
  id: NUMBER - Required - ID of the submission
  solution: STRING - Optional
}
```

### --- Received 200

#### Returns the updated submission:
```
{
  id - INTEGER
  challenge_id - INTEGER
  attempts - INTEGER
  total_attempts - INTEGER
  code_execs - INTEGER
  total_code_execs - INTEGER
  test_execs - INTEGER
  total_test_execs - INTEGER
  completed - BOOLEAN
  solution - STRING
}
```

# User executed tests client-side while attempting a challenge

## PUT /api/submissions/test
* Requires the ID of the submission
* Saves a user's solution if included in the request
* Users can only update their own submissions
* Increments `test_execs` and `total_test_execs` by one

### --- Sent

#### Request Body:
```
{
  id: NUMBER - Required - ID of the submission
  solution: STRING - Optional
}
```

### --- Received 200

#### Returns the updated submission:
```
{
  id - INTEGER
  challenge_id - INTEGER
  attempts - INTEGER
  total_attempts - INTEGER
  code_execs - INTEGER
  total_code_execs - INTEGER
  test_execs - INTEGER
  total_test_execs - INTEGER
  completed - BOOLEAN
  solution - STRING
}
```

# User submitted their solution for a code challenge

## PUT /api/submissions/attempt
* Validates that a user has the correct answer
* Needs the ID of the applicable user_submission entry
* Users can only attempt submissions they created
* Updates users solution if provided in request
* Users can only attempt uncompleted challenges
    * If completed, users need to reset their submission in order to attempt the challenge again via PUT /api/submissions/reset

### --- Sent

#### Request Body:
```
{
  id: STRING - Required - ID of the applicable user_submission
  solution: STRING - Optional
}
```

### --- Received, 201

#### Returns an updated submission:
```
{
  id - INTEGER
  challenge_id - INTEGER
  attempts - INTEGER
  total_attempts - INTEGER
  code_execs - INTEGER
  total_code_execs - INTEGER
  test_execs - INTEGER
  total_test_execs - INTEGER
  completed - BOOLEAN
  solution - STRING
}
```

# User can reset challenges they already created

## PUT /api/submissions/reset
* Requires the ID of the submission
* Users can only reset their own submissions
* Users can only reset completed challenges

### --- Sent

#### Request Body:
```
{
  id: NUMBER - Required - ID of the submission
}
```

### --- Received 200

#### Returns the updated submission:
```
{
  id - INTEGER
  challenge_id - INTEGER
  attempts - INTEGER
  total_attempts - INTEGER
  code_execs - INTEGER
  total_code_execs - INTEGER
  test_execs - INTEGER
  total_test_execs - INTEGER
  completed - BOOLEAN
  solution - STRING
}
```

# Data Model

## The following represents each table in the database:

![](images/database_model.png)

##  users

---

```
{
  id: UUID
  created_at: DATETIME - Optional - Defaults to current time
  sub_id: STRING - Required - Unique - Auth0 sub id
}
```

## categories

---

```
{
  id: UUID
  created_at: DATETIME - Optional - Defaults to current time
  name: STRING - Required - Unique
}
```

## challenges
---
```
{
  id: UUID
  created_at: DATETIME - Optional - Defaults to current time
  created_by: UUID - Required - Foreign key in USERS table
  title: STRING - Required - Unique
  description: STRING - Required
  tests: JSON - Required
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
  created_at: DATETIME - Optional - Defaults to current timestamp
  created_by: UUID - Required - Foreign key in USERS table
  challenge_id: UUID - Required - Foreign key in CHALLENGES table
  code_execs: INTEGER - Required - Defaults to 0
  total_code_execs: INTEGER - Required - Defaults to 0
  test_execs: INTEGER - Required - Defaults to 0
  total_test_execs: INTEGER - Required - Defaults to 0
  attempts: INTEGER - Required - Defaults to 0
  total_attempts: INTEGER - Required - Defaults to 0
  completed: BOOLEAN - Optional - Defaults to false
  solution: STRING - Optional - Defaults to skeleton code
}
```
#  Environment Variables
## Production Environment Variables
* DATABASE_URL
* NODE_ENV
---
## Development Environment Variables
* DB_IP