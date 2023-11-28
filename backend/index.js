import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs, { unlinkSync } from "fs";

const app = express();

const uploadCourseware = multer({ dest: "resources/coureswares/" });

const uploadCourseVideo = multer({ dest: "resources/courseVideos/" });

const uploadHomework = multer({ dest: "resources/homeworks/" });

const uploadThumbnail = multer({ dest: "resources/thumbnails/" });

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Afet813131",
    database: "Coursa",
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json("hello this the backend");
});

// student
app.get("/students", (req, res) => {
    const query = "SELECT * FROM Students";
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
        }
        return res.json(result);
    });
});

app.post("/studentRegistration", (req, res) => {
    const query1 = "CALL studentRegistration(?, ?, ?, @new_id, @result_message);";
    const query2 = "SELECT @result_message, @new_id;";
    const values = [req.body.name, req.body.email, req.body.password];
    db.query(query1, values, (err, result) => {
        if (err) {
            return res.json(err);
        } else {
            db.query(query2, (err, result) => {
                if (err) {
                    return res.json(err);
                }
                const resultMessage = result[0]["@result_message"];
                const newId = result[0]["@new_id"];
                return res.json({ result: resultMessage, id: newId });
            });
        }
    });
});

app.post("/studentLogin", (req, res) => {
    const query1 = "CALL studentLoginProcedure(?, ?, @resultMessage, @loginId);";
    const query2 = "SELECT @resultMessage, @loginId;";
    const values = [req.body.email, req.body.password];
    console.log(values);
    db.query(query1, values, (err, result) => {
        if (err) {
            return res.json(err);
        } else {
            db.query(query2, (err, result) => {
                if (err) {
                    return res.json(err);
                }
                const resultMessage = result[0]["@resultMessage"];
                const newId = result[0]["@loginId"];
                return res.json({ result: resultMessage, id: newId });
            });
        }
    });
});

app.post("/studentPersonalInfo", (req, res) => {
    const query = "SELECT * FROM Students WHERE id = ?";
    const values = [req.body.id];
    db.query(query, values, (err, result) => {
        if (err) {
            res.json(err);
        }
        return res.json(result);
    });
});

app.post("/updateStudentPersonalInfo", (req, res) => {
    const query = "UPDATE Students SET name = ?, gender = ?, age = ?, password = ? WHERE id = ?";
    const values = [req.body.name, req.body.gender, req.body.age, req.body.password, req.body.id];
    db.query(query, values, (err, result) => {
        if (err) {
            res.json(err);
        }
        return res.json(result);
    });
});

app.post("/registerCourse", (req, res) => {
    const query1 = "CALL SelectCourse(?, ?, @message)";
    const query2 = "SELECT @message";
    const values = [req.body.studentId, req.body.courseId];
    db.query(query1, values, (err, result) => {
        if (err) {
            res.json(err);
        } else {
            db.query(query2, (err, result) => {
                if (err) {
                    res.json(err);
                }
                const message = result[0]["@message"];
                res.json(message);
            });
        }
    });
});

app.post("/cancelCourse", (req, res) => {
    const query1 = "CALL UnselectCourse(?, ?, @message)";
    const query2 = "SELECT @message";
    const values = [req.body.studentId, req.body.courseId];
    db.query(query1, values, (err, result) => {
        if (err) {
            res.json(err);
        } else {
            db.query(query2, (err, result) => {
                if (err) {
                    res.json(err);
                }
                const message = result[0]["@message"];
                res.json(message);
            });
        }
    });
});

// teacher
app.post("/teacherRegistration", (req, res) => {
    const query1 = "CALL teacherRegistration(?, ?, ?, @new_id, @result_message);";
    const query2 = "SELECT @result_message, @new_id;";
    const values = [req.body.name, req.body.email, req.body.password];
    db.query(query1, values, (err, result) => {
        if (err) {
            return res.json(err);
        } else {
            db.query(query2, (err, result) => {
                if (err) {
                    return res.json(err);
                }
                const resultMessage = result[0]["@result_message"];
                const newId = result[0]["@new_id"];
                return res.json({ result: resultMessage, id: newId });
            });
        }
    });
});

