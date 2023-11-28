-- 表子

CREATE TABLE
    `Courses` (
        `id` char(9) NOT NULL,
        `teacher_id` char(9) DEFAULT NULL,
        `title` varchar(45) DEFAULT NULL,
        `category` varchar(20) DEFAULT NULL,
        `thumbnail_name` char(32) DEFAULT NULL,
        `description` varchar(450) DEFAULT NULL,
        `registration_start_date` date DEFAULT NULL,
        `registration_end_date` date DEFAULT NULL,
        `start_date` date DEFAULT NULL,
        `end_date` date DEFAULT NULL,
        `capacity` int DEFAULT NULL,
        `sign_students` int DEFAULT '0',
        PRIMARY KEY (`id`),
        KEY `teacher_id_idx` (`teacher_id`),
        CONSTRAINT `teacher_id` FOREIGN KEY (`teacher_id`) REFERENCES `Teachers` (`id`)
    );

CREATE TABLE
    `Coursewares` (
        `id` int NOT NULL,
        `course_id` char(9) NOT NULL,
        `title` varchar(150) DEFAULT NULL,
        `file_name` char(32) DEFAULT NULL,
        PRIMARY KEY (`id`, `course_id`),
        KEY `course_id_idx` (`course_id`),
        CONSTRAINT `course_id` FOREIGN KEY (`course_id`) REFERENCES `Courses` (`id`)
    );

CREATE TABLE
    `FilesMetadata` (
        `id` char(32) NOT NULL,
        `is_courseware` tinyint NOT NULL,
        `file_name` varchar(300) DEFAULT NULL,
        PRIMARY KEY (`id`, `is_courseware`)
    );

CREATE TABLE
    `Homeworks` (
        `id` int NOT NULL,
        `course_id` char(9) NOT NULL,
        `title` varchar(20) DEFAULT NULL,
        `description` varchar(450) DEFAULT NULL,
        `file_name` char(32) DEFAULT NULL,
        `due_date` datetime DEFAULT NULL,
        PRIMARY KEY (`id`, `course_id`),
        KEY `d_idx` (`course_id`),
        CONSTRAINT `course_id1` FOREIGN KEY (`course_id`) REFERENCES `Courses` (`id`)
    );

CREATE TABLE
    `StudentCourses` (
        `student_id` char(9) NOT NULL,
        `course_id` char(9) NOT NULL,
        `grade` float DEFAULT NULL,
        PRIMARY KEY (`student_id`, `course_id`),
        KEY `course_id2_idx` (`course_id`),
        CONSTRAINT `course_id2` FOREIGN KEY (`course_id`) REFERENCES `Courses` (`id`),
        CONSTRAINT `s` FOREIGN KEY (`student_id`) REFERENCES `Students` (`id`)
    );

CREATE TABLE
    `StudentHomeworks` (
        `student_id` char(9) NOT NULL,
        `homework_id` int NOT NULL,
        `course_id` char(9) NOT NULL,
        `grade` float DEFAULT NULL,
        `file_name` char(32) DEFAULT NULL,
        PRIMARY KEY (
            `student_id`,
            `homework_id`,
            `course_id`
        ),
        KEY `h_idx` (`homework_id`, `course_id`),
        CONSTRAINT `h` FOREIGN KEY (`homework_id`, `course_id`) REFERENCES `Homeworks` (`id`, `course_id`),
        CONSTRAINT `ss` FOREIGN KEY (`student_id`) REFERENCES `Students` (`id`)
    );

CREATE TABLE
    `Students` (
        `id` char(9) NOT NULL,
        `name` varchar(20) DEFAULT NULL,
        `gender` char(6) DEFAULT NULL,
        `age` int DEFAULT NULL,
        `password` varchar(20) NOT NULL,
        `email` varchar(30) NOT NULL,
        PRIMARY KEY (`id`),
        UNIQUE KEY `email_UNIQUE` (`email`)
    );

