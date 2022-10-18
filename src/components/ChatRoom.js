/*
    채팅 메시지 리스트 컴포넌트 - RECEIVE_MESSAGE 이벤트와 함께 받은 데이터를 저장하여, 화면 내 채팅창에 뿌리기
    즉, 받은 메시지들 렌더링
*/

import { useState, useCallback, useContext, useEffect, useRef } from "react";
import { SocketContext, SOCKET_EVENT, makeMessage } from "../service/socket";
import MessageForm from "./MessageForm";

function ChatRoom({nickname}){
    // message = { nickname, content, time }
    const [messages, setMessages] = useState([]);
    const chatWindow = useRef(null);
    const socket = useContext(SocketContext); // useContext를 통한 socket 객체 불러오기

    // 새 메시지 받으면 스크롤 이동 - uesRef를 이용하여 새 메시지를 받을 때 마다 스크롤 이동
    const moveScrollToReceiveMessage = useCallback(()=> {
        if(chatWindow.current){
            chatWindow.current.scrollTo({
                top: chatWindow.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, []);

    //  RECEIVE_MESSAGE 이벤트 콜백 - messages state에 데이터 추가
    const handleReceiveMessage = useCallback(pongData => {
        const newMessage = makeMessage(pongData); // 서버가 던져준 데이터를 가공시켜 화면에 뿌리기
        setMessages(messages => [...messages, newMessage]);
        moveScrollToReceiveMessage();
    }, [moveScrollToReceiveMessage]);

    // ChatRoom 컴포넌트가 마운트 되면 RECEIVE_MESSAGE 이벤트 설치, 해제되면 RECEIVE_MESSAGE 이벤트 해제
    useEffect(()=>{
        socket.on(SOCKET_EVENT.RECEIVE_MESSAGE, handleReceiveMessage); // 이벤트 리스너 설치
        return () => {
            socket.off(SOCKET_EVENT.RECEIVE_MESSAGE, handleReceiveMessage); // 이벤트 리스너 해제
        }
    }, [socket, handleReceiveMessage]);

    return (
        <div className="d-flex flex-column" style={{width: 720}}>
            <div className="text-box">
                <span>{nickname}</span>님 환영합니다!
            </div>
            <div className="chat-window card" ref={chatWindow}>
                {
                    messages.map((message, index) => {
                        const { content, time } = message;
                        const chatNickname = message.nickname;
                        // message 배열을 map으로 돌려 각 원소마다 item 렌더링 justify-content-end
                        return (
                            <div key={index}>
                                {   // nickname과 chatNickname이 같으면 자기 자신이 메시지를 보내는 것이므로 화면 오른쪽에 메시지 출력
                                    // nickname과 chatNickname이 다르면 상대방이 메시지를 보내는 것이므로 화면 왼쪽에 메시지 출력
                                    nickname === chatNickname ? ( 
                                        <div key={index} className="d-flex justify-content-end">
                                            <div className="time" style={{marginRight: 10}}> {time} </div>
                                            {
                                                chatNickname && <div className="message-nickname">{chatNickname} : </div>
                                            }
                                            <div> {content} </div>
                                        </div>
                                    ) : (
                                        <div key={index} className="d-flex flex-row">
                                            {
                                                chatNickname && <div className="message-nickname">{chatNickname} : </div>
                                            }
                                            <div>{content}</div>
                                            <div className="time">{time}</div>
                                        </div>
                                    )
                                }
                            </div>
                        );
                    })
                }
            </div>
            <MessageForm nickname={nickname}/>
        </div>
    );
}

export default ChatRoom;
