### Admin Panel

1.  Admin Login

    -   URL: `https://localhost:800/api/admin/login` (POST request)
    -   Use email: `admin@admin` and password: `admin`
    -   Pass these credentials into headers (in Postman or similar tool) to authenticate.
2.  Add Students

    -   URL: `https://localhost:800/api/admin/add-student` (POST request)
    -   Admin credentials required: email: `admin@admin`, password: `admin`
    -   Pass student's name, department, email, and password in the request body to create a new user.
3.  Assign Tasks to Students

    -   URL: `https://localhost:800/api/admin/assign-task` (POST request)
    -   Admin credentials required: email: `admin@admin`, password: `admin`
    -   Pass student ID, task description, and duration in the request body to assign a task to a student.

### Student Panel

1.  View Assigned Tasks and Status

    -   URL: `http://localhost:8080/api/student` (GET request)
    -   Use the student's email and password in the header to access tasks assigned to them.
2.  Update Task Status

    -   URL: `http://localhost:8080/api/studentUpdate` (PUT request)
    -   Use student email and password in the header and pass task ID and the updated task status in the request body to update the task in the database.

### Running the Project

1.  Clone the Repository
2.  Navigate to Project Directory
3.  Install Dependencies
    -   Run `npm i`
4.  Create `.env` File
    -   Use the provided data or configuration and create a `.env` file.
5.  Start the Project
    -   Run `npm start`
