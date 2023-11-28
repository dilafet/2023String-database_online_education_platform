# 2023Spring Database Online Education Platform

## Course Project: Database Online Education Platform

### Objective

This repository hosts the source code for a course project - an Online Education Platform with a focus on course management and interaction between students and teachers. The system provides a platform for students to select and study courses, while also supporting teachers in managing courses and sharing resources. The functionality is comprehensive, catering to the needs of both students and teachers, with a user-friendly interface.

## Features

### For Students

- **Registration/Login:**
  - Students can register and log in to the platform.

- **Profile Management:**
  - Ability to modify personal information.

- **Course Selection:**
  - Search and view available courses.
  - Filter courses by name, teacher, course type, etc.
  - View detailed information and enroll in courses.

- **Access Course Materials:**
  - Download course materials and watch videos for enrolled courses.
  - Stream videos directly to the browser.

- **Submit Assignments/View Grades:**
  - Submit assignments for enrolled courses.
  - View grades, including total scores and assignment scores.

### For Teachers

- **Registration/Login:**
  - Teachers can register and log in to the platform.

- **Profile Management:**
  - Ability to modify personal information.

- **Course Management:**
  - Add and modify courses.
  - View and update course information.

- **Resource Sharing:**
  - Upload and modify course materials and videos.

- **Assignment Management:**
  - Set assignments for courses.
  - Grade assignments submitted by students.

- **Grading System:**
  - View student information and grades.
  - Sort and filter grades based on various criteria.

## Overall Design

### Frontend

The frontend is developed using the React framework, utilizing a component-based approach to construct the user interface. Key frontend components include:

- **AdminDashboard:**
  - Registration and login interface.

- **App:**
  - Root component for the entire application, containing the navigation bar and routing for other components.

- **Course:**
  - Display detailed information about individual courses.

- **CourseSelection:**
  - List all available courses with filtering and search options.

- **CourseTeacher:**
  - Course details for teachers, allowing modification of course information, uploading course materials, and managing assignments.

- **Grades:**
  - View student grades for courses.

- **Navbar:**
  - Navigation bar with links for login/registration, personal information, course selection, etc.

- **Personal:**
  - Display and edit personal information.

### Backend

The backend is implemented in Node.js using the Express framework to create RESTful APIs. Key backend components/modules include:

- **User Management Module:**
  - Handles student and teacher registration, login, and profile modification.

- **Course Management Module:**
  - Manages course creation, viewing, and searching.

- **Courseware Management Module:**
  - Facilitates the upload and download of course-related materials.

- **Video Management Module:**
  - Manages the upload and streaming of course videos.

- **Homework Management Module:**
  - Handles the release, submission, and grading of assignments.

- **Database Module:**
  - Interacts with the MySQL database for data storage, retrieval, and updates.

#### File Upload Handling with Multer
In the backend, we use the Multer library in Node.js to facilitate file, video, and image uploads. Different Multer instances handle various types of file uploads, such as courseware, videos, and thumbnails. 

## Sreenshots
![1](screenshots/student_dashboard.png)
![2](screenshots/student_dashboard.png)
![3](screenshots/student_dashboard.png)
![4](screenshots/student_dashboard.png)
![5](screenshots/student_dashboard.png)