CREATE TABLE
    `Teachers` (
        `id` char(9) NOT NULL,
        `name` varchar(20) DEFAULT NULL,
        `gender` char(6) DEFAULT NULL,
        `age` int DEFAULT NULL,
        `password` varchar(20) NOT NULL,
        `email` varchar(30) NOT NULL,
        PRIMARY KEY (`id`),
        UNIQUE KEY `email_UNIQUE` (`email`)
    );

CREATE TABLE
    `Videos` (
        `id` int NOT NULL AUTO_INCREMENT,
        `course_id` char(9) NOT NULL,
        `title` varchar(250) DEFAULT NULL,
        `file_name` char(32) DEFAULT NULL,
        `thumbnail_name` char(32) DEFAULT NULL,
        PRIMARY KEY (`id`, `course_id`),
        KEY `course_id3_idx` (`course_id`),
        CONSTRAINT `course_id3` FOREIGN KEY (`course_id`) REFERENCES `Courses` (`id`)
    );

-- 事务过程

CREATE DEFINER =`ROOT`@`LOCALHOST` PROCEDURE `DELETECOURSEWARE`
(IN ID INT, IN COURSEID CHAR(9)) BEGIN 
	DECLARE fileName CHAR(32);
	DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK;
	SIGNAL SQLSTATE '45000'
	SET
	    MESSAGE_TEXT = 'Error occurred during transaction';
END; 

START TRANSACTION;

-- Find file id

SELECT file_name INTO fileName
FROM Coursewares
WHERE
    course_id = courseId
    AND Coursewares.id = id;

-- Delete from the Coursewares table

DELETE FROM Coursewares
WHERE
    course_id = courseId
    AND Coursewares.id = id;

-- Delete from the FilesMetadata table

DELETE FROM FilesMetadata
WHERE
    FilesMetadata.id = fileName
    AND is_courseware = true;

COMMIT;

END;

CREATE DEFINER =`ROOT` @`LOCALHOST` PROCEDURE `INSERTCOURSE`
(IN P_TITLE VARCHAR(45), IN P_TEACHER_ID CHAR(9), 
IN P_THUMBNAIL_NAME CHAR(32), IN P_DESCRIPTION VARCHAR
(450), IN P_CATEGORY VARCHAR(20), IN P_REGISTRATION_START_DATE 
DATE, IN P_REGISTRATION_END_DATE DATE, IN P_START_DATE 
DATE, IN P_END_DATE DATE, IN P_CAPACITY INT, OUT NEW_ID 
CHAR(9), OUT RESULT_MESSAGE VARCHAR(30)) BEGIN 
	DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK;
	SET result_message = 'Error';
	SET new_id = "";
END; 

START TRANSACTION;

INSERT INTO
    Courses (
        title,
        teacher_id,
        thumbnail_name,
        description,
        category,
        registration_start_date,
        registration_end_date,
        start_date,
        end_date,
        capacity
    )
VALUES (
        p_title,
        p_teacher_id,
        p_thumbnail_name,
        p_description,
        p_category,
        p_registration_start_date,
        p_registration_end_date,
        p_start_date,
        p_end_date,
        p_capacity
    );

SELECT MAX(id) INTO new_id FROM Courses;

SET result_message = 'Insertion successful';

COMMIT;

END CREATE DEFINER = `root` @`localhost` PROCEDURE `InsertCoursewareAndFileMetadata`(
    IN courseId CHAR(9),
    IN title VARCHAR(150),
    IN fileName CHAR(32),
    IN fileOriginalName VARCHAR(300)
) BEGIN DECLARE EXIT
HANDLER FOR SQLEXCEPTION BEGIN
ROLLBACK;

SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Error occurred during transaction';

END;

START TRANSACTION;

-- Insert into Coursewares table

INSERT INTO
    Coursewares (course_id, title, file_name)
VALUES (courseId, title, fileName);

-- Insert into FileMetadata table

INSERT INTO
    FilesMetadata (id, is_courseware, file_name)
VALUES (
        fileName,
        true,
        fileOriginalName
    );

COMMIT;

