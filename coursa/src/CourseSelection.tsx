import { MouseEventHandler, useEffect, useState } from "react";
import "./courseSelection.css";
import demo from "./assets/Unknown.jpeg";
import axios from "axios";

function CourseSelection(props: { id: string; isStudentSession: boolean; onCourseSelected: any; onCourseAdded: any }) {
    const [courseList, setCourseList] = useState([]);
    const [isSearchForCourse, setIsSearchForCourse] = useState(true);

    const [isAllCourse, setIsAllCourse] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedStates, setSelectedStates] = useState<string[]>([]);

    let searchFor = "";

    const getCourseList = (isSearched: boolean) => {
        axios
            .post("http://localhost:3001/getCourses", {
                id: props.id,
                searchEnable: isSearched,
                searchFor: searchFor,
                searchForCourse: isSearchForCourse,
                isStudentSession: props.isStudentSession,
                isAllCourse: isAllCourse,
                selectedCategories: selectedCategories,
                selectedStates: selectedStates,
            })
            .then((response) => {
                console.log(response.data);
                setCourseList(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getCourseList(false);
    }, [isAllCourse, selectedCategories, selectedStates]);

    useEffect(() => {
        getCourseList(false);
    }, []);

    const onFilterChangedHandler = (isAllCourse: boolean, selectedCategories: string[], selectedStates: string[]) => {
        setIsAllCourse(isAllCourse);
        setSelectedCategories(selectedCategories);
        setSelectedStates(selectedStates);
    };

    return (
        <div className="course-selection-container">
            <div className="course-selection-search-container">
                <div className="course-selection-search-option" onClick={() => setIsSearchForCourse(!isSearchForCourse)}>
                    <label> {isSearchForCourse ? "Course" : "Teacher"} </label>
                </div>
                <div className="course-selection-search-input-container">
                    <input
                        className="course-selection-search-bar"
                        type="text"
                        placeholder={isSearchForCourse ? "Search course" : "Search teacher"}
                        onChange={(e) => {
                            searchFor = e.target.value;
                        }}
                    />
                    <div
                        className="course-selection-search-button"
                        onClick={() => {
                            getCourseList(true);
                        }}
                    >
                        <SearchLogo />
                    </div>
                </div>
            </div>
            <Filter onFilterChanged={onFilterChangedHandler} />
            {!props.isStudentSession && (
                <div className="course-selection-add-course-button" onClick={props.onCourseAdded}>
                    <label>Add Course</label>
                </div>
            )}
            <div className="course-selection-filter-divider"></div>

            {courseList.map((course: { id: string; title: string; teacher_name: string; description: string; category: string; registration_start_date: string; registration_end_date: string; start_date: string; end_date: string; capacity: number; sign_students: number; thumbnail_name: string; selected_by_student: number }) => (
                <CourseSeclectionItem
                    isStudentSession={props.isStudentSession}
                    userId={props.id}
                    courseId={course.id}
                    title={course.title}
                    teacher_name={course.teacher_name}
                    description={course.description}
                    category={course.category}
                    registration_start_date={course.registration_start_date}
                    registration_end_date={course.registration_end_date}
                    start_date={course.start_date}
                    end_date={course.end_date}
                    capacity={course.capacity}
                    sign_students={course.sign_students}
                    thumbnail_name={course.thumbnail_name}
                    selected_by_student={course.selected_by_student === 1}
                    onClick={() => {
                        props.onCourseSelected(course.id);
                    }}
                    onRegister={() => {
                        getCourseList(false);
                    }}
                />
            ))}
        </div>
    );
}

function CourseSeclectionItem(props: { isStudentSession: boolean; userId: string; courseId: string; title: string; teacher_name: string; description: string; category: string; registration_start_date: string; registration_end_date: string; start_date: string; end_date: string; capacity: number; sign_students: number; thumbnail_name: string; selected_by_student: boolean; onClick: any; onRegister: any }) {
    const [isHover, setIsHover] = useState(false);
    const [registerButtonClass, setRegisterButtonClass] = useState("");
    const [buttonName, setButtonName] = useState("");

    const thumbnailUrl = "http://localhost:3001/getCourseInfoThumbnail/" + props.thumbnail_name;

    const currentDate = new Date(new Date().toLocaleDateString());
    const registrationEndDate = new Date(new Date(props.registration_end_date).toLocaleDateString());
    const registrationStartDate = new Date(new Date(props.registration_start_date).toLocaleDateString());
    const cancelAble = currentDate <= registrationEndDate;
    const registerAble = currentDate >= registrationStartDate && currentDate <= registrationEndDate && props.sign_students < props.capacity;
    const registerCourse = () => {
        axios
            .post("http://localhost:3001/registerCourse", {
                studentId: props.userId,
                courseId: props.courseId,
            })
            .then((response) => {
                props.onRegister();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const cancelCourse = () => {
        axios
            .post("http://localhost:3001/cancelCourse", {
                studentId: props.userId,
                courseId: props.courseId,
            })
            .then((response) => {
                props.onRegister();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const onClikckHandler = () => {
        if (props.selected_by_student) {
            if (cancelAble) {
                cancelCourse();
            }
        } else {
            if (registerAble) {
                registerCourse();
            }
        }
    };

    useEffect(() => {
        if (props.selected_by_student) {
            setRegisterButtonClass("course-selection-course-register-button course-selection-registered");
            setButtonName("Registered");
        } else {
            if (registerAble) {
                setRegisterButtonClass("course-selection-course-register-button course-selection-register");
                setButtonName("Register");
            } else {
                setRegisterButtonClass("");
                setButtonName("");
            }
        }
    }, [props]);

    useEffect(() => {
        if (props.selected_by_student) {
            if (isHover && cancelAble) {
                setRegisterButtonClass("course-selection-course-register-button course-selection-cancel");
                setButtonName("Cancel");
            } else {
                setRegisterButtonClass("course-selection-course-register-button course-selection-registered");
                setButtonName("Registered");
            }
        } else {
            if (registerAble) {
                setRegisterButtonClass("course-selection-course-register-button course-selection-register");
                setButtonName("Register");
            } else {
                setRegisterButtonClass("");
                setButtonName("");
            }
        }
    }, [isHover]);

    return (
        <div className="course-selection-course-container">
            <img className="course-selection-course-image" src={thumbnailUrl} onClick={props.onClick} />
            <div className="course-selection-course-info">
                <div className="course-selection-course-title">{props.title}</div>
                <div className="course-selection-course-teacher">{props.teacher_name}</div>
                <div className="course-selection-course-description">
                    <span>{props.description}</span>
                </div>
                <div className="course-selection-course-category">{props.category}</div>
                <div className="course-selection-course-bottom">
                    <div className="course-selection-course-date">
                        <div>{"RD :  " + props.registration_start_date + " ~ " + props.registration_end_date}</div>
                        <div>{"CD :  " + props.start_date + " ~ " + props.end_date}</div>
                        <div>{props.sign_students + "/" + props.capacity}</div>
                    </div>
                    {props.isStudentSession && (
                        <div
                            className={registerButtonClass}
                            onMouseEnter={() => {
                                setIsHover(true);
                            }}
                            onMouseLeave={() => {
                                setIsHover(false);
                            }}
                            onClick={onClikckHandler}
                        >
                            <span>{buttonName}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="course-selection-item-divider"></div>
        </div>
    );
}

function Filter(props: { onFilterChanged: any }) {
    const [categories, setCategories] = useState<string[]>([]);
    const [isAllCourse, setIsAllCourse] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedStates, setSelectedStates] = useState<string[]>([]);

    const getCourseCategories = () => {
        axios
            .get("http://localhost:3001/getCourseCategories")
            .then((response) => {
                const distinctCategories: string[] = [...new Set((response.data as { category: string }[]).map((item) => item.category))];
                setCategories(distinctCategories);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getCourseCategories();
    }, []);

    useEffect(() => {
        props.onFilterChanged(isAllCourse, selectedCategories, selectedStates);
    }, [isAllCourse, selectedCategories, selectedStates]);

    return (
        <div className="course-selection-filter">
            <FilterOption labal="Courses">
                <div className="course-selection-radio-container">
                    <input id="all-course" type="radio" name="radio" checked={isAllCourse} onClick={() => setIsAllCourse(true)} />
                    <label className="course-selection-radio-labal-container course-selection-left-radio" htmlFor="all-course">
                        All courses
                    </label>
                    <input id="my-course" type="radio" name="radio" onClick={() => setIsAllCourse(false)} />
                    <label className="course-selection-radio-labal-container course-selection-right-radio" htmlFor="my-course">
                        My courses
                    </label>
                </div>
            </FilterOption>

            <FilterOption labal="Categories">
                <MultiSelection
                    options={categories}
                    setSelections={(selections) => {
                        setSelectedCategories(selections);
                    }}
                />
            </FilterOption>

            <FilterOption labal="Course states">
                <MultiSelection
                    options={["closed", "opening", "full", "not full"]}
                    setSelections={(selections) => {
                        setSelectedStates(selections);
                    }}
                />
            </FilterOption>
        </div>
    );
}

function FilterOption(props: { labal: string; children: any }) {
    return (
        <div className="course-selection-filter-container">
            <div className="course-selection-filter-label-container">
                <label className="course-selection-filter-label">{props.labal}</label>
            </div>
            {props.children}
        </div>
    );
}

function MultiSelection(props: { options: string[]; setSelections: (setOptions: string[]) => void }) {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const handleCheckboxChange = (option: string) => {
        if (selectedCategories.includes(option)) {
            setSelectedCategories(selectedCategories.filter((category) => category !== option));
        } else {
            setSelectedCategories([...selectedCategories, option]);
        }
    };

    useEffect(() => {
        props.setSelections(selectedCategories);
    }, [selectedCategories]);

    return (
        <div className="course-selection-categories-container">
            {props.options.map((option) => (
                <div key={option}>
                    <input className="course-selection-category-checkbox" type="checkbox" id={option} onChange={() => handleCheckboxChange(option)} checked={selectedCategories.includes(option)} />
                    <label className="course-selection-category" htmlFor={option}>
                        {option}
                    </label>
                </div>
            ))}
        </div>
    );
}

const SearchLogo = () => {
    return (
        <svg className="course-selection-search-logo" width="512" height="512" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </svg>
    );
};

export default CourseSelection;
