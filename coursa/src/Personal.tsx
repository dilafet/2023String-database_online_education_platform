import { useEffect, useState } from "react";
import axios from "axios";
import "./personal.css";

function Personal(props: { id: string; isStudentSession: boolean; justRegistered: boolean; onUserFilledInfo: any }) {
    const [isEditing, setIsEditing] = useState(true);
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isValidName, setIsValidName] = useState(true);
    const [isValidGender, setIsValidGender] = useState(true);
    const [isValidAge, setIsValidAge] = useState(true);
    const [isValidPassword, setIsValidPassword] = useState(true);
    const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(false);

    const NAME_REGEX = /^[a-zA-Z\s]+$/;
    const GENDER_REGEX = /^(male|female)$/i;
    const AGE_REGEX = /^[1-9][0-9]?$/;
    const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{8,16}$/;

    const getPersonal = async () => {
        const req = props.isStudentSession ? "http://localhost:3001/studentPersonalInfo" : "http://localhost:3001/teacherPersonalInfo";
        try {
            const res = await axios.post(req, {
                id: props.id,
            });

            setId(res.data[0].id);
            setName(res.data[0].name);
            setEmail(res.data[0].email);
            setGender(res.data[0].gender);
            setAge(res.data[0].age);
            setPassword(res.data[0].password);
        } catch (err) {
            console.log(err);
        }
    };

    const updatePersonal = async () => {
        const req = props.isStudentSession ? "http://localhost:3001/updateStudentPersonalInfo" : "http://localhost:3001/updateTeacherPersonalInfo";
        try {
            const res = await axios.post(req, {
                id: id,
                name: name,
                gender: gender,
                age: age,
                password: password,
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getPersonal();
        setIsEditing(props.justRegistered);
    }, []);

    return (
        <div className="personal-container">
            <InputBox prompt="ID" disabled={true} shaded={isEditing} type="text" defaultValue={id} onChange={() => {}} />
            <InputBox
                prompt="Name"
                disabled={!isEditing}
                shaded={false}
                type="text"
                defaultValue={name}
                onChange={(e: string) => {
                    setIsValidName(NAME_REGEX.test(e.trim()));
                    setName(e.trim());
                }}
            />
            <InputBox prompt="Email" disabled={true} shaded={isEditing} type="text" defaultValue={email} onChange={() => {}} />
            <InputBox
                prompt="Gender"
                disabled={!isEditing || !isValidName}
                shaded={false || !isValidName}
                type="text"
                defaultValue={gender}
                onChange={(e: string) => {
                    setIsValidGender(GENDER_REGEX.test(e.trim()));
                    setGender(e.trim());
                }}
            />
            <InputBox
                prompt="Age"
                disabled={!isEditing || !isValidName || !isValidGender}
                shaded={false || !isValidName || !isValidGender}
                type="text"
                defaultValue={age}
                onChange={(e: string) => {
                    setIsValidAge(AGE_REGEX.test(e.trim()));
                    setAge(e);
                }}
            />
            <InputBox
                prompt="Password"
                disabled={!isEditing || !isValidName || !isValidGender || !isValidAge}
                shaded={false || !isValidName || !isValidGender || !isValidAge}
                type="password"
                defaultValue={password}
                onChange={(e: string) => {
                    setIsValidPassword(PASSWORD_REGEX.test(e));
                    setPassword(e);
                }}
            />
            {isEditing && (
                <InputBox
                    prompt="Confirm Password"
                    disabled={!isEditing || !isValidName || !isValidGender || !isValidAge || !isValidPassword}
                    shaded={false || !isValidName || !isValidGender || !isValidAge || !isValidPassword}
                    type="password"
                    defaultValue={confirmPassword}
                    onChange={(e: string) => {
                        setIsValidConfirmPassword(e === password);
                        setConfirmPassword(e);
                    }}
                />
            )}
            <div
                className={!isEditing || (isValidName && isValidGender && isValidAge && isValidPassword && isValidConfirmPassword) ? "personal-button" : "personal-button personal-disable-button"}
                onClick={() => {
                    if (isEditing) {
                        if (isValidName && isValidGender && isValidAge && isValidPassword && isValidConfirmPassword) {
                            updatePersonal();
                            if (props.justRegistered) {
                                props.onUserFilledInfo();
                            }
                            setIsEditing(false);
                        }
                    } else {
                        setIsEditing(true);
                    }
                }}
            >
                {isEditing ? "Submit" : "Edit"}
            </div>
        </div>
    );
}

function TeacherPersonalForStudent(props: { id: string }) {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");

    const getPersonal = async () => {
        try {
            const res = await axios.post("http://localhost:3001/teacherPersonalInfoForVisitor", {
                id: props.id,
            });
            setId(res.data[0].id);
            setName(res.data[0].name);
            setEmail(res.data[0].email);
            setGender(res.data[0].gender);
            setAge(res.data[0].age);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getPersonal();
    }, []);

    return (
        <div className="personal-container">
            <InputBox prompt="ID" disabled={true} type="text" defaultValue={id} shaded={false} onChange={(e: any) => {}} />
            <InputBox prompt="Name" disabled={true} type="text" defaultValue={name} shaded={false} onChange={(e: any) => {}} />
            <InputBox prompt="Email" disabled={true} type="text" defaultValue={email} shaded={false} onChange={(e: any) => {}} />
            <InputBox prompt="Gender" disabled={true} type="text" defaultValue={gender} shaded={false} onChange={(e: any) => {}} />
            <InputBox prompt="Age" disabled={true} type="text" defaultValue={age} shaded={false} onChange={(e: any) => {}} />
        </div>
    );
}

function InputBox(props: { type: string; disabled: boolean; shaded: boolean; onChange: any; prompt: string; defaultValue: string }) {
    const [isEmpty, setIsEmpty] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    const [className, setClassName] = useState("personal-input-box-span personal-input-box-active");

    useEffect(() => {
        if (!isEmpty || isFocused || props.defaultValue !== "") {
            setClassName("personal-input-box-span personal-input-box-active");
        } else {
            setClassName("personal-input-box-span");
        }
    }, [isEmpty, isFocused, props.defaultValue]);

    return (
        <div className="personal-input-box">
            <input
                className={props.shaded ? "shaded" : ""}
                type={props.type}
                onChange={(e) => {
                    props.onChange(e.target.value);
                    setIsEmpty(e.target.value === "");
                }}
                disabled={props.disabled}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                defaultValue={props.defaultValue}
            />
            <span className={props.shaded ? className + " shaded" : className}>
                <p>{props.prompt}</p>
            </span>
        </div>
    );
}

export { Personal, TeacherPersonalForStudent };
