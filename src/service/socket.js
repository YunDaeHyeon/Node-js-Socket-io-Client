import dayjs from "dayjs";
import { createContext } from "react";
import socketIo from 'socket.io-client';

export const socket = socketIo.connect("https://daehyeon-chat-server.herokuapp.com");
export const SocketContext = createContext(socket);
export const SOCKET_EVENT = {
    JOIN_ROOM : "JOIN_ROOM",
    UPDATE_NICKNAME : "UPDATE_NICKNAME",
    SEND_MESSAGE : "SEND_MESSAGE",
    RECEIVE_MESSAGE : "RECEIVE_MESSAGE",
};

// 서버가 보낸 데이터를 가공하는 함수

// makeMessage : 채팅 요청, 응답 처리
export const makeMessage = (pongData) => {
    const { prevNickname, nickname, content, type, time } = pongData;

    let nicknameLabel;
    let contentLabel = "";

    switch(type){
        case SOCKET_EVENT.JOIN_ROOM: {
            contentLabel = `${nickname}님이 참여하였습니다.`;
            break;
        }
        case SOCKET_EVENT.UPDATE_NICKNAME: {
            contentLabel = `${prevNickname}님이 ${nickname}으로 이름을 변경하였습니다.`;
            break;
        }
        case SOCKET_EVENT.SEND_MESSAGE: { // 메시지 보내기
            console.log("메시지를 받았습니다.");
            contentLabel = String(content);
            nicknameLabel = nickname;
            break;
        }
        default:
    }

    return {
        nickname : nicknameLabel,
        content: contentLabel,
        time: dayjs(time).format("HH:mm"),
    };
};

// makeUserList - Join 이벤트 처리
export const makeUserList = (pongData) => {
    const { nickname, type } = pongData;
    if(type === SOCKET_EVENT.JOIN_ROOM){
        return {
            nickname
        }
    };
};

socket.on("connect", ()=>{
    console.log("Socket Server Connected");
});

socket.on("disconnect", ()=>{
    console.log("Socket Server Disconnected");
});