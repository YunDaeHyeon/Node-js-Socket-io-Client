/*
    메시지 폼 컴포넌트
    SEND_MESSAGE 처리 - 유저가 메시지를 전송할 때
*/

import { useContext, useState, useRef } from "react";
import { SocketContext, SOCKET_EVENT } from "../service/socket";

function MessageForm({nickname}){
    const [typingMessage, setTypingMessage] = useState("");
    const socket = useContext(SocketContext);
    const messageInput = useRef();

    const handleChangeTypingMessage = (e) => {
        setTypingMessage(e.target.value);
    };

    const onCheckEnter = (e) => {
        if(e.key === "Enter"){
            e.preventDefault();
            // 만약, shiftKey를 누른게 아니라면 (Enter만)
            if(!e.shiftKey){ // textarea에서 shiftKey + Enter는 개행, 일반 Enter는 Submit
                // 공백 제거
                const noContent = typingMessage.trim() === "";
                    
                // 아무런 메시지가 없다면 아무런 일 X
                if(noContent){
                    return;
                }
            
                // 메시지가 있다면 nickname과 message를 SEND_MESSAGE 타입과 함께 서버 전송
                socket.emit(SOCKET_EVENT.SEND_MESSAGE, {
                    nickname,
                    content : typingMessage,
                });
                // state 값은 공백으로 변경
                setTypingMessage("");
            }
            messageInput.current.focus();
        }
    };

    // 버튼 클릭 이벤트
    const handleSendMessage = (e) => {
        e.preventDefault();
        // 공백 제거
        const noContent = typingMessage.trim() === "";

        // 아무런 메시지가 없다면 아무런 일 X
        if(noContent){
            return;
        }

        // 메시지가 있다면 nickname과 message를 SEND_MESSAGE 타입과 함께 서버 전송
        socket.emit(SOCKET_EVENT.SEND_MESSAGE, {
            nickname,
            content : typingMessage,
        });
        // state 값은 공백으로 변경
        setTypingMessage("");
    }

    return(
        <form className="card message-form" onKeyPress={onCheckEnter}>
            <div className="d-flex align-items-center">
                <textarea
                    className="form-control"
                    maxLength={400}
                    autoFocus
                    value={typingMessage}
                    onChange={handleChangeTypingMessage}
                    ref={messageInput}/>
                <button
                    type="button"
                    className="btn btn-primary send-btn"
                    onClick={handleSendMessage}>전송</button>
            </div>
        </form>
    );
}

export default MessageForm;