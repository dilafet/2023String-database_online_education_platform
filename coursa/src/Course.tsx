import "./course.css";
import { Link, Routes, Route, Outlet, useLocation } from "react-router-dom";
import demoimage from "./assets/Unknown.jpeg";
import { useEffect, useState } from "react";
import axios from "axios";

function Course(props: { courseId: string; studentId: string; onTeacherClick: any }) {
    const location = useLocation();
    const pathnameParts = location.pathname.split("/");

    return (
        <div className="course-container">
            <CourseInfo courseId={props.courseId} onTeacherClick={props.onTeacherClick} />
            <div className="course-option-buttons-container">
                <Link to="./courseware" className={pathnameParts[2] === "courseware" ? "course-option-button selected" : "course-option-button"}>
                    Courseware
                </Link>
                <Link to="./homeworks" className={pathnameParts[2] === "homeworks" ? "course-option-button selected" : "course-option-button"}>
                    Homework
                </Link>
                <Link to="./videos" className={pathnameParts[2] === "videos" ? "course-option-button selected" : "course-option-button"}>
                    Video
                </Link>
            </div>

            <Outlet />
        </div>
    );
}

function CourseInfo(props: { courseId: string; onTeacherClick: any }) {
    const [teacherId, setTeacherId] = useState("");
    const [title, setTitle] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [teacher, setTeacher] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [registerStartDate, setRegisterStartDate] = useState("");
    const [registerEndDate, setRegisterEndDate] = useState("");
    const [courseStartDate, setCourseStartDate] = useState("");
    const [courseEndDate, setCourseEndDate] = useState("");
    const [capacityForEditing, setCapacityForEditing] = useState(0);
    const [capacity, setCapacity] = useState("");

    const getCourseInfo = async () => {
        try {
            const res = await axios.post("http://localhost:3001/getCourseInfo", {
                id: props.courseId,
            });
            setTeacherId(res.data[0].teacher_id);
            setTitle(res.data[0].title);
            setThumbnail("http://localhost:3001/getCourseInfoThumbnail/" + res.data[0].thumbnail_name);
            setTeacher(res.data[0].teacher_name);
            setDescription(res.data[0].description);
            setCategory(res.data[0].category);
            setRegisterStartDate(res.data[0].registration_start_date.slice(0, 10));
            setRegisterEndDate(res.data[0].registration_end_date.slice(0, 10));
            setCourseStartDate(res.data[0].start_date.slice(0, 10));
            setCourseEndDate(res.data[0].end_date.slice(0, 10));
            setCapacity(res.data[0].sign_students.toString() + "/" + res.data[0].capacity.toString());
            setCapacityForEditing(res.data[0].capacity);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getCourseInfo();
    }, []);

    return (
        <div className="course-info-container">
            <img className="course-image" src={thumbnail} />
            <div className="course-text">
                <div className="course-title">{title}</div>
                <div
                    className="course-teacher"
                    onClick={() => {
                        props.onTeacherClick(teacherId);
                    }}
                >
                    {teacher}
                </div>
                <div className="course-description">{description}</div>
                <div className="course-category">{category}</div>
                <div className="course-date">
                    RD : {registerStartDate} ~ {registerEndDate}
                </div>
                <div className="course-date">
                    CD : {courseStartDate} ~ {courseEndDate}
                </div>
                <div className="course-volume">capacity: {capacity}</div>
            </div>
        </div>
    );
}

