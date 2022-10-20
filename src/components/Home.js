import { useEffect, useState, useRef, useCallback } from 'react';
import ChatRoom from './ChatRoom';
import NicknameForm from './NicknameForm';
import { socket, SocketContext, SOCKET_EVENT } from '../service/socket';
import { useLocation, useNavigate } from 'react-router-dom';
import UserListForm from './UserListForm';

/*
    Event List
    "JOIN_ROOM" : 유저가 방에 참가했을 때
    "UPDATE_NICKNAME" : 유저가 닉네임을 변경했을 때
    "SEND_MESSAGE" : 유저가 메시지를 전송했을 때
    "RECEIVE_MESSAGE" : 유저가 메시지를 받을 때

    Socket.io Tip!
    emit - 서버 <-> 클라이언트 데이터 !! 보내기 !!
    on - 서버 <-> 클라이언트 데이터 !! 받기 !!
*/

// 예, 아니요 판별 다이얼로그 (confirm)
const useConfirm = (message = "", onConfirm, onCancel) => {
    if (!onConfirm || typeof onConfirm !== "function") { 
        return; // 매개변수 onConfirm가 없거나 onConfirm이 함수가 아나라면 return 실행
    }
    if (!onCancel || typeof onCancel !== "function") { // onCancle은 필수요소는 아님
        return;
    }

    const confirmAction = () =>{
        if(window.confirm(message)){
            onConfirm();
        }else{
            onCancel();
        }
    }
    return confirmAction;
};

function Home() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const prevNickname = useRef(null); // prevNickname의 변경은 컴포넌트를 rerender하지 않는다.
    const [nickname, setNickname] = useState(state.nickname);

    const handleSubmitNickname = useCallback(newNickname => {
        prevNickname.current = nickname; // 기존 닉네임을 prevNickname으로 이동
        setNickname(newNickname); // 새로운 닉네임을 nickname state에 적용
    }, [nickname]);


    const handleServerExitSuccess = () => {
        socket.emit("ROOM_EXIT", {nickname}); // 접속 종료 이벤트와 닉네임 서버로 전송
        navigate('/login');
    }
    const handleServerExitCancle = () => {
        console.log("취소되었습니다.");
    }
    const handleServerExit = useConfirm(
        "🙋연결을 종료할까요?",
        handleServerExitSuccess,
        handleServerExitCancle
    )

    useEffect(() => {
    // 닉네임이 변경될 때
        if(prevNickname.current){
          socket.emit(SOCKET_EVENT.UPDATE_NICKNAME, { // 이전 닉네임과 변경된 닉네임 전송
            prevNickname: prevNickname.current, // 이전 닉네임
            nickname, // 변경된 닉네임
            });
        } else {
          // JOIN 이벤트 타입과 닉네임을 서버에 전송 (로그인 기능이 없기에 App 컴포넌트가 마운트될 때 JOIN_ROOM emit)
            socket.emit(SOCKET_EVENT.JOIN_ROOM, {nickname});
        }
    }, [nickname]);
    /*
    App Component를 SocketContext.provider로 묶는다.
    */
    return (
    <SocketContext.Provider value={socket}>
        <div className='d-flex justify-content-center'>
            <div className='d-flex flex-column justify-content-center align-items-center vh-100'>
                <div>
                    <h4>🥳현재 채팅방은 room 1 입니다.</h4>
                </div>
                <NicknameForm handleSubmitNickname={handleSubmitNickname}/>
                <ChatRoom nickname={nickname}/>
            </div>
            <div className='d-flex flex-column justify-content-center align-items-center vh-100'>
                <UserListForm/>
                <button
                    type="button"
                    style={{marginTop:20}}
                    className="btn btn-primary send-btn"
                    onClick={handleServerExit}
                    >나가기</button>
            </div>
        </div>
    </SocketContext.Provider>
    );
}

export default Home;