app.post("/teacherLogin", (req, res) => {
    const query1 = "CALL teacherLoginProcedure(?, ?, @resultMessage, @loginId);";
    const query2 = "SELECT @resultMessage, @loginId;";
    const values = [req.body.email, req.body.password];
    db.query(query1, values, (err, result) => {
        if (err) {
            return res.json(err);
        } else {
            db.query(query2, (err, result) => {
                if (err) {
                    return res.json(err);
                }
                const resultMessage = result[0]["@resultMessage"];
                const newId = result[0]["@loginId"];
                return res.json({ result: resultMessage, id: newId });
            });
        }
    });
});

app.post("/teacherPersonalInfo", (req, res) => {
    const query = "SELECT * FROM Teachers WHERE id = ?";
    const values = [req.body.id];
    db.query(query, values, (err, result) => {
        if (err) {
            res.json(err);
        }
        return res.json(result);
    });
});

app.post("/teacherPersonalInfoForVisitor", (req, res) => {
    const query = "SELECT id, name, gender, age, email FROM Teachers WHERE id = ?";
    const values = [req.body.id];
    db.query(query, values, (err, result) => {
        if (err) {
            res.json(err);
        }
        return res.json(result);
    });
});

app.post("/updateTeacherPersonalInfo", (req, res) => {
    const query = "UPDATE Teachers SET name = ?, gender = ?, age = ?, password = ? WHERE id = ?";
    const values = [req.body.name, req.body.gender, req.body.age, req.body.password, req.body.id];
    db.query(query, values, (err, result) => {
        if (err) {
            res.json(err);
        }
        return res.json(result);
    });
});

// courseware
app.post("/uploadCourseware", uploadCourseware.single("file"), (req, res) => {
    const filePath = req.file.path;
    const fileName = path.basename(filePath);
    const query = "CALL InsertCoursewareAndFileMetadata(?, ?, ?, ?)";
    const values = [req.body.courseId, req.body.title, fileName, req.file.originalname];
    db.query(query, values, (err, result) => {
        if (err) {
            res.status(200).json({ message: "Courseware uploaded fail." });
        }
        return res.status(200).json({ message: "Courseware uploaded successfully." });
    });
});

app.post("/updateCourseware", uploadCourseware.single("file"), (req, res) => {
    const filePath = req.file.path;
    const fileName = path.basename(filePath);
    const query = "SELECT file_name FROM Coursewares WHERE id = ? AND course_id = ?";
    const values = [req.body.id, req.body.courseId];
    db.query(query, values, (err, result) => {
        if (err) {
            res.status(200).json({ message: "Courseware update fail." });
        }
        const oldFileName = result[0].file_name;
        fs.unlink("resources/coureswares/" + oldFileName, (err) => {
            if (err) {
                res.status(500).json({ error: "Failed to delete old courseware" });
            } else {
                const query = "CALL UpdateCoursewareAndFileMetadata(?, ?, ?, ?, ?, ?)";
                const values = [req.body.id, req.body.courseId, req.body.title, fileName, oldFileName, req.file.originalname];
                db.query(query, values, (err, result) => {
                    if (err) {
                        res.status(200).json({ message: "Courseware update fail." });
                    }
                    return res.status(200).json({ message: "Courseware updated successfully." });
                });
            }
        });
    });
});

app.post("/deleteCourseware", (req, res) => {
    const query1 = "SELECT file_name FROM Coursewares WHERE id = ? AND course_id = ?";
    const query2 = "CALL DeleteCourseware(? ,?)";
    const values = [req.body.id, req.body.courseId];
    db.query(query1, values, (err, result) => {
        if (err) {
            res.status(200).json({ message: "Courseware delete fail." });
        } else {
            const fileName = result[0].file_name;
            fs.unlink("resources/coureswares/" + fileName, (err) => {
                if (err) {
                    res.status(500).json({ error: "Failed to delete courseware" });
                } else {
                    const values = [req.body.id, req.body.courseId];
                    db.query(query2, values, (err, result) => {
                        if (err) {
                            res.status(200).json({ message: "Courseware delete fail." });
                        } else {
                            res.status(200).json({ message: "Courseware deleted successfully." });
                        }
                    });
                }
            });
        }
    });
});

