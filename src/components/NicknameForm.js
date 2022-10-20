import { useState } from "react";

/*
    1. input에서 값을 타이핑하다가 NicknameForm 컴포넌트가 해당 값을 state로 관리
    2. Submit을 할 때 input 값을 App 컴포넌트에 전달시켜 App 컴포넌트에 선언된 nickname state 변경
*/

function NicknameForm({ handleSubmitNickname }){
    const [nickname, setNickname] = useState('');

    const onCheckEnter = (e) => {
        if(e.key === "Enter"){
            handleSubmit(e);
        }
    };

    const handleChangeNickname = (e) => {
        setNickname(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSubmitNickname(nickname);
        setNickname('');
    };

    return(
        <form className="d-flex nickname-form" onKeyPress={onCheckEnter}>
            <div className="card d-flex flex-row align-items-center">
                <label htmlFor="user-name-input" style={{width: 60}}>
                    닉네임
                </label>
                <input
                    type="text"
                    className="form-control w300"
                    id="user-name-input"
                    maxLength={12}
                    value={nickname}
                    onChange={handleChangeNickname}/>
                <button
                    type="button"
                    className="btn btn-primary send-btn"
                    value="확인"
                    onClick={handleSubmit}>변경</button>
            </div>
        </form>
    );
}

export default NicknameForm;