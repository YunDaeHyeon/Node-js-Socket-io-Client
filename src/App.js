import { useEffect, useState, useRef, useCallback } from 'react';
import ChatRoom from './components/ChatRoom';
import NicknameForm from './components/NicknameForm';
import { socket, SocketContext, SOCKET_EVENT } from './service/socket';

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

function App() {
  const prevNickname = useRef(null); // prevNickname의 변경은 컴포넌트를 rerender하지 않는다.
  const [nickname, setNickname] = useState('윤대현');

  const handleSubmitNickname = useCallback(newNickname => {
      prevNickname.current = nickname;
      setNickname(newNickname);
    }, [nickname]
  );

  useEffect(()=>{
    return () => {
      socket.disconnect(); // App Component가 Unmount될 때 소켓 연결 끊기
    }
  }, []);

  useEffect(() => {
    // 닉네임이 변경될 때
    if(prevNickname.current){
      socket.emit(SOCKET_EVENT.UPDATE_NICKNAME, { // 이전 닉네임과 변경된 닉네임 전송
        prevNickname: prevNickname.current,
        nickname,
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
      <div className='d-flex flex-column justify-content-center align-items-center vh-100'>
        <NicknameForm handleSubmitNickname={handleSubmitNickname}/>
        <ChatRoom nickname={nickname}/>
      </div>
    </SocketContext.Provider>
  );
}

export default App;
