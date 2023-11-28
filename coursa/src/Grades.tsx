import axios from "axios";
import "./Grades.css";
import { useEffect, useState } from "react";

function Grades(props: { id: string }) {
    const [grades, setGrades] = useState([]);

    const getGrades = () => {
        axios
            .post("http://localhost:3001/getGrades", {
                studentId: props.id,
            })
            .then((res) => {
                setGrades(res.data);
            });
    };

    useEffect(() => {
        getGrades();
    }, []);

    return (
        <div className="grades-container">
            <MyGrades id={props.id} />
            {grades.map((grade: { id: string; title: string; grade: string }) => (
                <CourseGrade key={grade.id} id={grade.id} title={grade.title} grade={grade.grade} studentId={props.id} />
            ))}
        </div>
    );
}

function CourseGrade(props: { id: string; title: string; grade: string; studentId: string }) {
    const [homeworks, setHomeworks] = useState([]);

    const getHomeworks = () => {
        axios
            .post("http://localhost:3001/getCourseStudentHomeworkGrades", {
                courseId: props.id,
                studentId: props.studentId,
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

    return (
        <div className="course-grade-container">
            <div className="course-grade-top">
                <div className="course-grade-title">{props.title}</div>
                <div className="course-grade-grade">{props.grade}</div>
            </div>
            {homeworks.map((homework: { title: string; grade: string }) => (
                <CourseGradeItem title={homework.title} grade={homework.grade} />
            ))}
        </div>
    );
}

function CourseGradeItem(props: { title: string; grade: string }) {
    return (
        <div className="course-grade-item">
            <div className="course-grade-item-title">{props.title}</div>
            <div className="course-grade-item-grade">{props.grade}</div>
        </div>
    );
}

function MyGrades(props: { id: string }) {
    const [average, setAverage] = useState(0);
    const [courses, setCourses] = useState(0);

    const getGrades = () => {
        axios
            .post("http://localhost:3001/getGradeAverage", {
                studentId: props.id,
            })
            .then((res) => {
                setCourses(res.data[0].course_count);
                setAverage(res.data[0].average_grade.toFixed(2));
            });
    };

    useEffect(() => {
        getGrades();
    }, []);

    return (
        <div className="my-grades-container">
            <div>average: {average}</div>
            <div>courses: {courses}</div>
        </div>
    );
}
export default Grades;