END;

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertHomeworkAndFileMetadata`(
  IN courseId CHAR(9),
  IN title VARCHAR(20),
  IN description VARCHAR(450),
  IN dueDate DATETIME,
  IN fileName CHAR(32),
  IN fileOriginalName VARCHAR(300),
  OUT homeworkId INT
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error occurred during transaction';
  END;

  START TRANSACTION;

  -- Insert into Coursewares table
  INSERT INTO Homeworks (course_id, title, description, file_name, due_date)
  VALUES (courseId, title, description, fileName, dueDate);
  
  SELECT MAX(Homeworks.id) INTO homeworkId from Homeworks WHERE Homeworks.course_id = courseId;
  -- select the homeworkId 

  -- Insert into FileMetadata table
  INSERT INTO FilesMetadata (id, is_courseware, file_name)
  VALUES (fileName, false, fileOriginalName);

  COMMIT;
END;


CREATE DEFINER=`root`@`localhost` PROCEDURE `SelectCourse`(
    IN studentId CHAR(9),
    IN courseId CHAR(9),
    OUT message VARCHAR(100)
)
BEGIN
    DECLARE course_is_selectable INT;
    
    -- Get the sign_students count and capacity of the course
    SELECT COUNT(*) INTO course_is_selectable
    FROM Courses
    WHERE id = courseId AND capacity > sign_students AND (CURDATE()) >= registration_start_date;
    
    -- Check if course_is_selectable <= 0
    IF course_is_selectable <= 0 THEN
        SET message = 'Course is unselectable.';
    ELSE
       -- Check if current date is not greater than registration_end_date
        IF (CURDATE()) > (SELECT registration_end_date FROM Courses WHERE id = courseID) THEN
			SET message = 'Registration period has ended.';
        ELSE
            -- Increment sign_students in Courses table
            UPDATE Courses
            SET sign_students = sign_students + 1
            WHERE id = courseID;
            
            -- Insert a row into StudentCourses table
            INSERT INTO StudentCourses (student_id, course_id)
            VALUES (studentID, courseID);
            
            SET message = 'Course selected successfully.';
        END IF;
    END IF;
END;

CREATE DEFINER=`root`@`localhost` PROCEDURE `studentLoginProcedure`(IN userEmail VARCHAR(30), IN userPassword VARCHAR(20), OUT resultMessage VARCHAR(30), OUT loginId CHAR(9))
BEGIN
  DECLARE userId CHAR(9);
  DECLARE correctPassword VARCHAR(20);
  
  -- Check if email exists
  SELECT id, password INTO userId, correctPassword FROM Students WHERE email = userEmail LIMIT 1;

  IF userId IS NULL THEN
	SET loginId = "";
    SET resultMessage = 'Account does not exist';
  ELSE
    -- Check if password matches
    IF STRCMP(correctPassword,userPassword) = 0 THEN
	  SET loginId = userId;
	  SET resultMessage = 'Login successful';
    ELSE
	  SET loginId = "";
      SET resultMessage = 'Wrong password';
    END IF;
  END IF;
END;

CREATE DEFINER=`root`@`localhost` PROCEDURE `studentRegistration`(
  IN new_name VARCHAR(20),
  IN new_email VARCHAR(30),
  IN new_password VARCHAR(20),
  OUT new_id CHAR(9),
  OUT result_message VARCHAR(30)
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SET result_message = 'Error';
	SET new_id = "";
  END;

  DECLARE EXIT HANDLER FOR 1062 
  BEGIN
    ROLLBACK;
    SET result_message = 'Duplicate email';
    SET new_id = "";
  END;

  START TRANSACTION;
  
  INSERT INTO Students (name, email, password) VALUES (new_name, new_email, new_password);
  SELECT id INTO new_id FROM Students WHERE email = new_email;
  SET result_message = 'Insertion successful';
  COMMIT;
END;

CREATE DEFINER=`root`@`localhost` PROCEDURE `StudentUploadHomework`(
  IN studentId CHAR(9),
  IN homeworkId INT,
  IN courseId CHAR(9),
  IN fileName CHAR(32),
  IN fileOriginalName VARCHAR(300)
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error occurred during transaction';
  END;

  START TRANSACTION;

  -- Insert into Coursewares table
  INSERT INTO StudentHomeworks (student_id, homework_id, course_id, file_name)
  VALUES (studentId, homeworkId, courseId, fileName);

  -- Insert into FileMetadata table
  INSERT INTO FilesMetadata (id, is_courseware, file_name)
  VALUES (fileName, false, fileOriginalName);

  COMMIT;
END;

CREATE DEFINER=`root`@`localhost` PROCEDURE `teacherLoginProcedure`(IN userEmail VARCHAR(30), IN userPassword VARCHAR(20), OUT resultMessage VARCHAR(30), OUT loginId CHAR(9))
BEGIN
  DECLARE userId CHAR(9);
  DECLARE correctPassword VARCHAR(20);
  
  -- Check if email exists
  SELECT id, password INTO userId, correctPassword FROM Teachers WHERE email = userEmail LIMIT 1;

  IF userId IS NULL THEN
	SET loginId = "";
    SET resultMessage = 'Account does not exist';
  ELSE
    -- Check if password matches
    IF STRCMP(correctPassword,userPassword) = 0 THEN
	  SET loginId = userId;
	  SET resultMessage = 'Login successful';
    ELSE
	  SET loginId = "";
      SET resultMessage = 'Wrong password';
    END IF;
  END IF;
END;

CREATE DEFINER=`root`@`localhost` PROCEDURE `teacherRegistration`(
  IN new_name VARCHAR(20),
  IN new_email VARCHAR(30),
  IN new_password VARCHAR(20),
  OUT new_id CHAR(9),
  OUT result_message VARCHAR(30)
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SET result_message = 'Error';
	SET new_id = "";
  END;

  DECLARE EXIT HANDLER FOR 1062 
  BEGIN
    ROLLBACK;
    SET result_message = 'Duplicate email';
    SET new_id = "";
  END;

  START TRANSACTION;
  
  INSERT INTO Teachers (name, email, password) VALUES (new_name, new_email, new_password);
  SELECT id INTO new_id FROM Teachers WHERE email = new_email;
  SET result_message = 'Insertion successful';
  COMMIT;
END;

CREATE DEFINER=`root`@`localhost` PROCEDURE `UnselectCourse`(
    IN studentID CHAR(9),
    IN courseID CHAR(9),
    OUT message VARCHAR(100)
)
BEGIN
    DECLARE isUnselectable INT;
    DECLARE isSelectedByStudent INT;

    -- Check if course is unselectable
    SELECT COUNT(*) INTO isUnselectable
    FROM Courses
    WHERE id = courseID AND registration_end_date >= (CURDATE());
    
    -- Check if student selected the course
    SELECT COUNT(*) INTO isSelectedByStudent
    FROM StudentCourses
    WHERE student_id = studentID AND course_id = courseID;
    
    -- Check if isUnselectable > 0
    IF isUnselectable > 0 THEN
		IF isSelectedByStudent > 0 THEN
			-- Decrement sign_students in Courses table
			UPDATE Courses
			SET sign_students = sign_students - 1
			WHERE id = courseID;

			-- Delete the row from StudentCourses table
			DELETE FROM StudentCourses
			WHERE student_id = studentID AND course_id = courseID;
            
            -- Delete all the student's homework for this course
			DELETE FROM StudentHomeworks
			WHERE student_id = studentID
            AND course_id = courseID;

			SET message = 'Course unselected successfully.';
		ELSE
			SET message = 'Course is not selected by the student.';
        END IF;
    ELSE
        SET message = 'Course is not unselectable now.';
    END IF;
END;

CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateCoursewareAndFileMetadata`(	
  IN id INT,
  IN courseId CHAR(9),
  IN title VARCHAR(150),
  IN fileName CHAR(32),
  IN oldFileName CHAR(32),
  IN fileOriginalName VARCHAR(300)
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error occurred during transaction';
  END;

  START TRANSACTION;

  -- Update the Coursewares table
  UPDATE Coursewares
  SET Coursewares.title = title, Coursewares.file_name = fileName
  WHERE course_id = courseId AND Coursewares.id = id;

  -- Update the FilesMetadata table
  UPDATE FilesMetadata
  SET FilesMetadata.id = fileName, FilesMetadata.file_name = fileOriginalName
  WHERE FilesMetadata.id = oldFileName AND is_courseware = true;

  COMMIT;
END;

CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateHomeworkAndFileMetadata`(	
  IN id INT,
  IN courseId CHAR(9),
  IN title VARCHAR(20),
  IN description VARCHAR(450),
  IN dueDate DATETIME,
  IN fileName CHAR(32),
  IN oldFileName CHAR(32),
  IN fileOriginalName VARCHAR(300)
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error occurred during transaction';
  END;

  START TRANSACTION;

  -- Update the Coursewares table
  UPDATE Homeworks
  SET Homeworks.title = title, Homeworks.file_name = fileName, Homeworks.description = description, Homeworks.due_date = dueDate
  WHERE course_id = courseId AND Coursewares.id = id;

  -- Update the FilesMetadata table
  UPDATE FilesMetadata
  SET FilesMetadata.id = fileName, FilesMetadata.file_name = fileOriginalName
  WHERE FilesMetadata.id = oldFileName AND is_courseware = false;

  COMMIT;
END;

-- 触发器
trg_generate_course_id, INSERT, Courses, BEGIN
    DECLARE maxId CHAR(9);
    
    -- Check if table is empty
    IF (SELECT COUNT(*) FROM Courses) = 0 THEN
        SET NEW.id = 'CR0000001'; -- Set the initial ID when the table is empty
    ELSE
        SELECT MAX(id) INTO maxId FROM Courses;
        SET NEW.id = CONCAT('CR', LPAD(CAST(SUBSTRING(maxId, 3) AS UNSIGNED) + 1, 7, '0'));
    END IF;
END


increment_course_id, INSERT, Coursewares, BEGIN
    DECLARE max_id INT;
    SET max_id = (SELECT MAX(id) FROM Coursewares WHERE course_id = NEW.course_id);
    SET NEW.id = IFNULL(max_id + 1, 0);
END

increment_course_id_homework, INSERT, Homeworks, BEGIN
    DECLARE max_id INT;
    SET max_id = (SELECT MAX(id) FROM Homeworks WHERE course_id = NEW.course_id);
    SET NEW.id = IFNULL(max_id + 1, 0);
END

student_generate_id, INSERT, Students, BEGIN
    DECLARE maxId CHAR(9);
    
    -- Check if table is empty
    IF (SELECT COUNT(*) FROM Students) = 0 THEN
        SET NEW.id = 'ST2011163'; -- Set the initial ID when the table is empty
    ELSE
        SELECT MAX(id) INTO maxId FROM Students;
        SET NEW.id = CONCAT('ST', LPAD(CAST(SUBSTRING(maxId, 3) AS UNSIGNED) + 1, 7, '0'));
    END IF;
END

teacher_generate_id, INSERT, Teachers, BEGIN
    DECLARE maxId CHAR(9);
    
    -- Check if table is empty
    IF (SELECT COUNT(*) FROM Teachers) = 0 THEN
        SET NEW.id = 'TA2011163'; -- Set the initial ID when the table is empty
    ELSE
        SELECT MAX(id) INTO maxId FROM Teachers;
        SET NEW.id = CONCAT('TA', LPAD(CAST(SUBSTRING(maxId, 3) AS UNSIGNED) + 1, 7, '0'));
    END IF;
END

increment_course_id_video, INSERT, Videos, BEGIN
    DECLARE max_id INT;
    SET max_id = (SELECT MAX(id) FROM Videos WHERE course_id = NEW.course_id);
    SET NEW.id = IFNULL(max_id + 1, 0);
END



-- 函数 （瞎编几个）