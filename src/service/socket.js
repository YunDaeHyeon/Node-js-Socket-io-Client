import dayjs from "dayjs";
import { createContext } from "react";
import socketIo from 'socket.io-client';
// https://daehyeon-chat-server.herokuapp.com
export const socket = socketIo.connect("https://daehyeon-chat-server.herokuapp.com");
export const SocketContext = createContext(socket);
export const SOCKET_EVENT = {
    JOIN_ROOM : "JOIN_ROOM", // 사용자가 방에 들어왔을 때
    UPDATE_NICKNAME : "UPDATE_NICKNAME", // 사용자가 닉네임을 변경했을 때
    SEND_MESSAGE : "SEND_MESSAGE", // 사용자가 메시지를 보낼 때
    ROOM_EXIT : "ROOM_EXIT",
    RECEIVE_MESSAGE : "RECEIVE_MESSAGE", // 서버에서 메시지가 도착했을 때
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
            contentLabel = String(content);
            nicknameLabel = nickname;
            break;
        }
        case SOCKET_EVENT.ROOM_EXIT: {
            contentLabel = `${nickname}님이 접속을 종료하였습니다.`;
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
    console.log(pongData);
    const { joinUserList, type } = pongData;
    if(type === SOCKET_EVENT.JOIN_ROOM || type === SOCKET_EVENT.UPDATE_NICKNAME || type === SOCKET_EVENT.ROOM_EXIT){
        return joinUserList; // 현재 접속중인 모든 사용자 (Array) 반환
    };
};

socket.on("connect", ()=>{
    console.log("Socket Server Connected");
});

socket.on("disconnect", ()=>{
    console.log("Socket Server Disconnected");
});