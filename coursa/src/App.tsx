import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import AdminDashboard from "./AdminDashboard";
import Navbar from "./Navbar";
import CourseSelection from "./CourseSelection";
import { Course, Courseware, CourseHomework, CourseVideo, CourseVideoPlay, Homework } from "./Course";
import { CourseTeacher, CoursewareTeacher, CourseHomeworkTeacher, CourseVideoTeacher, HomeworkTeacher, CourseStudents } from "./CourseTeacher";
import { Personal, TeacherPersonalForStudent } from "./Personal";
import Grades from "./Grades";
import axios from "axios";

function App() {
    let isLogin = false;
    let isStudentSession = false;
    let justRegistered = false;
    let id = "";
    let selectedCourseId = "";
    let selectedVideoId = "";
    let selectedHomeworkId = "";
    let tryToAddHomework = false;
    let tryToAddCourse = false;
    let isUserCourse = true;
    let visitTeacherId = "";
    const Navigate = useNavigate();

    const IsLogin = localStorage.getItem("isLogin");
    const IsStudentSession = localStorage.getItem("isStudentSession");
    const JustRegistered = localStorage.getItem("justRegistered");
    const Id = localStorage.getItem("id");
    const SelectedCourseId = localStorage.getItem("selectedCourseId");
    const SelectedVideoId = localStorage.getItem("selectedVideoId");
    const SelectedHomeworkId = localStorage.getItem("selectedHomeworkId");
    const TryToAddHomework = localStorage.getItem("tryToAddHomework");
    const TryToAddCourse = localStorage.getItem("tryToAddCourse");
    const IsUserCourse = localStorage.getItem("isUserCourse");
    const VisitTeacherId = localStorage.getItem("visitTeacherId");

    if (IsLogin) {
        isLogin = IsLogin === "true";
    }
    if (IsStudentSession) {
        isStudentSession = IsStudentSession === "true";
    }
    if (JustRegistered) {
        justRegistered = JustRegistered === "true";
    }
    if (Id) {
        id = Id;
    }
    if (SelectedCourseId) {
        selectedCourseId = SelectedCourseId;
    }
    if (SelectedVideoId) {
        selectedVideoId = SelectedVideoId;
    }
    if (SelectedHomeworkId) {
        selectedHomeworkId = SelectedHomeworkId;
    }
    if (TryToAddHomework) {
        tryToAddHomework = TryToAddHomework === "true";
    }
    if (TryToAddCourse) {
        tryToAddCourse = TryToAddCourse === "true";
    }
    if (IsUserCourse) {
        isUserCourse = IsUserCourse === "true";
    }
    if (VisitTeacherId) {
        visitTeacherId = VisitTeacherId;
    }

    useEffect(() => {
        const navigate = localStorage.getItem("Navigate");
        if (navigate) {
            Navigate(navigate);
        } else {
            Navigate("/");
        }
    }, []);

    const onLogInHandler = (status: string, session: string, ID: string) => {
        isLogin = true;
        isStudentSession = session === "Student";
        id = ID;
        if (status === "Just registered") {
            justRegistered = true;
            Navigate("/personal");

            localStorage.setItem("justRegistered", "true");
            localStorage.setItem("Navigate", "/personal");
        } else {
            justRegistered = false;
            Navigate("/courseSelection");

            localStorage.setItem("justRegistered", "false");
            localStorage.setItem("Navigate", "/courseSelection");
        }
        // Save login session in localStorage
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("isStudentSession", session === "Student" ? "true" : "false");
        localStorage.setItem("id", ID);
    };

    const onUserFilledInfoHandler = () => {
        justRegistered = false;
        Navigate("/courseSelection");

        localStorage.setItem("justRegistered", "false");
        localStorage.setItem("Navigate", "/courseSelection");
    };

    const onLogoutHandler = () => {
        isLogin = false;
        isStudentSession = false;
        justRegistered = false;
        id = "";
        selectedCourseId = "";
        selectedVideoId = "";
        selectedHomeworkId = "";
        tryToAddHomework = false;
        tryToAddCourse = false;
        isUserCourse = true;
        visitTeacherId = "";
        Navigate("/");
        // Clear login session from localStorage
        localStorage.setItem("isLogin", "false");
        localStorage.setItem("isStudentSession", "false");
        localStorage.setItem("id", "");
        localStorage.setItem("selectedCourseId", "");
        localStorage.setItem("selectedVideoId", "");
        localStorage.setItem("selectedHomeworkId", "");
        localStorage.setItem("tryToAddHomework", "false");
        localStorage.setItem("tryToAddCourse", "false");
        localStorage.setItem("isUserCourse", "false");
        localStorage.setItem("visitTeacherId", "");
        localStorage.setItem("Navigate", "/");
    };

    const onNewCourseAddedHandler = async (courseId: string) => {
        selectedCourseId = courseId;
        isUserCourse = true;
        tryToAddCourse = false;
        Navigate("/course");

        localStorage.setItem("selectedCourseId", courseId);
        localStorage.setItem("isUserCourse", "true");
        localStorage.setItem("tryToAddCourse", "false");
        localStorage.setItem("Navigate", "/course");
    };

    const onPlayVideoHandler = (videoId: string) => {
        selectedVideoId = videoId;
        Navigate("/video");

        localStorage.setItem("selectedVideoId", videoId);
        localStorage.setItem("Navigate", "/video");
    };

    const onEditHomeworkHandler = (homeworkId: string) => {
        tryToAddHomework = false;
        selectedHomeworkId = homeworkId;
        Navigate("/homework");

        localStorage.setItem("selectedHomeworkId", homeworkId);
        localStorage.setItem("tryToAddHomework", "false");
        localStorage.setItem("Navigate", "/homework");
    };

    const onAddHomeworkHandler = () => {
        tryToAddHomework = true;
        selectedHomeworkId = "";
        Navigate("/homework");

        localStorage.setItem("selectedHomeworkId", "");
        localStorage.setItem("tryToAddHomework", "true");
        localStorage.setItem("Navigate", "/homework");
    };

    const onHomeworkAddedHandler = (homeworkId: string) => {
        selectedHomeworkId = homeworkId;
        tryToAddHomework = false;
        Navigate("/homework");

        localStorage.setItem("selectedHomeworkId", homeworkId);
        localStorage.setItem("tryToAddHomework", "false");
        localStorage.setItem("Navigate", "/homework");
    };

    const onHomeworkHandler = (homeworkId: string) => {
        selectedHomeworkId = homeworkId;
        tryToAddHomework = false;
        Navigate("/homework");

        localStorage.setItem("selectedHomeworkId", homeworkId);
        localStorage.setItem("tryToAddHomework", "false");
        localStorage.setItem("Navigate", "/homework");
    };

    const onCourseAddedHandler = () => {
        selectedCourseId = "";
        isUserCourse = true;
        tryToAddCourse = true;
        Navigate("/course");

        localStorage.setItem("selectedCourseId", "");
        localStorage.setItem("isUserCourse", "true");
        localStorage.setItem("tryToAddCourse", "true");
        localStorage.setItem("Navigate", "/course");
    };

    const checkOnUserCourse = async (courseId: string) => {
        const res = await axios.post("http://localhost:3001/checkOnUserCourse", {
            isStudentSession: isStudentSession,
            courseId: courseId,
            userId: id,
        });
        isUserCourse = res.data === 1;

        localStorage.setItem("isUserCourse", res.data === 1 ? "true" : "false");
    };

    const onCourseSelected = async (courseId: string) => {
        selectedCourseId = courseId;
        await checkOnUserCourse(courseId);
        Navigate("/course");

        localStorage.setItem("selectedCourseId", courseId);
        localStorage.setItem("Navigate", "/course");
    };

    const onTeacherClickHandler = (teacherId: string) => {
        visitTeacherId = teacherId;
        Navigate("/personalForVistor");

        localStorage.setItem("visitTeacherId", teacherId);
        localStorage.setItem("Navigate", "/personalForVistor");
    };

    return (
        <>
            <Routes>
                <Route path="/" element={<AdminDashboard onLogIn={onLogInHandler} />} />
                <Route path="/personal" element={<Personal id={id} isStudentSession={isStudentSession} justRegistered={justRegistered} onUserFilledInfo={onUserFilledInfoHandler} />} />
                <Route path="/courseSelection" element={<CourseSelection id={id} isStudentSession={isStudentSession} onCourseAdded={onCourseAddedHandler} onCourseSelected={onCourseSelected} />} />
                {isStudentSession && <Route path="/grades" element={<Grades id={id} />} />}
                <Route path="/course" element={isStudentSession || !isUserCourse ? <Course courseId={selectedCourseId} studentId={id} onTeacherClick={onTeacherClickHandler} /> : <CourseTeacher courseId={selectedCourseId} teacherId={id} tryToAddNewCourse={tryToAddCourse} onNewCourseAdded={onNewCourseAddedHandler} />}>
                    <Route path="courseware" element={isStudentSession || !isUserCourse ? <Courseware courseId={selectedCourseId} /> : <CoursewareTeacher courseId={selectedCourseId} />} />
                    <Route path="homeworks" element={isStudentSession || !isUserCourse ? <CourseHomework courseId={selectedCourseId} onClick={onHomeworkHandler} /> : <CourseHomeworkTeacher courseId={selectedCourseId} onEdit={onEditHomeworkHandler} onAdd={onAddHomeworkHandler} />} />
                    <Route path="videos" element={isStudentSession || !isUserCourse ? <CourseVideo courseId={selectedCourseId} onPlayVideo={onPlayVideoHandler} /> : <CourseVideoTeacher courseId={selectedCourseId} onPlayVideo={onPlayVideoHandler} />} />
                    {!(isStudentSession || !isUserCourse) && <Route path="students" element={<CourseStudents courseId={selectedCourseId} />} />}
                </Route>
                <Route path="/homework" element={isStudentSession || !isUserCourse ? <Homework studentId={id} courseId={selectedCourseId} homeworkId={selectedHomeworkId} isUserHomework={isUserCourse} /> : <HomeworkTeacher courseId={selectedCourseId} tryToAddHomework={tryToAddHomework} homeworkId={selectedHomeworkId} onAddHomework={onHomeworkAddedHandler} />} />
                <Route path="/video" element={<CourseVideoPlay id={selectedVideoId} courseId={selectedCourseId} />} />
                <Route path="/personalForVistor" element={<TeacherPersonalForStudent id={visitTeacherId} />} />
            </Routes>
            {!justRegistered && isLogin && <Navbar isStudentSession={isStudentSession} onLogout={onLogoutHandler} />}
        </>
    );
}

export default App;
