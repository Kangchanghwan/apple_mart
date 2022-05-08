import React, { useState } from "react";
import styled from "styled-components";
import profile from "../../../images/ico/ico_profile_placeholder.png";
import { Link } from "react-router-dom";
import { dbService } from "../../../utils/api/fbInstance";
import {
  query,
  collection,
  doc,
  where,
  getDocs,
  onSnapshot,
  snapshotEqual,
} from "firebase/firestore";
import * as PropTypes from "prop-types";
import { returnTime } from "../write/commonFunc";
import imgApi from "../../../utils/api/imgApi";

const Chat = styled.li`
  padding: 16px 0;
  border-bottom: 1px solid #e9ecef;
  position: relative;
  display: flex;
  justify-content: space-between;
`;
const ChatPhoto = styled.div`
  display: inline-block;
  vertical-align: middle;
`;
const ChatWriter = styled.div`
  display: inline-block;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.47;
  letter-spacing: -0.5px;
  vertical-align: middle;
  margin-right: 8px;
  margin-left: 8px;
`;
const ChatContent = styled.div`
  padding-top: 8px;
  font-size: 15px;
  line-height: 1.47;
  letter-spacing: -0.5px;
`;
const ChatTime = styled.span`
  font-size: 13px;
  line-height: 1.46;
  letter-spacing: -0.5px;
  color: #868e96;
  margin-top: 8px;
`;

const ChatImg = styled.img`
  width: 55px;
  height: 55px;
  -o-object-fit: cover;
  object-fit: cover;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
`;

const ItemImg = styled(ChatImg)`
  border-radius: 10%;
`;

const Unseen = styled.span`
  width: 18px;
  display: inline-block;
  height: 18px;
  border-radius: 50%;
  color: white;
  text-align: center;
  margin: 4px;
  padding: 1px;
  font-size: 12px;
  background-color: #e95158;
`;
const ChatItem = ({ userObj, chatObj }) => {
  const timeValue = chatObj.date;
  console.log("user", userObj);
  console.log("chatObj", chatObj);
  //to chat
  const chattingObj = {
    opponentName: chatObj.whoName.find(function (item) {
      return item !== userObj.displayName;
    }),
    opponentId: chatObj.who.find(function (item) {
      return item !== userObj.uid;
    }),
    opponentPhoto: chatObj.whoPhoto.find(function (item) {
      return item !== userObj.photoURL;
    }),
    productId: chatObj.product,
    productPhoto: chatObj.productPhoto,
    chatRoomId: chatObj.id,
    productName: chatObj.productName,
    price: chatObj.price,
    status: chatObj.status,
    owner: chatObj.owner,
  };

  //읽지않은 메세지 불러오기
  const [unSeen, setUnSeen] = useState("");

  const r = collection(
    dbService,
    "chatroom",
    chattingObj.chatRoomId,
    "messages"
  );
  const q = query(
    r,
    where("creatorId", "==", chattingObj.opponentId),
    where("seen", "==", false)
  );
  getDocs(q).then((snapshot) => setUnSeen(snapshot.docs.length));

  console.log(unSeen);

  return (
    <Link
      to="/chatroom"
      state={chattingObj}
      style={{ textDecoration: "none", color: "Black" }}
    >
      <Chat>
        <div>
          <ChatPhoto>
            {" "}
            <ChatImg
              src={
                chattingObj.opponentPhoto ? chattingObj.opponentPhoto : profile
              }
              alt="profile"
            />
          </ChatPhoto>
          <ChatWriter>
            {chattingObj.opponentName} ·{" "}
            <ChatTime>{returnTime(timeValue)}</ChatTime>
            <ChatContent>
              {chatObj.text.substring(0, 10)}
              {unSeen > 0 && <Unseen>{unSeen}</Unseen>}
            </ChatContent>
          </ChatWriter>
        </div>
        <ItemImg
          src={
            chattingObj.productPhoto
              ? imgApi(chattingObj.productPhoto.photoPath) ||
                imgApi(chattingObj.productPhoto)
              : require("../../../icon/applelogo.png")
          }
          alt="profile"
        ></ItemImg>
      </Chat>
    </Link>
  );
};

export default ChatItem;
