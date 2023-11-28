import "./course.css";
import { Link, Routes, Route, Outlet, useLocation, useNavigate } from "react-router-dom";
import demoimage from "./assets/Unknown.jpeg";
import { SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { Course } from "./Course";

function CourseTeacher(props: { courseId: string; teacherId: string; tryToAddNewCourse: boolean; onNewCourseAdded: any }) {
    const location = useLocation();
    const pathnameParts = location.pathname.split("/");
    const Navigate = useNavigate();

    useEffect(() => {
        if (!props.tryToAddNewCourse) {
            // Navigate("/course/courseware");
        }
    }, []);

    return (
        <div className="course-container">
            <CourseInfo courseId={props.courseId} teacherId={props.teacherId} tryToAddNewCourse={props.tryToAddNewCourse} newCourseAdded={props.onNewCourseAdded} />
            {!props.tryToAddNewCourse && (
                <div className="course-option-buttons-container-teacher">
                    <Link to="./courseware" className={pathnameParts[2] === "courseware" ? "course-option-button-teacher selected-teacher" : "course-option-button-teacher"}>
                        Courseware
                    </Link>
                    <Link to="./homeworks" className={pathnameParts[2] === "homeworks" ? "course-option-button-teacher selected-teacher" : "course-option-button-teacher"}>
                        Homework
                    </Link>
                    <Link to="./videos" className={pathnameParts[2] === "videos" ? "course-option-button-teacher selected-teacher" : "course-option-button-teacher"}>
                        Video
                    </Link>
                    <Link to="./students" className={pathnameParts[2] === "students" ? "course-option-button-teacher selected-teacher" : "course-option-button-teacher"}>
                        Students
                    </Link>
                </div>
            )}
            <Outlet />
        </div>
    );
}

function CourseInfo(props: { courseId: string; teacherId: string; tryToAddNewCourse: boolean; newCourseAdded: any }) {
    const [selectedFile, setSelectedFile] = useState<File>();
    const [uploadedFileName, setUploadedFileName] = useState("No file chosen");
    const [isEditing, setIsEditing] = useState(false);

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

    let titleTemp = title;
    let descriptionTemp = description;
    let categoryTemp = category;
    let registerStartDateTemp = registerStartDate;
    let registerEndDateTemp = registerEndDate;
    let courseStartDateTemp = courseStartDate;
    let courseEndDateTemp = courseEndDate;
    let capacityTemp = capacityForEditing;
    let signUpstduentsCount = -1;

    const getCourseInfo = async () => {
        try {
            const res = await axios.post("http://localhost:3001/getCourseInfo", {
                id: props.courseId,
            });
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
            titleTemp = res.data[0].title;
            descriptionTemp = res.data[0].description;
            categoryTemp = res.data[0].category;
            registerStartDateTemp = res.data[0].registration_start_date.slice(0, 10);
            registerEndDateTemp = res.data[0].registration_end_date.slice(0, 10);
            courseStartDateTemp = res.data[0].start_date.slice(0, 10);
            courseEndDateTemp = res.data[0].end_date.slice(0, 10);
            capacityTemp = res.data[0].capacity;
            signUpstduentsCount = res.data[0].sign_students;
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (props.tryToAddNewCourse) {
            setIsEditing(true);
        } else {
            getCourseInfo();
        }
    }, []);

    const saveTemp = () => {
        setTitle(titleTemp);
        setDescription(descriptionTemp);
        setCategory(categoryTemp);
        setRegisterStartDate(registerStartDateTemp);
        setRegisterEndDate(registerEndDateTemp);
        setCourseStartDate(courseStartDateTemp);
        setCourseEndDate(courseEndDateTemp);
        setCapacityForEditing(capacityTemp);
    };

    const uploadCourseInfo = async () => {
        const formData = new FormData();
        formData.append("file", selectedFile!);
        formData.append("title", titleTemp);
        formData.append("teacherId", props.teacherId);
        formData.append("description", descriptionTemp);
        formData.append("registrationStartDate", registerStartDateTemp);
        formData.append("registrationEndDate", registerEndDateTemp);
        formData.append("startDate", courseStartDateTemp);
        formData.append("endDate", courseEndDateTemp);
        formData.append("capacity", capacityTemp.toString());
        formData.append("category", categoryTemp);
        try {
            const res = await axios.post("http://localhost:3001/uploadCourseInfo", formData);
            if (res.data.result === "Insertion successful") {
                props.newCourseAdded(res.data.id);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const updateCourseInfo = async () => {
        try {
            const formData = new FormData();
            formData.append("file", selectedFile!);
            formData.append("id", props.courseId);
            formData.append("title", titleTemp);
            formData.append("description", descriptionTemp);
            formData.append("registrationStartDate", registerStartDateTemp);
            formData.append("registrationEndDate", registerEndDateTemp);
            formData.append("startDate", courseStartDateTemp);
            formData.append("endDate", courseEndDateTemp);
            formData.append("capacity", capacityTemp.toString());
            formData.append("category", categoryTemp);
            const res = await axios.post("http://localhost:3001/updateCourseInfo", formData);
        } catch (err) {
            console.log(err);
        }
    };

    const submitHandler = async () => {
        if (selectedFile && titleTemp.trim() !== "" && descriptionTemp.trim() !== "" && categoryTemp.trim() !== "" && registerStartDateTemp.trim() !== "" && registerEndDateTemp.trim() !== "" && courseStartDateTemp.trim() !== "" && courseEndDateTemp.trim() !== "" && capacityTemp > 0) {
            const register_start_date = new Date(registerStartDateTemp);
            const register_end_date = new Date(registerEndDateTemp);
            const course_start_date = new Date(courseStartDateTemp);
            const course_end_date = new Date(courseEndDateTemp);
            if (register_start_date <= register_end_date && course_start_date <= course_end_date && register_start_date <= course_start_date && register_end_date <= course_end_date) {
                if (!props.tryToAddNewCourse) {
                    if (signUpstduentsCount <= capacityTemp) {
                        // okey to submit
                        await updateCourseInfo();
                        await getCourseInfo();
                        setIsEditing(false);
                    }
                } else {
                    // okey to submit
                    await uploadCourseInfo();
                    setIsEditing(false);
                }
            }
        }
    };

    const CourseInformation = () => {
        return (
            <div className="course-info-container">
                <img className="course-image" src={thumbnail} />
                <div className="course-text">
                    <div className="course-title">{title}</div>
                    <div className="course-teacher">{teacher}</div>
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
    };

    const CourseInformationEdit = () => {
        return (
            <div className="course-info-edit-container">
                <div className="course-info-thumbnail-chooser">
                    <input
                        id="course-thumbnail-chooser"
                        type="file"
                        hidden
                        onChange={(e) => {
                            const fileName = e.target.files?.item(0);
                            saveTemp();
                            if (e.target.files) {
                                setSelectedFile(e.target.files[0]);
                            }
                            if (fileName) {
                                setUploadedFileName(fileName.name);
                            }
                        }}
                        accept="image/*"
                    />
                    <label htmlFor="course-thumbnail-chooser" className="course-thumbnail-label">
                        upload thumbnail
                    </label>
                    <span id="course-thumbnail-chosen">{uploadedFileName}</span>
                </div>
                <InputBox
                    type="text"
                    prompt="Title"
                    disabled={false}
                    onChange={(e: string) => {
                        titleTemp = e;
                    }}
                    defaultValue={title}
                />
                <InputBox
                    type="text"
                    prompt="description"
                    disabled={false}
                    onChange={(e: string) => {
                        descriptionTemp = e;
                    }}
                    defaultValue={description}
                />
                <InputBox
                    type="text"
                    prompt="category"
                    disabled={false}
                    onChange={(e: string) => {
                        categoryTemp = e;
                    }}
                    defaultValue={category}
                />
                <div className="course-info-edit-date-container">
                    <InputBox
                        type="date"
                        prompt="register start date"
                        disabled={false}
                        onChange={(e: string) => {
                            registerStartDateTemp = e;
                        }}
                        defaultValue={registerStartDate}
                    />
                    <InputBox
                        type="date"
                        prompt="register end date"
                        disabled={false}
                        onChange={(e: string) => {
                            registerEndDateTemp = e;
                        }}
                        defaultValue={registerEndDate}
                    />
                </div>
                <div className="course-info-edit-date-container">
                    <InputBox
                        type="date"
                        prompt="course start date"
                        disabled={false}
                        onChange={(e: string) => {
                            courseStartDateTemp = e;
                        }}
                        defaultValue={courseStartDate}
                    />
                    <InputBox
                        type="date"
                        prompt="course end date"
                        disabled={false}
                        onChange={(e: string) => {
                            courseEndDateTemp = e;
                        }}
                        defaultValue={courseEndDate}
                    />
                </div>
                <InputBox
                    type="text"
                    prompt="capacity"
                    disabled={false}
                    onChange={(e: string) => {
                        const INT_REGEX = /^\d+$/;
                        if (INT_REGEX.test(e)) {
                            capacityTemp = parseInt(e);
                        }
                    }}
                    defaultValue={capacityForEditing}
                />
            </div>
        );
    };

    return (
        <div>
            {isEditing ? <CourseInformationEdit /> : <CourseInformation />}
            <div className="course-info-button-container">
                <div
                    className="course-info-button"
                    onClick={() => {
                        if (isEditing) {
                            submitHandler();
                        } else {
                            setIsEditing(true);
                        }
                    }}
                >
                    {isEditing ? "Submit" : "Edit"}
                </div>
            </div>
        </div>
    );
}

function CoursewareTeacher(props: { courseId: string }) {
    const [uploadedFileName, setUploadedFileName] = useState("No file chosen");
    const [coursewares, setCoursewares] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState("");
    const [id, setId] = useState("");

    let titleTemp = title;

    const [selectedFile, setSelectedFile] = useState<File>();

    const addNewCourseware = async () => {
        if (selectedFile && titleTemp.trim() !== "") {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("courseId", props.courseId);
            formData.append("title", titleTemp);
            await axios.post("http://localhost:3001/uploadCourseware", formData);
            // Read the file as data URL
            setSelectedFile(undefined);
            setUploadedFileName("No file chosen");
            setIsEditing(false);
            setTitle("");
            getCourseWares();
        }
    };

    const changeCourseware = async () => {
        if (selectedFile && titleTemp.trim() !== "") {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("id", id);
            formData.append("courseId", props.courseId);
            formData.append("title", titleTemp);
            await axios.post("http://localhost:3001/updateCourseware", formData);
            // Read the file as data URL
            setSelectedFile(undefined);
            setUploadedFileName("No file chosen");
            setIsEditing(false);
            setTitle("");
            getCourseWares();
        }
    };

    const deleteCourseware = async (id: string) => {
        await axios.post("http://localhost:3001/deleteCourseware", {
            id: id,
            courseId: props.courseId,
        });
        getCourseWares();
    };

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

    const CoursewareChooser = () => {
        return (
            <div className="course-attribute-chooser">
                <input
                    id="course-couresware-chooser"
                    type="file"
                    hidden
                    onChange={(e) => {
                        const fileName = e.target.files?.item(0);
                        setTitle(titleTemp);
                        if (e.target.files) {
                            setSelectedFile(e.target.files[0]);
                        }
                        if (fileName) {
                            setUploadedFileName(fileName.name);
                        }
                    }}
                />
                <label htmlFor="course-couresware-chooser" className="course-couresware-label">
                    Upload Courseware
                </label>
                <span id="course-courseware-chosen">{uploadedFileName}</span>
            </div>
        );
    };

    const CoursewareTeacherEdit = () => {
        return (
            <div className="course-attribute-edit">
                {isEditing && (
                    <>
                        <InputBox
                            type="text"
                            disabled={false}
                            prompt="Title"
                            onChange={(e: string) => {
                                titleTemp = e;
                            }}
                            defaultValue={title}
                        />
                        <CoursewareChooser />
                    </>
                )}
                <div
                    className="course-attribute-button"
                    onClick={() => {
                        if (!isEditing) {
                            //add new courseware
                            setIsEditing(true);
                            setIsAdding(true);
                        } else {
                            //submit
                            if (isAdding) {
                                addNewCourseware();
                            } else {
                                changeCourseware();
                            }
                        }
                    }}
                >
                    {isEditing ? "Submit courseware" : "Add courseware"}
                </div>
            </div>
        );
    };

    return (
        <div className="course-attribute-container">
            <CoursewareTeacherEdit />
            {coursewares.map((courseware: { id: string; title: string; file_name: string }) => (
                <CoursewareItem
                    key={courseware.id}
                    title={courseware.title}
                    fileName={courseware.file_name}
                    onEdit={() => {
                        setIsEditing(true);
                        setIsAdding(false);
                        setTitle(courseware.title);
                        setId(courseware.id);
                        titleTemp = courseware.title;
                    }}
                    onDelete={() => {
                        deleteCourseware(courseware.id);
                    }}
                />
            ))}
        </div>
    );
}

function CoursewareItem(props: { title: string; fileName: string; onEdit: any; onDelete: any }) {
    const downloadCourseware = () => {
        window.location.href = "http://localhost:3001/downloadCourseware/" + props.fileName;
    };

    return (
        <div className="course-attribute-item">
            <div className="course-attribute-item-title">
                <span onClick={downloadCourseware}>{props.title}</span>
            </div>
            <div className="course-attribute-item-button-container">
                <div className="course-attribute-item-button" onClick={props.onEdit}>
                    Edit
                </div>
                <div className="course-attribute-item-button course-attribute-item-delete" onClick={props.onDelete}>
                    Delete
                </div>
            </div>
            <div className="divider"></div>
        </div>
    );
}

function CourseHomeworkTeacher(props: { courseId: string; onEdit: any; onAdd: any }) {
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
            <div className="course-attribute-edit">
                <div className="course-attribute-button" onClick={props.onAdd}>
                    Add homework
                </div>
            </div>
            {homeworks.map((homework: { id: string; title: string }) => (
                <CourseHomeworkItem
                    key={homework.id}
                    title={homework.title}
                    courseId={props.courseId}
                    onEdit={() => {
                        props.onEdit(homework.id);
                    }}
                />
            ))}
        </div>
    );
}

function CourseHomeworkItem(props: { title: string; courseId: string; onEdit: any }) {
    return (
        <div className="course-attribute-item">
            <div className="course-attribute-item-title">
                <span>{props.title}</span>
            </div>
            <div className="course-attribute-item-button-container">
                <div className="course-attribute-item-button" onClick={props.onEdit}>
                    Edit
                </div>
            </div>
            <div className="divider"></div>
        </div>
    );
}

function CourseVideoTeacher(props: { courseId: string; onPlayVideo: any }) {
    const [uploadedVideoName, setUploadedVideoName] = useState("No file chosen");
    const [uploadedThumbnailName, setUploadedThumbnailName] = useState("No file chosen");
    const [courseVideos, setCourseVideos] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState("");
    const [id, setId] = useState("");

    let titleTemp = title;

    const [selectedVideo, setSelectedVideo] = useState<File>();
    const [selectedThumbnail, setSelectedThumbnail] = useState<File>();

    const addNewVideo = async () => {
        if (selectedVideo && selectedThumbnail && titleTemp.trim()!) {
            const formData = new FormData();
            formData.append("video", selectedVideo);
            formData.append("thumbnail", selectedThumbnail);
            formData.append("title", titleTemp);
            formData.append("courseId", props.courseId);
            await axios.post("http://localhost:3001/uploadCourseVideo", formData);
            setSelectedVideo(undefined);
            setSelectedThumbnail(undefined);
            setUploadedVideoName("No file chosen");
            setUploadedThumbnailName("No file chosen");
            setTitle("");
            setIsEditing(false);
            getVideos();
        }
    };

    const updateVideo = async () => {
        if (selectedVideo && selectedThumbnail && titleTemp.trim()!) {
            const formData = new FormData();
            formData.append("video", selectedVideo);
            formData.append("thumbnail", selectedThumbnail);
            formData.append("title", titleTemp);
            formData.append("courseId", props.courseId);
            formData.append("id", id);
            await axios.post("http://localhost:3001/updateCourseVideo", formData);
            setSelectedVideo(undefined);
            setSelectedThumbnail(undefined);
            setUploadedVideoName("No file chosen");
            setUploadedThumbnailName("No file chosen");
            setTitle("");
            setIsEditing(false);
            getVideos();
        }
    };

    const deleteVideo = async (id: string) => {
        await axios.post("http://localhost:3001/deleteCourseVideo", {
            id: id,
            courseId: props.courseId,
        });
        getVideos();
    };

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

    const playVideo = (id: string) => {};

    useEffect(() => {
        getVideos();
    }, []);

    const CourseVideoChooser = () => {
        return (
            <>
                <div className="course-attribute-chooser">
                    <input
                        id="course-video-chooser"
                        type="file"
                        hidden
                        onChange={(e) => {
                            const fileName = e.target.files?.item(0);
                            setTitle(titleTemp);
                            if (e.target.files) {
                                setSelectedVideo(e.target.files[0]);
                            }
                            if (fileName) {
                                setUploadedVideoName(fileName.name);
                            }
                        }}
                        accept="video/*"
                    />
                    <label htmlFor="course-video-chooser" className="course-couresware-label">
                        Upload Video
                    </label>
                    <span id="course-courseware-chosen">{uploadedVideoName}</span>
                </div>
                <div className="course-attribute-chooser">
                    <input
                        id="course-video-thumbnail-chooser"
                        type="file"
                        hidden
                        onChange={(e) => {
                            const fileName = e.target.files?.item(0);
                            setTitle(titleTemp);
                            if (e.target.files) {
                                setSelectedThumbnail(e.target.files[0]);
                            }
                            if (fileName) {
                                setUploadedThumbnailName(fileName.name);
                            }
                        }}
                        accept="image/*"
                    />
                    <label htmlFor="course-video-thumbnail-chooser" className="course-couresware-label">
                        Upload Video thumbnail
                    </label>
                    <span id="course-courseware-chosen">{uploadedThumbnailName}</span>
                </div>
            </>
        );
    };

    const CoursewareVideoEdit = () => {
        return (
            <div className="course-attribute-edit">
                {isEditing && (
                    <>
                        <InputBox
                            type="text"
                            disabled={false}
                            prompt="Title"
                            onChange={(e: string) => {
                                titleTemp = e;
                            }}
                            defaultValue={title}
                        />
                        <CourseVideoChooser />
                    </>
                )}
                <div
                    className="course-attribute-button"
                    onClick={() => {
                        if (!isEditing) {
                            //add new video
                            setIsEditing(true);
                            setIsAdding(true);
                        } else {
                            //submit
                            if (isAdding) {
                                addNewVideo();
                            } else {
                                updateVideo();
                            }
                        }
                    }}
                >
                    {isEditing ? "Submit video" : "Add video"}
                </div>
            </div>
        );
    };

    return (
        <div className="course-attribute-container">
            <CoursewareVideoEdit />
            {courseVideos.map((video: { id: string; title: string; file_name: string; thumbnail_name: string }) => (
                <CourseVideoItem
                    key={video.id}
                    title={video.title}
                    videoFileName={video.file_name}
                    thumbnailFileName={video.thumbnail_name}
                    onPlayVideo={() => {
                        props.onPlayVideo(video.id);
                    }}
                    onEdit={() => {
                        setIsEditing(true);
                        setIsAdding(false);
                        setTitle(video.title);
                        setId(video.id);
                        titleTemp = video.title;
                    }}
                    onDelete={() => {
                        deleteVideo(video.id);
                    }}
                />
            ))}
        </div>
    );
}

function CourseVideoItem(props: { title: string; videoFileName: string; thumbnailFileName: string; onPlayVideo: any; onEdit: any; onDelete: any }) {
    const thumbnailUrl = "http://localhost:3001/getCourseVideoThumbnail/" + props.thumbnailFileName;

    return (
        <div className="course-video-item">
            <img className="course-video-thumbnail" src={thumbnailUrl} onClick={props.onPlayVideo} />
            <div className="course-video-title-teacher">
                <span>{props.title}</span>
            </div>
            <div className="course-attribute-item-button-container">
                <div className="course-attribute-item-button" onClick={props.onEdit}>
                    Edit
                </div>
                <div className="course-attribute-item-button course-attribute-item-delete" onClick={props.onDelete}>
                    Delete
                </div>
            </div>
            <div className="divider"></div>
        </div>
    );
}

function HomeworkTeacher(props: { courseId: string; tryToAddHomework: boolean; homeworkId: string; onAddHomework: any }) {
    const [selectedFile, setSelectedFile] = useState<File>();
    const [courseHomework, setCourseHomework] = useState([]);
    const [isEditing, setIsEditing] = useState(true);
    const [uploadedFileName, setUploadedFileName] = useState("No file chosen");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [homeworkFileName, setHomeworkFileName] = useState("");

    let titleTemp = title;
    let descriptionTemp = description;
    let dueDateTemp = dueDate;

    const saveTemp = () => {
        setTitle(titleTemp);
        setDescription(descriptionTemp);
        setDueDate(dueDateTemp);
    };

    const getStudentsHomework = () => {
        axios
            .post("http://localhost:3001/getStudentHomeworks", {
                homeworkId: props.homeworkId,
            })
            .then((response) => {
                setCourseHomework(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

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

    const addNewHomework = async () => {
        if (selectedFile && titleTemp.trim() !== "" && descriptionTemp.trim() !== "" && dueDateTemp.trim() !== "") {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("title", titleTemp);
            formData.append("description", descriptionTemp);
            formData.append("dueDate", dueDateTemp);
            formData.append("courseId", props.courseId);
            try {
                //add new homework and return id
                const res = await axios.post("http://localhost:3001/uploadHomework", formData);
                const homeworkId = res.data.id;
                setIsEditing(false);
                setSelectedFile(undefined);
                setUploadedFileName("No file chosen");
                props.onAddHomework(homeworkId);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const updateHomework = async () => {
        if (selectedFile && titleTemp.trim() !== "" && descriptionTemp.trim() !== "" && dueDateTemp.trim() !== "") {
            //update homework
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("title", titleTemp);
            formData.append("description", descriptionTemp);
            formData.append("dueDate", dueDateTemp);
            formData.append("id", props.homeworkId);
            formData.append("courseId", props.courseId);
            try {
                await axios.post("http://localhost:3001/updateHomework", formData);
                setIsEditing(false);
                setSelectedFile(undefined);
                setUploadedFileName("No file chosen");
                getHomework();
            } catch (error) {
                console.log(error);
            }
        }
    };

    const submitHandler = async () => {
        if (isEditing) {
            if (props.tryToAddHomework) {
                addNewHomework();
            } else {
                updateHomework();
            }
        } else {
            setIsEditing(true);
        }
    };

    const downloadHomeworkFile = () => {
        window.location.href = "http://localhost:3001/downloadHomework/" + homeworkFileName;
    };

    useEffect(() => {
        if (!props.tryToAddHomework) {
            getHomework();
            getStudentsHomework();
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    }, []);

    const HomeworkInformationEdit = () => {
        return (
            <div className="course-info-edit-container">
                <InputBox
                    type="text"
                    prompt="Title"
                    disabled={false}
                    onChange={(e: string) => {
                        titleTemp = e;
                    }}
                    defaultValue={title}
                />
                <InputBox
                    type="text"
                    prompt="Description"
                    disabled={false}
                    onChange={(e: string) => {
                        descriptionTemp = e;
                    }}
                    defaultValue={description}
                />
                <InputBox
                    type="datetime-local"
                    prompt="Due date (DD-MM-YYYY)"
                    disabled={false}
                    onChange={(e: string) => {
                        dueDateTemp = e;
                    }}
                    defaultValue={dueDate}
                />
                <div>
                    <input
                        id="homework-file-chooser"
                        type="file"
                        hidden
                        onChange={(e) => {
                            const fileName = e.target.files?.item(0);
                            saveTemp();
                            if (e.target.files) {
                                setSelectedFile(e.target.files[0]);
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
            </div>
        );
    };

    const HomeworkInformation = () => {
        return (
            <>
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
            </>
        );
    };

    return (
        <div className="teacher-homework-container">
            <div className={isEditing ? "homework course-homework-edit" : "homework"}>
                {isEditing ? <HomeworkInformationEdit /> : <HomeworkInformation />}
                <div className="homework-buttons">
                    <div className="homework-submit homework-button" onClick={submitHandler}>
                        {isEditing ? "Submit" : "Edit"}
                    </div>
                </div>
            </div>

            <table>
                <tr className="students-homework">
                    <td>student name</td>
                    <td>email</td>
                    <td>homework</td>
                    <td>grade</td>
                </tr>
                {courseHomework.map((homework: any) => (
                    <HomeworkStudent
                        key={homework.id}
                        courseId={props.courseId}
                        homeworkId={props.homeworkId}
                        id={homework.id}
                        name={homework.name}
                        email={homework.email}
                        downloadable={homework.file_name}
                        grade={homework.grade}
                        onGradeChange={() => {
                            getStudentsHomework();
                        }}
                    />
                ))}
            </table>
        </div>
    );
}

function HomeworkStudent(props: { courseId: string; homeworkId: string; id: string; name: string; email: string; downloadable: string; grade: string; onGradeChange: any }) {
    let gradeTemp = "";

    const downloadHomework = () => {
        window.location.href = "http://localhost:3001/downloadHomework/" + props.downloadable;
    };

    const gradeHomework = async () => {
        const GRADE_REGEX = /^(100(\.0{1,2})?|\d{1,2}(\.\d{1,2})?)$/;
        if (GRADE_REGEX.test(gradeTemp)) {
            await axios
                .post("http://localhost:3001/gradeStudentHomework", {
                    grade: gradeTemp,
                    courseId: props.courseId,
                    studentId: props.id,
                    homeworkId: props.homeworkId,
                })
                .then(() => {
                    props.onGradeChange();
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const GradingBox = () => {
        return (
            <div className="student-homework-gradingBox">
                <input
                    type="text"
                    onChange={(e) => {
                        gradeTemp = e.target.value;
                    }}
                />
                <div onClick={gradeHomework}>Submit</div>
            </div>
        );
    };
    return (
        <tr className="student-homework-row">
            <td>{props.name}</td>
            <td>{props.email}</td>
            <td className="student-homework-row-downloadables" onClick={downloadHomework}>
                {props.downloadable}
            </td>
            <td>{!props.grade ? <GradingBox /> : props.grade}</td>
        </tr>
    );
}

function CourseStudents(props: { courseId: string }) {
    const [students, setStudents] = useState([]);
    const [idAscending, setIdAscending] = useState(true);
    const [nameAscending, setNameAscending] = useState(true);
    const [emailAscending, setEmailAscending] = useState(true);
    const [ageAscending, setAgeAscending] = useState(true);
    const [genderAscending, setGenderAscending] = useState(true);
    const [gradeAscending, setGradeAscending] = useState(true);
    const [orderBy, setOrderBy] = useState(1);
    let searchFor = "";

    const getStudents = (searchEnable: boolean) => {
        axios
            .post("http://localhost:3001/getCourseStudents", {
                idAscending: idAscending,
                nameAscending: nameAscending,
                emailAscending: emailAscending,
                ageAscending: ageAscending,
                genderAscending: genderAscending,
                gradeAscending: gradeAscending,
                searchFor: searchFor,
                searchEnable: searchEnable,
                courseId: props.courseId,
                orderBy: orderBy,
            })
            .then((response) => {
                setStudents(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getStudents(false);
    }, [idAscending, nameAscending, emailAscending, ageAscending, genderAscending, gradeAscending, orderBy]);

    useEffect(() => {
        getStudents(false);
    }, []);

    return (
        <div className="course-students-container">
            <div className="course-students-search">
                <input type="text" placeholder="Search student" onChange={(e) => (searchFor = e.target.value)} />
                <div onClick={() => getStudents(true)}>
                    <SearchLogo />
                </div>
            </div>
            <div className="course-students-table">
                <div className="course-students-header">
                    <div
                        onClick={() => {
                            setIdAscending(!idAscending);
                            setOrderBy(1);
                        }}
                    >
                        <span>ID</span>
                    </div>
                    <div
                        onClick={() => {
                            setNameAscending(!nameAscending);
                            setOrderBy(2);
                        }}
                    >
                        <span>Name</span>
                    </div>
                    <div
                        onClick={() => {
                            setEmailAscending(!emailAscending);
                            setOrderBy(3);
                        }}
                    >
                        <span>Email</span>
                    </div>
                    <div
                        onClick={() => {
                            setGenderAscending(!genderAscending);
                            setOrderBy(4);
                        }}
                    >
                        <span>Gender</span>
                    </div>
                    <div
                        onClick={() => {
                            setAgeAscending(!ageAscending);
                            setOrderBy(5);
                        }}
                    >
                        <span>Age</span>
                    </div>
                    <div
                        onClick={() => {
                            setGradeAscending(!gradeAscending);
                            setOrderBy(6);
                        }}
                    >
                        <span>Grade</span>
                    </div>
                    <div></div>
                </div>
                {students.map((student: { id: string; name: string; email: string; gender: string; age: string; grade: string }) => (
                    <CourseStudent
                        key={student.id}
                        courseId={props.courseId}
                        id={student.id}
                        name={student.name}
                        email={student.email}
                        gender={student.gender}
                        age={student.age}
                        grade={student.grade}
                        onGradeChange={() => {
                            getStudents(false);
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

function CourseStudent(props: { courseId: string; id: string; name: string; email: string; gender: string; age: string; grade: string; onGradeChange: any }) {
    const [grade, setGrade] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [homeworks, setHomeworks] = useState([]);
    const [isValidGrade, setIsValidGrade] = useState(false);

    const getHomeworks = () => {
        axios
            .post("http://localhost:3001/getCourseStudentHomeworkGrades", {
                courseId: props.courseId,
                studentId: props.id,
            })
            .then((response) => {
                setHomeworks(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getHomeworks();
    }, []);

    const gradeStudent = async () => {
        if (isValidGrade) {
            await axios
                .post("http://localhost:3001/gradeStudentCourse", {
                    grade: grade,
                    courseId: props.courseId,
                    studentId: props.id,
                })
                .then(() => {
                    props.onGradeChange();
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    return (
        <>
            <div className="course-student-header">
                <div>{props.id}</div>
                <div>{props.name}</div>
                <div>{props.email}</div>
                <div>{props.gender}</div>
                <div>{props.age}</div>
                <div>
                    {isEditing ? (
                        <input
                            className="course-student-grade-input"
                            onChange={(e) => {
                                setGrade(e.target.value);
                                const GRADE_REGEX = /^(100(\.0{1,2})?|\d{1,2}(\.\d{1,2})?)$/;
                                if (GRADE_REGEX.test(e.target.value)) {
                                    setIsValidGrade(true);
                                } else {
                                    setIsValidGrade(false);
                                }
                            }}
                        />
                    ) : (
                        props.grade
                    )}
                </div>
                <div>
                    <div
                        className="course-student-button"
                        onClick={() => {
                            if (isEditing) {
                                gradeStudent();
                            }
                            setIsEditing(!isEditing);
                        }}
                    >
                        {isEditing ? "Submit" : "Edit"}
                    </div>
                </div>
            </div>

            {homeworks.length !== 0 && (
                <div className="course-student-row-header">
                    <div>Homework</div>
                    <div>Grade</div>
                </div>
            )}
            {homeworks.map((homework: { id: string; title: string; grade: string }) => (
                <div className="course-student-row">
                    <div>{homework.title}</div>
                    <div>{homework.grade}</div>
                </div>
            ))}
        </>
    );
}

function InputBox(props: { type: any; disabled: any; onChange: any; prompt: any; defaultValue: any }) {
    const [isEmpty, setIsEmpty] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    const [className, setClassName] = useState("course-input-box-span course-input-box-active");

    useEffect(() => {
        if (!isEmpty || isFocused || props.defaultValue !== "") {
            setClassName("course-input-box-span course-input-box-active");
        } else {
            setClassName("course-input-box-span");
        }
    }, [isEmpty, isFocused, props.defaultValue]);

    return (
        <div className="course-input-box-container">
            <div className="course-input-box">
                <input
                    type={props.type}
                    onChange={(e) => {
                        setIsEmpty(e.target.value === "");
                        props.onChange(e.target.value);
                    }}
                    disabled={props.disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    defaultValue={props.defaultValue}
                />
                <span className={className}>
                    <p>{props.prompt}</p>
                </span>
            </div>
        </div>
    );
}

const SearchLogo = () => {
    return (
        <svg className="course-student-search-logo" width="512" height="512" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </svg>
    );
};

export { CourseTeacher, CourseHomeworkTeacher, CourseVideoTeacher, CoursewareTeacher, HomeworkTeacher, CourseStudents };