app.get("/downloadCourseware/:id", (req, res) => {
    const coursewarePath = path.join(process.cwd(), "resources", "coureswares", req.params.id);
    const query = "SELECT file_name FROM FilesMetadata WHERE id = ? AND is_courseware = true";
    const values = [req.params.id];
    db.query(query, values, (err, result) => {
        if (err) {
            res.status(200).json({ message: "Courseware download fail." });
        }
        const fileName = result[0].file_name;

        // Set the appropriate headers
        res.setHeader("Content-type", "application/octet-stream");
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

        // Stream the file to the response
        const fileStream = fs.createReadStream(coursewarePath);
        fileStream.pipe(res); // Pipe the data to the response
    });
});

// video
app.post("/uploadCourseVideo", uploadCourseVideo.fields([{ name: "video" }, { name: "thumbnail" }]), (req, res) => {
    const videoFileName = req.files.video[0].filename;
    const thumbnailFileName = req.files.thumbnail[0].filename;
    // Save the video and thumbnail information to the database
    const query = "INSERT INTO Videos (course_id, title, file_name, thumbnail_name) VALUES (?, ?, ?, ?)";
    const values = [req.body.courseId, req.body.title, videoFileName, thumbnailFileName];
    db.query(query, values, (err, result) => {
        if (err) {
            res.status(200).json({ message: "Video uploaded fail." });
        } else {
            res.status(200).json({ message: "Video uploaded successfully." });
        }
    });
});

app.post("/updateCourseVideo", uploadCourseVideo.fields([{ name: "video" }, { name: "thumbnail" }]), (req, res) => {
    const videoFileName = req.files.video[0].filename;
    const thumbnailFileName = req.files.thumbnail[0].filename;
    const query = "SELECT file_name, thumbnail_name FROM Videos WHERE id = ? AND course_id = ?";
    const values = [req.body.id, req.body.courseId];
    db.query(query, values, (err, result) => {
        if (err) {
            res.status(200).json({ message: "Video update fail." });
        }
        const oldFileName = result[0].file_name;
        const oldThumbnailName = result[0].thumbnail_name;
        fs.unlink("resources/courseVideos/" + oldFileName, (err) => {
            if (err) {
                res.status(500).json({ error: "Failed to delete old video" });
            } else {
                fs.unlink("resources/courseVideos/" + oldThumbnailName, (err) => {
                    if (err) {
                        res.status(500).json({ error: "Failed to delete old thumbnail" });
                    } else {
                        const query = "UPDATE Videos SET title = ?, file_name = ?, thumbnail_name = ? WHERE id = ? AND course_id = ?";
                        const values = [req.body.title, videoFileName, thumbnailFileName, req.body.id, req.body.courseId];
                        db.query(query, values, (err, result) => {
                            if (err) {
                                res.status(200).json({ message: "Video update fail." });
                            }
                            return res.status(200).json({ message: "Video updated successfully." });
                        });
                    }
                });
            }
        });
    });
});

app.post("/deleteCourseVideo", (req, res) => {
    const query = "SELECT file_name, thumbnail_name FROM Videos WHERE id = ? AND course_id = ?";
    const values = [req.body.id, req.body.courseId];
    db.query(query, values, (err, result) => {
        if (err) {
            res.status(200).json({ message: "Video delete fail." });
        }
        const fileName = result[0].file_name;
        const thumbnailName = result[0].thumbnail_name;
        fs.unlink("resources/courseVideos/" + fileName, (err) => {
            if (err) {
                res.status(500).json({ error: "Failed to delete video" });
            } else {
                fs.unlink("resources/courseVideos/" + thumbnailName, (err) => {
                    if (err) {
                        res.status(500).json({ error: "Failed to delete thumbnail" });
                    } else {
                        const query = "DELETE FROM Videos WHERE id = ? AND course_id = ?";
                        const values = [req.body.id, req.body.courseId];
                        db.query(query, values, (err, result) => {
                            if (err) {
                                res.status(200).json({ message: "Video delete fail." });
                            }
                            return res.status(200).json({ message: "Video deleted successfully." });
                        });
                    }
                });
            }
        });
    });
});