function Courseware(props: { courseId: string }) {
    const [coursewares, setCoursewares] = useState([]);
    const getCourseWares = () => {
        axios
            .post("http://localhost:3001/getCoursewares", {
                courseId: props.courseId,
            })
            .then((response) => {
                setCoursewares(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    useEffect(() => {
        getCourseWares();
    }, []);
    return (
        <div className="course-attribute-container">
            {coursewares.map((courseware: { id: string; title: string; file_name: string }) => (
                <CoursewareItem key={courseware.id} title={courseware.title} fileName={courseware.file_name} />
            ))}
        </div>
    );
}

function CoursewareItem(props: { title: string; fileName: string }) {
    const downloadCourseware = () => {
        window.location.href = "http://localhost:3001/downloadCourseware/" + props.fileName;
    };
    return (
        <div className="course-attribute-item" onClick={downloadCourseware}>
            <div className="course-attribute-item-title">
                <span>{props.title}</span>
            </div>
            <div className="divider"></div>
        </div>
    );
}

function CourseHomework(props: { courseId: string; onClick: any }) {
    const [homeworks, setHomeworks] = useState([]);
    const getHomeworks = () => {
        axios
            .post("http://localhost:3001/getHomeworks", {
                courseId: props.courseId,
            })
            .then((response) => {
                setHomeworks(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        getHomeworks();
    }, []);

    return (
        <div className="course-attribute-container">
            {homeworks.map((homework: { id: string; title: string }) => (
                <CourseHomeworkItem
                    key={homework.id}
                    title={homework.title}
                    courseId={props.courseId}
                    onClick={() => {
                        props.onClick(homework.id);
                    }}
                />
            ))}
        </div>
    );
}

function CourseHomeworkItem(props: { title: string; courseId: string; onClick: any }) {
    return (
        <div className="course-attribute-item" onClick={props.onClick}>
            <div className="course-attribute-item-title">
                <span>{props.title}</span>
            </div>
            <div className="divider"></div>
        </div>
    );
}

function CourseVideo(props: { courseId: string; onPlayVideo: any }) {
    const [courseVideos, setCourseVideos] = useState([]);

    const getVideos = () => {
        axios
            .post("http://localhost:3001/getCourseVideos", {
                courseId: props.courseId,
            })
            .then((response) => {
                setCourseVideos(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getVideos();
    }, []);

    return (
        <div className="course-attribute-container">
            {courseVideos.map((video: { id: string; title: string; file_name: string; thumbnail_name: string }) => (
                <CourseVideoItem
                    key={video.id}
                    title={video.title}
                    videoFileName={video.file_name}
                    thumbnailFileName={video.thumbnail_name}
                    onPlayVideo={() => {
                        props.onPlayVideo(video.id);
                    }}
                />
            ))}
        </div>
    );
}

function CourseVideoItem(props: { title: string; videoFileName: string; thumbnailFileName: string; onPlayVideo: any }) {
    const thumbnailUrl = "http://localhost:3001/getCourseVideoThumbnail/" + props.thumbnailFileName;

    return (
        <div className="course-video-item" onClick={props.onPlayVideo}>
            <img className="course-video-thumbnail" src={thumbnailUrl} />
            <div className="course-video-title-teacher">
                <span>{props.title}</span>
            </div>
            <div className="divider"></div>
        </div>
    );
}

function CourseVideoPlay(props: { id: string; courseId: string }) {
    const [videoUrl, setVideoUrl] = useState("");
    const [videoTitle, setVideoTitle] = useState("");
    const getVideo = async () => {
        try {
            const res = await axios.post("http://localhost:3001/getCourseVideoInfo", {
                videoId: props.id,
                courseId: props.courseId,
            });
            setVideoUrl("http://localhost:3001/getCourseVideo/" + res.data[0].file_name);
            setVideoTitle(res.data[0].title);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getVideo();
    }, []);

    return (
        <div className="course-video-player">
            <video className="course-video-player-video-container" controls>
                <source src={videoUrl} type="video/mp4" />
            </video>
            <div className="course-video-player-title">{videoTitle}</div>
        </div>
    );
}

function Homework(props: { isUserHomework: boolean; studentId: string; courseId: string; homeworkId: string }) {
    const [uploadedFile, setUploadedFile] = useState<File>();
    const [uploadedFileName, setUploadedFileName] = useState("No file chosen");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [homeworkFileName, setHomeworkFileName] = useState("");
    const [grade, setGrade] = useState("");
    const [isSumitted, setIsSubmitted] = useState(false);

    const getHomework = () => {
        try {
            axios
                .post("http://localhost:3001/getHomework", {
                    homeworkId: props.homeworkId,
                    courseId: props.courseId,
                })
                .then((response) => {
                    setTitle(response.data[0].title);
                    setDescription(response.data[0].description);
                    setDueDate(response.data[0].due_date);
                    setHomeworkFileName(response.data[0].file_name);
                });
        } catch (error) {
            console.log(error);
        }
    };

    const downloadHomeworkFile = () => {
        window.location.href = "http://localhost:3001/downloadHomework/" + homeworkFileName;
    };

    const getStudentHomework = () => {
        try {
            axios
                .post("http://localhost:3001/getStudentHomework", {
                    homeworkId: props.homeworkId,
                    courseId: props.courseId,
                    studentId: props.studentId,
                })
                .then((response) => {
                    if (response.data.length > 0) {
                        if (response.data[0].grade === null) {
                            setGrade("Not graded yet");
                        } else {
                            setGrade(response.data[0].grade);
                        }
                        setIsSubmitted(true);
                    }
                });
        } catch (error) {
            console.log(error);
        }
    };

    const uploadHomework = async () => {
        if (uploadedFile) {
            const formData = new FormData();
            formData.append("file", uploadedFile);
            formData.append("studentId", props.studentId);
            formData.append("homeworkId", props.homeworkId);
            formData.append("courseId", props.courseId);
            await axios.post("http://localhost:3001/studentUploadHomework", formData);
            getStudentHomework();
        }
    };

    useEffect(() => {
        getHomework();
        if (props.isUserHomework) {
            getStudentHomework();
        }
    }, []);

    return (
        <div className="homework">
            <div className="homework-title-container">
                <div className="homework-title">
                    <span>{title}</span>
                </div>
            </div>
            <div className="homework-description">{description}</div>
            <div className="homework-due-date">Due date: {dueDate}</div>
            <div className="homework-downloadable" onClick={downloadHomeworkFile}>
                {homeworkFileName}
            </div>
            {!isSumitted && props.isUserHomework && (
                <div className="homework-uploader">
                    <input
                        id="homework-file-chooser"
                        type="file"
                        hidden
                        onChange={(e) => {
                            const fileName = e.target.files?.item(0);
                            if (e.target.files) {
                                setUploadedFile(e.target.files[0]);
                            }
                            if (fileName) {
                                setUploadedFileName(fileName.name);
                            }
                        }}
                    />
                    <label htmlFor="homework-file-chooser" className="homework-uploaded">
                        upload homework
                    </label>
                    <span id="file-chosen">{uploadedFileName}</span>
                </div>
            )}
            {isSumitted && props.isUserHomework && <div className="homework-grade">Grade: {grade}</div>}
            {!isSumitted && props.isUserHomework && (
                <div className="homework-submit" onClick={uploadHomework}>
                    submit
                </div>
            )}
        </div>
    );
}

export { Course, CourseHomework, CourseVideo, Courseware, CourseVideoPlay, Homework };
