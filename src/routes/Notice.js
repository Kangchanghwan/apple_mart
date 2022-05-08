import React from "react";
import styles from "../css/Message.module.css";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { dbService } from "../utils/api/fbInstance";
import imgApi from "../utils/api/imgApi";

const Notice = ({ chatObj, isOwner, userObj }) => {
  const createdTime = new Date(chatObj.createdAt);
  let createdHour =
    createdTime.getHours() < 12
      ? ("0" + createdTime.getHours()).slice(-2)
      : ("0" + (createdTime.getHours() - 12)).slice(-2);
  const createdMin = ("0" + createdTime.getMinutes()).slice(-2);
  const createdMonth = createdTime.getMonth() + 1;
  const createdDate = createdTime.getDate();
  let apm = createdTime.getHours() < 12 ? "오전" : "오후";
  let todayTime = new Date();
  let todayMonth = todayTime.getMonth() + 1;
  let todayDate = todayTime.getDate();

  const Item = ({ text }) => {
    return (
      <p>
        {text.split("\n").map((txt) => (
          <>
            {txt}
            <br />
          </>
        ))}
      </p>
    );
  };

  if (!isOwner && chatObj.seen === false) {
    console.log("실행");
    const ref = doc(
      dbService,
      "noticeroom",
      userObj.uid,
      "messages/" + chatObj.id
    );
    updateDoc(ref, { seen: true }).then((r) => console.log("읽음"));
  }

  return (
    <div className={styles.bubbleContainer}>
      <>
        <div className={styles.bubbleWrapper}>
          <div className={styles.inlineContainer}></div>
          <div
            className={
              isOwner ? styles.inlineContainerOwn : styles.inlineContainer
            }
          >
            <div className={isOwner ? styles.ownBubble : styles.otherBubble}>
              <div>
                {chatObj.attachmentUrl && (
                  <a href={imgApi(chatObj.attachmentUrl)}>
                    <img
                      className={styles.clipPhoto}
                      src={imgApi(chatObj.attachmentUrl)}
                      alt=""
                    />
                  </a>
                )}
              </div>
              {chatObj.text.map((item, index) => (
                <p key={index}>{item}</p>
              ))}
            </div>
            <div>
              <br />
              {isOwner && (
                <span className={styles.own}>
                  {chatObj.seen ? "읽음" : "읽지 않음"}
                </span>
              )}
            </div>
          </div>
          {createdDate === todayDate && createdMonth === todayMonth ? (
            <span className={isOwner ? styles.own : styles.other}>
              {apm} {createdHour} : {createdMin}
            </span>
          ) : (
            <span className={isOwner ? styles.own : styles.other}>
              {createdMonth}월 {createdDate}일
            </span>
          )}
        </div>
      </>
    </div>
  );
};

export default Notice;