app.post("/getCourseVideoInfo", (req, res) => {
    const query = "SELECT * FROM Videos WHERE id = ? AND course_id = ?";
    const values = [req.body.videoId, req.body.courseId];
    db.query(query, values, (err, result) => {
        if (err) {
            res.json(err);
        }
        return res.json(result);
    });
});

app.get("/getCourseVideo/:id", (req, res) => {
    const videoPath = path.join(process.cwd(), "resources", "courseVideos", req.params.id);

    console.log(videoPath);

    // Get video file stats
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;

    // Check if the client supports partial content
    const range = req.headers.range;
    if (range) {
        // Parse the range header to get the start and end bytes
        const [start, end] = range.replace(/bytes=/, "").split("-");
        const startByte = parseInt(start, 10);
        const endByte = end ? parseInt(end, 10) : fileSize - 1;
        const chunkSize = endByte - startByte + 1;

        // Set the partial content headers
        res.writeHead(206, {
            "Content-Range": `bytes ${startByte}-${endByte}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize,
            "Content-Type": "video/mp4",
        });

        // Create a readable stream from the video file
        const videoStream = fs.createReadStream(videoPath, { start: startByte, end: endByte });

        // Pipe the video stream to the response stream
        videoStream.pipe(res);
    } else {
        // Set the headers for the entire video file
        res.writeHead(200, {
            "Content-Length": fileSize,
            "Content-Type": "video/mp4",
        });

        // Create a readable stream from the video file
        const videoStream = fs.createReadStream(videoPath);

        // Pipe the video stream to the response stream
        videoStream.pipe(res);
    }
});

app.get("/getCourseVideoThumbnail/:id", (req, res) => {
    const thumbnailPath = path.join(process.cwd(), "resources", "courseVideos", req.params.id);
    res.sendFile(thumbnailPath);
});

// homework
app.post("/uploadHomework", uploadHomework.single("file"), (req, res) => {
    const filePath = req.file.path;
    const fileName = path.basename(filePath);
    const query1 = "CALL InsertHomeworkAndFileMetadata(?, ?, ?, ?, ?, ?, @homeworkId)";
    const query2 = "SELECT @homeworkId";
    const values = [req.body.courseId, req.body.title, req.body.description, req.body.dueDate, fileName, req.file.originalname];
    db.query(query1, values, (err, result) => {
        if (err) {
            res.status(200).json({ message: "Homework uploaded fail." });
        } else {
            db.query(query2, (err, result) => {
                if (err) {
                    res.status(200).json({ message: "Homework uploaded fail." });
                } else {
                    const homeworkId = result[0]["@homeworkId"];
                    return res.json({ id: homeworkId });
                }
            });
        }
    });
});

app.post("/updateHomework", uploadHomework.single("file"), (req, res) => {
    const filePath = req.file.path;
    const fileName = path.basename(filePath);
    const query = "SELECT file_name FROM Homeworks WHERE id = ? AND course_id = ?";
    const values = [req.body.id, req.body.courseId];
    db.query(query, values, (err, result) => {
        if (err) {
            res.status(200).json({ message: "Homework update fail." });
        }
        const oldFileName = result[0].file_name;
        fs.unlink("resources/homeworks/" + oldFileName, (err) => {
            if (err) {
                res.status(500).json({ error: "Failed to delete old Homewrk" });
            } else {
                const query = "CALL UpdateHomeworkAndFileMetadata(?, ?, ?, ?, ?, ?, ?, ?)";
                const values = [req.body.id, req.body.courseId, req.body.title, req.body.description, req.body.dueDate, fileName, oldFileName, req.file.originalname];
                db.query(query, values, (err, result) => {
                    if (err) {
                        res.status(200).json({ message: "Homework update fail." });
                    }
                    return res.status(200).json({ message: "Homework updated successfully." });
                });
            }
        });
    });
});

app.get("/downloadHomework/:id", (req, res) => {
    const coursewarePath = path.join(process.cwd(), "resources", "homeworks", req.params.id);
    const query = "SELECT file_name FROM FilesMetadata WHERE id = ? AND is_courseware = false";
    const values = [req.params.id];
    db.query(query, values, (err, result) => {
        if (err) {
            res.status(200).json({ message: "Courseware download fail." });
        }
        const fileName = result[0].file_name;

        // Set the appropriate headers
        res.setHeader("Content-type", "application/octet-stream");
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

        // Stream the file to the response
        const fileStream = fs.createReadStream(coursewarePath);
        fileStream.pipe(res); // Pipe the data to the response
    });
});

app.post("/getHomework", (req, res) => {
    const query = "SELECT h.id, h.course_id, h.title, h.description, h.file_name, DATE_FORMAT(h.due_date, '%Y-%m-%d %H:%i:%s') AS due_date FROM Homeworks h WHERE course_id = ? AND id = ?";
    const values = [req.body.courseId, req.body.homeworkId];
    db.query(query, values, (err, result) => {
        if (err) {
            res.json(err);
        }
        return res.json(result);
    });
});

// course
app.post("/getCoursewares", (req, res) => {
    const query = "SELECT * FROM Coursewares WHERE course_id = ?";
    const values = [req.body.courseId];
    db.query(query, values, (err, result) => {
        if (err) {
            res.json(err);
        }
        return res.json(result);
    });
});

app.post("/getCourseVideos", (req, res) => {
    const query = "SELECT * FROM Videos WHERE course_id = ?";
    const values = [req.body.courseId];
    db.query(query, values, (err, result) => {
        if (err) {
            res.json(err);
        }
        return res.json(result);
    });
});

app.post("/getHomeworks", (req, res) => {
    const query = "SELECT * FROM Homeworks WHERE course_id = ?";
    const values = [req.body.courseId];
    db.query(query, values, (err, result) => {
        if (err) {
            res.json(err);
        }
        return res.json(result);
    });
});

// course info
app.post("/getCourseInfo", (req, res) => {
    const query = "SELECT c.id, c.teacher_id, c.title, c.category, c.thumbnail_name, c.description, DATE_FORMAT(c.registration_start_date, '%Y-%m-%d') AS registration_start_date, DATE_FORMAT(c.registration_end_date, '%Y-%m-%d') AS registration_end_date, DATE_FORMAT(c.start_date, '%Y-%m-%d') AS start_date, DATE_FORMAT(c.end_date, '%Y-%m-%d') AS end_date, c.capacity, c.sign_students, t.name AS teacher_name FROM Courses c JOIN Teachers t ON c.teacher_id = t.id WHERE c.id = ?";
    const values = [req.body.id];
    db.query(query, values, (err, result) => {
        if (err) {
            res.json(err);
        }
        return res.json(result);
    });
});

app.post("/uploadCourseInfo", uploadThumbnail.single("file"), (req, res) => {
    const filePath = req.file.path;
    const fileName = path.basename(filePath);
    const query1 = "CALL InsertCourse(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @new_id, @result_message)";
    const query2 = "SELECT @result_message, @new_id;";
    const values = [req.body.title, req.body.teacherId, fileName, req.body.description, req.body.category, req.body.registrationStartDate, req.body.registrationEndDate, req.body.startDate, req.body.endDate, req.body.capacity];
    db.query(query1, values, (err, result) => {
        if (err) {
            res.status(200).json({ message: "File uploaded fail." });
        } else {
            db.query(query2, (err, result) => {
                if (err) {
                    res.status(200).json({ message: "File uploaded fail." });
                }
                const resultMessage = result[0]["@result_message"];
                const newId = result[0]["@new_id"];
                return res.json({ result: resultMessage, id: newId });
            });
        }
    });
});

app.post("/updateCourseInfo", uploadThumbnail.single("file"), (req, res) => {
    const filePath = req.file.path;
    const fileName = path.basename(filePath);
    const query = "SELECT thumbnail_name FROM Courses WHERE id = ?";
    const values = [req.body.id];
    db.query(query, values, (err, result) => {
        if (err) {
            res.status(200).json({ message: "File uploaded fail." });
        }
        const oldFileName = result[0].thumbnail_name;
        fs.unlink("resources/thumbnails/" + oldFileName, (err) => {
            if (err) {
                res.status(500).json({ error: "Failed to delete file" });
            } else {
                const query = "UPDATE Courses SET title = ?, thumbnail_name = ?, description = ?, category = ?, registration_start_date = ?, registration_end_date = ?, start_date = ?, end_date = ?, capacity = ?  WHERE id = ?";
                const values = [req.body.title, fileName, req.body.description, req.body.category, req.body.registrationStartDate, req.body.registrationEndDate, req.body.startDate, req.body.endDate, req.body.capacity, req.body.id];
                db.query(query, values, (err, result) => {
                    if (err) {
                        res.status(200).json({ message: "File uploaded fail." });
                    }
                    return res.status(200).json({ message: "File uploaded successfully." });
                });
            }
        });
    });
});

app.get("/getCourseInfoThumbnail/:id", (req, res) => {
    const imagePath = path.join(process.cwd(), "resources", "thumbnails", req.params.id);
    res.sendFile(imagePath);
});

app.post("/getStudentCourses", (req, res) => {
    const query = "SELECT * FROM StudentCourses WHERE student_id = ?";
    const values = [req.body.studentId];
    db.query(query, values, (err, result) => {
        if (err) {
            res.json(err);
        }
        return res.json(result);
    });
});

app.post("/getStudentHomeworks", (req, res) => {
    const query = "SELECT Students.id, Students.name, Students.email, StudentHomeworks.grade, StudentHomeworks.file_name FROM Students JOIN StudentHomeworks ON Students.id = StudentHomeworks.student_id WHERE StudentHomeworks.homework_id = ?";
    const values = [req.body.homeworkId];
    db.query(query, values, (err, result) => {
        if (err) {
            res.json(err);
        }
        return res.json(result);
    });
});

app.post("/gradeStudentHomework", (req, res) => {
    const query = "UPDATE StudentHomeworks SET grade = ? WHERE student_id = ? AND homework_id = ? AND course_id = ?";
    const values = [req.body.grade, req.body.studentId, req.body.homeworkId, req.body.courseId];
    db.query(query, values, (err, result) => {
        if (err) {
            res.json(err);
        }
        return res.json(result);
    });
});

app.post("/gradeStudentCourse", (req, res) => {
    const query = "UPDATE StudentCourses SET grade = ? WHERE student_id = ? AND course_id = ?";
    const values = [req.body.grade, req.body.studentId, req.body.courseId];
    db.query(query, values, (err, result) => {
        if (err) {
            res.json(err);
        }
        return res.json(result);
    });
});

app.post("/getCourseStudents", (req, res) => {
    const searchEnable = req.body.searchEnable;
    const searchFor = req.body.searchFor;
    const idAscending = req.body.idAscending;
    const nameAscending = req.body.nameAscending;
    const genderAscending = req.body.genderAscending;
    const ageAscending = req.body.ageAscending;
    const emailAscending = req.body.emailAscending;
    const gradeAscending = req.body.gradeAscending;
    const orderBy = req.body.orderBy;

    let query = "SELECT Students.id, Students.name, Students.gender, Students.age, Students.email, StudentCourses.grade FROM Students JOIN StudentCourses ON Students.id = StudentCourses.student_id WHERE StudentCourses.course_id = ?";
    const values = [req.body.courseId];

    if (searchEnable && searchFor !== "") {
        query += " AND";
        query += " (Students.name LIKE '%" + searchFor + "%'";
        query += " OR Students.email LIKE '%" + searchFor + "%'";
        query += " OR students.id LIKE '%" + searchFor + "%')";
    }

    let orderByClause = orderBy >= 1 && orderBy <= 6 ? " ORDER BY" : "";

    if (orderBy === 1) {
        if (idAscending) {
            orderByClause += " Students.id ASC";
        } else {
            orderByClause += " Students.id DESC";
        }
    }

    if (orderBy === 2) {
        if (nameAscending) {
            orderByClause += " Students.name ASC";
        } else {
            orderByClause += " Students.name DESC";
        }
    }

    if (orderBy === 3) {
        if (emailAscending) {
            orderByClause += " Students.email ASC";
        } else {
            orderByClause += " Students.email DESC";
        }
    }

    if (orderBy === 4) {
        if (genderAscending) {
            orderByClause += " Students.gender ASC";
        } else {
            orderByClause += " Students.gender DESC";
        }
    }
    if (orderBy === 5) {
        if (ageAscending) {
            orderByClause += " Students.age ASC";
        } else {
            orderByClause += " Students.age DESC";
        }
    }

    if (orderBy === 6) {
        if (gradeAscending) {
            orderByClause += " StudentCourses.grade ASC";
        } else {
            orderByClause += " StudentCourses.grade DESC";
        }
    }

    query += orderByClause;

    db.query(query, values, (err, result) => {
        if (err) {
            res.json(err);
        }
        return res.json(result);
    });
});

app.post("/getCourseStudentHomeworkGrades", (req, res) => {
    const query = "SELECT hw.title, sh.grade FROM Homeworks hw JOIN StudentHomeworks sh ON hw.id = sh.homework_id AND hw.course_id = sh.course_id WHERE hw.course_id = ? AND sh.student_id = ?";
    const values = [req.body.courseId, req.body.studentId];
    db.query(query, values, (err, result) => {
        if (err) {
            res.json(err);
        }
        return res.json(result);
    });
});

// courses
app.get("/getCourseCategories", (req, res) => {
    const query = "SELECT DISTINCT category FROM Courses";
    db.query(query, (err, result) => {
        if (err) {
            res.json(err);
        }
        return res.json(result);
    });
});

app.post("/getCourses", (req, res) => {
    const id = req.body.id;
    const isStudentSession = req.body.isStudentSession;
    const searchEnable = req.body.searchEnable;
    const searchFor = req.body.searchFor;
    const searchForCourse = req.body.searchForCourse;
    const isAllCourse = req.body.isAllCourse;
    const selectedCategories = req.body.selectedCategories;
    const selectedStates = req.body.selectedStates;
    const selectClosedCourses = selectedStates.includes("closed");
    const selectOpeningCourses = selectedStates.includes("opening");
    const selectFulledCourses = selectedStates.includes("full");
    const selectNotFulledCourses = selectedStates.includes("not full");

    // Prepare the WHERE clause for the query based on selected categories and states
    let whereClause = "";
    if (selectedCategories.length > 0) {
        const categories = selectedCategories.map((category) => mysql.escape(category)).join(",");
        whereClause += `category IN (${categories})`;
    }

    if (!(selectClosedCourses && selectOpeningCourses)) {
        if (selectClosedCourses) {
            if (whereClause !== "") whereClause += " AND ";
            whereClause += `registration_end_date < CURDATE()`;
        }
        if (selectOpeningCourses) {
            if (whereClause !== "") whereClause += " AND ";
            whereClause += `registration_start_date <= CURDATE() AND registration_end_date >= CURDATE()`;
        }
    }

    if (!(selectFulledCourses && selectNotFulledCourses)) {
        if (selectFulledCourses) {
            if (whereClause !== "") whereClause += " AND ";
            whereClause += `capacity = sign_students`;
        }
        if (selectNotFulledCourses) {
            if (whereClause !== "") whereClause += " AND ";
            whereClause += `capacity > sign_students`;
        }
    }

    if (!isAllCourse) {
        if (isStudentSession) {
            if (whereClause !== "") whereClause += " AND ";
            whereClause += "CASE WHEN sc.student_id IS NULL THEN 0 ELSE 1 END = 1";
        } else {
            if (whereClause !== "") whereClause += " AND ";
            whereClause += "c.teacher_id = '" + id + "'";
        }
    }

    if (searchEnable) {
        if (searchForCourse) {
            if (whereClause !== "") whereClause += " AND ";
            whereClause += `c.title LIKE '%${searchFor}%'`;
        } else {
            if (whereClause !== "") whereClause += " AND ";
            whereClause += `t.name LIKE '%${searchFor}%'`;
        }
    }

    if (whereClause !== "") {
        whereClause = "WHERE " + whereClause;
    }

    // Prepare the select clause for the query based on the session
    let selectClause = "";
    if (isStudentSession) {
        selectClause = "SELECT c.id, c.title, c.category, c.thumbnail_name, c.description, DATE_FORMAT(c.registration_start_date, '%Y-%m-%d') AS registration_start_date, DATE_FORMAT(c.registration_end_date, '%Y-%m-%d') AS registration_end_date, DATE_FORMAT(c.start_date, '%Y-%m-%d') AS start_date, DATE_FORMAT(c.end_date, '%Y-%m-%d') AS end_date, c.capacity, c.sign_students, t.name AS teacher_name, CASE WHEN sc.student_id IS NULL THEN 0 ELSE 1 END AS selected_by_student FROM Courses c JOIN Teachers t ON c.teacher_id = t.id LEFT JOIN StudentCourses sc ON c.id = sc.course_id AND sc.student_id = '" + id + "' ";
    } else {
        selectClause = "SELECT c.id, c.title, c.category, c.thumbnail_name, c.description, DATE_FORMAT(c.registration_start_date, '%Y-%m-%d') AS registration_start_date, DATE_FORMAT(c.registration_end_date, '%Y-%m-%d') AS registration_end_date, DATE_FORMAT(c.start_date, '%Y-%m-%d') AS start_date, DATE_FORMAT(c.end_date, '%Y-%m-%d') AS end_date, c.capacity, c.sign_students, t.name AS teacher_name FROM Courses c JOIN Teachers t ON c.teacher_id = t.id ";
    }
    // Construct the SQL query
    const query = selectClause + whereClause;
    // Execute the query using the connection pool
    db.query(query, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: error });
        } else {
            res.json(results);
        }
    });
});

app.post("/checkOnUserCourse", (req, res) => {
    const isStudentSession = req.body.isStudentSession;
    const userId = req.body.userId;
    const courseId = req.body.courseId;
    let query = "";
    if (isStudentSession) {
        query = "SELECT COUNT(*) FROM StudentCourses WHERE student_id = ? AND course_id = ?";
    } else {
        query = "SELECT COUNT(*) FROM Courses WHERE teacher_id = ? AND id = ?";
    }
    const values = [userId, courseId];
    db.query(query, values, (err, result) => {
        if (err) {
            res.json(err);
        }
        return res.json(result[0]["COUNT(*)"]);
    });
});

app.post("/getStudentHomework", (req, res) => {
    const query = "SELECT * FROM StudentHomeworks WHERE student_id = ? AND homework_id = ? AND course_id = ?";
    const values = [req.body.studentId, req.body.homeworkId, req.body.courseId];
    db.query(query, values, (err, result) => {
        if (err) {
            res.json(err);
        }
        return res.json(result);
    });
});

app.post("/studentUploadHomework", uploadHomework.single("file"), (req, res) => {
    const filePath = req.file.path;
    const fileName = path.basename(filePath);
    const query = "CALL StudentUploadHomework(?, ?, ?, ?, ?)";
    const values = [req.body.studentId, req.body.homeworkId, req.body.courseId, fileName, req.file.originalname];
    db.query(query, values, (err, result) => {
        if (err) {
            res.status(200).json({ message: "Homework uploaded fail." });
        }
        res.status(200).json({ message: "Homework uploaded successfully." });
    });
});

app.post("/getGrades", (req, res) => {
    const query = "SELECT c.id, c.title, sc.grade FROM Courses c JOIN StudentCourses sc ON c.id = sc.course_id WHERE sc.student_id = ? ";
    const values = [req.body.studentId];
    db.query(query, values, (err, result) => {
        if (err) {
            res.json(err);
        }
        return res.json(result);
    });
});

app.post("/getGradeAverage", (req, res) => {
    const query = "SELECT COUNT(*) AS course_count, AVG(sc.grade) AS average_grade FROM StudentCourses sc WHERE sc.student_id = ? ";
    const values = [req.body.studentId];
    db.query(query, values, (err, result) => {
        if (err) {
            res.json(err);
        }
        return res.json(result);
    });
});

app.listen(3001, () => {
    console.log("connected to backend");
});
