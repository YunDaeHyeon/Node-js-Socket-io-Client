import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login(){
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('');

    const handleChangeNickname = (e) => {
        setNickname(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/home', {state:{ nickname }})
        setNickname('');
    };

    return(
        <div className='d-flex flex-column justify-content-center align-items-center vh-100'>
        <form className="d-flex">
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