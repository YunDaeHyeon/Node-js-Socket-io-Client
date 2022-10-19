import { useCallback, useContext, useEffect, useState } from "react";
import { SocketContext, makeUserList, SOCKET_EVENT } from "../service/socket";

function UserListForm({nickname}){
    const [userList, setUserList] = useState([]);
    const socket = useContext(SocketContext);

    // JOIN_ROOM 이벤트 콜백
    const handleJoinEvent = useCallback(pongData => {
        const newUser = makeUserList(pongData);
        setUserList(userList => [...userList, newUser]);
    }, []);

    useEffect(()=>{ // 서버로부터 전달되는 이벤트
        socket.on(SOCKET_EVENT.RECEIVE_MESSAGE, handleJoinEvent); // 이벤트 리스너 설치
        return () => {
            socket.off(SOCKET_EVENT.RECEIVE_MESSAGE, handleJoinEvent); // 이벤트 리스너 해제
        }
    }, [socket, handleJoinEvent]);

    return(
        <div className="d-flex flex-column">
            <div className="user-list-window card">
                <span style={{marginLeft: 10, marginBottom: 10}}>👥 현재 접속중인 사용자</span>
                {
                    userList.map((list, index) => {
                        const {nickname} = list;
                        return(
                            <p key={index} style={{marginBottom:5}}>{nickname}</p>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default UserListForm;