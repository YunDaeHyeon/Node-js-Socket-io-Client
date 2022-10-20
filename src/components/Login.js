import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../service/socket';

function Login(){
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('');

    const onCheckEnter = (e) => {
        if(e.key === "Enter"){
            handleSubmit(e);
        }
    }

    const handleChangeNickname = (e) => {
        setNickname(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const noContent = nickname.trim() === ""
        // 닉네임을 입력하지 않으면
        if(noContent){
            alert("🥲최소 1글자 이상 닉네임을 적어주세요");
            return;
        }

        navigate('/home', {state: { nickname }});
        socket.connect();
        setNickname('');
    };

    return(
        <div className='d-flex flex-column justify-content-center align-items-center vh-100'>
        <form className="d-flex" onKeyPress={onCheckEnter}>
            <div className="card d-flex flex-row align-items-center">
                <label htmlFor="user-name-input" className='user-name-input-label'>
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
                    onClick={handleSubmit}>접속</button>
            </div>
        </form>
            <div>
                <h5>현재 접속 가능한 채팅방 : room 1</h5>
                <h5>접속 가능한 채팅방 : 🚧 공사중</h5>
            </div>
        </div>
    );
}

export default Login;