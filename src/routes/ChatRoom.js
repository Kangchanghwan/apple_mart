import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  authService,
  dbService,
  storageService,
} from "../utils/api/fbInstance";
import Message from "../components/Message";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../css/ChatRoom.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import { ReactComponent as Close } from "../icon/close.svg";
import { useDispatch, useSelector } from "react-redux";
import { Circles } from "react-loader-spinner";
import {
  doc,
  onSnapshot,
  collection,
  orderBy,
  setDoc,
  addDoc,
  getDoc,
  query,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import axios from "axios";

import priceCommaFunc from "../utils/priceCommaFunc";
import statusSwitchFunc from "../utils/statusSwitchFunc";
import styled from "styled-components";
import imgApi from "../utils/api/imgApi";

const ExitBtn = styled.div`
  font-size: 15px;
  margin-bottom: 10px;
`;

const ChatRoom = () => {
  const [tradeId, setTradeId] = useState();
  const [loading, setLoading] = useState(false);
  const [point, setPoint] = useState(0);
  const dispatch = useDispatch();
  const { userObj } = useSelector(({ user }) => ({
    userObj: user.currentUser,
  }));
  let navigate = useNavigate();
  const location = useLocation();
  const chattingObj = location.state;
  console.log(chattingObj);
  const [chat, setChat] = useState("");
  const [chats, setChats] = useState([]);

  useEffect(() => {
    let isComponentMounted = true;
    const q = query(
      collection(dbService, "chatroom", chattingObj.chatRoomId, "messages"),
      orderBy("createdAt", "asc")
    );
    onSnapshot(q, (snapshot) => {
      const chatArray = snapshot.docs.map((docu) => {
        return {
          id: docu.id,
          ...docu.data(),
        };
      });
      setChats(chatArray);
    });
    axios
      .get("/user")
      .then((result) => {
        setPoint(result.data.account);
      })
      .catch((reason) => {
        if (reason.toString().includes("401")) {
          console.log("????????????");
        }
      });
    return () => {
      isComponentMounted = false;
    };
  }, []);

  const onSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = await ref(
        storageService,
        `${userObj.uid}/${uuidv4()}`
      );
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(response.ref);
    }
    const chatRoomObj = {
      text: chat,
      who: [userObj.uid, chattingObj.opponentId],
      whoPhoto: [userObj.photoURL, chattingObj.opponentPhoto],
      whoName: [userObj.displayName, chattingObj.opponentName],
      product: chattingObj.productId,
      productName: chattingObj.productName,
      price: chattingObj.price,
      status: chattingObj.status,
      productPhoto: chattingObj.productPhoto,
      owner: chattingObj.owner,
      date: Date.now(),
      show: [userObj.uid, chattingObj.opponentId],
    };

    const chatObj = {
      text: chat,
      creatorName: userObj.displayName,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      creatorPhoto: userObj.photoURL,
      chatRoomId: chattingObj.chatRoomId,
      seen: false,
      attachmentUrl,
    };
    chatRoomObj.first = false;
    await setDoc(
      doc(dbService, "chatroom", chattingObj.chatRoomId),
      chatRoomObj
    );
    await addDoc(
      collection(dbService, "chatroom", chattingObj.chatRoomId, "messages"),
      chatObj
    );
    setChat("");
    setAttachment("");
    setFile("");
    setLoading(false);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setChat(value);
  };

  const [attachment, setAttachment] = useState("");
  const [file, setFile] = useState("");

  const onFileChange = (event) => {
    const {
      target: { files, value },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    setFile(value);
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => {
    setAttachment(null);
    setFile("");
  };

  //???????????? ??????
  const [modalIsOpen, setModalIsOpen] = useState(false);
  Modal.setAppElement("#root");
  const [show, setshow] = useState(0);

  const onClose = () => {
    setModalIsOpen(false);
    setshow(0);
  };

  //???????????? ?????? ??????
  const pointPayClick = () => {
    if (point - chattingObj.price < 0) {
      if (window.confirm("????????? ???????????????. ?????????????????? ?????????????????????????")) {
        navigate("/profile");
      } else {
        onClose();
      }
    } else {
      setshow(1);
    }
  };

  const payOnClick = async () => {
    const noticeObj1 = {
      text: [
        chattingObj.opponentName + "????????? ????????? ????????? ?????????????????????!",
        "????????? : " + chattingObj.productName,
        "?????? ????????? : " + chattingObj.price + " ???",
        "?????? ????????? : " + point + "???",
        "???????????? ?????? ????????? ????????? ?????????!",
      ],
      createdAt: Date.now(),
      creatorId: "kSuKt7fM0ufWRuzVUii8HyAG4by2",
      seen: false,
      attachmentUrl: chattingObj.productPhoto.photoPath,
    };

    const noticeObj2 = {
      text: [
        userObj.displayName + "????????? ????????? ????????? ?????????????????????!",
        "????????? : " + chattingObj.productName,
        "?????? ????????? : " + chattingObj.price + " ???",
        "???????????? ?????? ????????? ????????? ?????????!",
      ],
      createdAt: Date.now(),
      creatorId: "kSuKt7fM0ufWRuzVUii8HyAG4by2",
      seen: false,
      attachmentUrl: chattingObj.productPhoto.photoPath,
    };

    const roomObj1 = {
      text: chattingObj.opponentName + "????????? ????????? ????????? ?????????????????????!",
      who: userObj.uid,
      date: new Date(),
    };

    const roomObj2 = {
      text: userObj.displayName + "????????? ????????? ????????? ?????????????????????!",
      who: chattingObj.opponentId,
      date: new Date(),
    };

    await axios
      .put("/trade", { postId: chattingObj.productId, pointPay: true })
      .then((result) => {
        const chatRoomObj = {
          status: "END",
        };
        setDoc(doc(dbService, "noticeroom", userObj.uid), roomObj1);
        addDoc(
          collection(dbService, "noticeroom", userObj.uid, "messages"),
          noticeObj1
        );
        setDoc(doc(dbService, "noticeroom", chattingObj.opponentId), roomObj2);
        addDoc(
          collection(
            dbService,
            "noticeroom",
            chattingObj.opponentId,
            "messages"
          ),
          noticeObj2
        );
        updateDoc(doc(dbService, "chatroom", chattingObj.chatRoomId), {
          status: "END",
        }).then(() => {
          setTradeId(result.data.data.tradeId);
          setshow(2);
        });
      })
      .catch((reason) => {
        console.log(reason);
      });
  };

  const cashPayClick = async () => {
    const noticeObj1 = {
      text: [
        chattingObj.opponentName + "????????? ????????? ????????? ?????????????????????!",
        "????????? : " + chattingObj.productName,
        "?????? : " + chattingObj.price + " ???",
      ],
      createdAt: Date.now(),
      creatorId: "kSuKt7fM0ufWRuzVUii8HyAG4by2",
      seen: false,
      attachmentUrl: chattingObj.productPhoto.photoPath,
    };

    const noticeObj2 = {
      text: [
        userObj.displayName + "????????? ????????? ????????? ?????????????????????!",
        "????????? : " + chattingObj.productName,
        "?????? : " + chattingObj.price + " ???",
      ],
      createdAt: Date.now(),
      creatorId: "kSuKt7fM0ufWRuzVUii8HyAG4by2",
      seen: false,
      attachmentUrl: chattingObj.productPhoto.photoPath,
    };

    const roomObj1 = {
      text: chattingObj.opponentName + "????????? ????????? ????????? ?????????????????????!",
      who: userObj.uid,
      date: new Date(),
    };

    const roomObj2 = {
      text: userObj.displayName + "????????? ????????? ????????? ?????????????????????!",
      who: chattingObj.opponentId,
      date: new Date(),
    };

    await axios
      .put("/trade", { postId: chattingObj.productId, pointPay: false })
      .then((result) => {
        const chatRoomObj = {
          status: "END",
        };
        setDoc(doc(dbService, "noticeroom", userObj.uid), roomObj1);
        addDoc(
          collection(dbService, "noticeroom", userObj.uid, "messages"),
          noticeObj1
        );
        setDoc(doc(dbService, "noticeroom", chattingObj.opponentId), roomObj2);
        addDoc(
          collection(
            dbService,
            "noticeroom",
            chattingObj.opponentId,
            "messages"
          ),
          noticeObj2
        );
        updateDoc(doc(dbService, "chatroom", chattingObj.chatRoomId), {
          status: "END",
        }).then(() => {
          setTradeId(result.data.data.tradeId);
          setshow(2);
        });
      })
      .catch((reason) => {
        console.log(reason);
      });
  };

  //????????? ?????? ??????
  const ExitBtnOnclick = async () => {
    if (
      !window.confirm(
        "?????? ?????? ??????????????????????(??????????????? ???????????? ????????????.)"
      )
    ) {
      return;
    }
    const r = doc(dbService, "chatroom", chattingObj.chatRoomId);
    const docRef = await getDoc(r);
    const docData = docRef.data();

    if (docData.show.includes(chattingObj.opponentId)) {
      await updateDoc(r, { show: [chattingObj.opponentId, ""] }).then(() => {
        navigate(-1);
      });
    } else {
      await updateDoc(r, { show: ["", ""] }).then(() => {
        navigate(-1);
      });
    }
  };

  return (
    <div className={styles.center}>
      <div className={styles.form}>
        <div className={styles.opponentField}>
          <div style={{ display: "inline-flex", width: " " }}>
            <button
              className={styles.opponentBack}
              onClick={() => navigate(-1)}
            >
              {" "}
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <div>
              <p style={{ width: "200px" }}> {chattingObj.opponentName} </p>
            </div>
          </div>

          <ExitBtn>
            {" "}
            <div style={{ textAlign: "right" }}>
              <button onClick={ExitBtnOnclick} className={styles.close}>
                <Close />
              </button>
            </div>
          </ExitBtn>
        </div>
        <div className={styles.productField}>
          <div>
            <img
              className={styles.productPhoto}
              src={
                chattingObj.productPhoto
                  ? imgApi(chattingObj.productPhoto.photoPath) ||
                    imgApi(chattingObj.productPhoto)
                  : require("../icon/applelogo.png")
              }
              width="50px"
              height="50px"
              alt="attachment"
            />
          </div>
          <Link
            to={"/items/" + chattingObj.productId}
            style={{ textDecoration: "none", color: "Black" }}
          >
            <div className={styles.productContent}>
              <span>
                ({statusSwitchFunc(chattingObj.status)})
                {chattingObj.productName.substring(0, 20)}
              </span>
              <br />
              {priceCommaFunc(chattingObj.price)}???
            </div>
          </Link>
          <div>
            {chattingObj.owner === userObj.uid && chattingObj.status !== "END" && (
              <button
                onClick={() => {
                  if (chats.length > 0) {
                    setModalIsOpen(true);
                  } else {
                    alert("?????? ????????? ????????? ?????????.");
                  }
                }}
                className={styles.tradeButton}
              >
                ????????????
              </button>
            )}
            <Modal
              isOpen={modalIsOpen}
              className={styles.modal}
              shouldCloseOnOverlayClick={false}
              onRequestClose={() => setModalIsOpen(false)}
              style={{
                overlay: {
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(61, 61, 61, 0.342)",
                },
              }}
            >
              <div style={{ textAlign: "right" }}>
                <button onClick={onClose} className={styles.close}>
                  <Close />
                </button>
              </div>
              <div
                style={{
                  alignIems: "center",
                  display: show == 0 ? "block" : "none",
                }}
              >
                <p className={styles.modalText}>??????????????? ??????????????????.</p>
                <div className={styles.modalGroup}>
                  <div>
                    <button
                      className={styles.modalButton}
                      onClick={cashPayClick}
                    >
                      ????????? ????????????
                    </button>
                  </div>
                  <div>
                    <button
                      className={styles.modalButton}
                      onClick={pointPayClick}
                    >
                      ???????????? ??????
                    </button>
                  </div>
                </div>
              </div>
              <div style={{ display: show == 1 ? "block" : "none" }}>
                <p className={styles.modalText}>
                  ?????? ?????????: {priceCommaFunc(point)}???
                  <br />
                  ?????? ?????????: {priceCommaFunc(chattingObj.price)}???
                  <br />
                  ?????? ??? ?????????: {priceCommaFunc(point - chattingObj.price)}???
                </p>
                <div className={styles.modalGroup}>
                  <div>
                    <button
                      className={styles.modalButton}
                      onClick={payOnClick}
                      disabled={loading}
                    >
                      ????????????
                    </button>
                  </div>
                  <div>
                    <button className={styles.modalButton} onClick={onClose}>
                      ??????
                    </button>
                  </div>
                </div>
              </div>
              <div style={{ display: show == 2 ? "block" : "none" }}>
                <p className={styles.modalText}>
                  ????????? ?????????????????????.
                  <br /> ????????? ????????? ???????????????.
                </p>
                <div className={styles.modalGroup}>
                  <button
                    className={styles.modalButton}
                    onClick={() => {
                      setModalIsOpen(false);
                      navigate("/writeReview/" + tradeId);
                    }}
                  >
                    ?????? ?????????
                  </button>
                </div>
              </div>
            </Modal>
          </div>
        </div>
        <div>
          <div className={styles.chatRoom}>
            <ul className={styles.chatContent}>
              <div>
                {chats.map((chat) => (
                  <Message
                    key={chat.id}
                    chatObj={chat}
                    userObj={userObj}
                    isOwner={chat.creatorId === userObj.uid}
                  />
                ))}
                {attachment && (
                  <div className={styles.ownBubble}>
                    <img
                      src={attachment}
                      width="250px"
                      height="250px"
                      alt="attachment"
                    />
                    <div>
                      <button onClick={onClearAttachment}>??????</button>
                    </div>
                  </div>
                )}
              </div>
            </ul>
            <form
              onSubmit={
                !chat && !file
                  ? (e) => {
                      e.preventDefault();
                    }
                  : loading
                  ? (e) => {
                      e.preventDefault();
                    }
                  : onSubmit
              }
            >
              <div className={styles.inputGroup}>
                <div className={styles.file}>
                  <label htmlFor="ex_file" />
                  <input
                    type="file"
                    id="ex_file"
                    accept="image/*"
                    onChange={onFileChange}
                    value={file}
                  />
                </div>
                <div>
                  <input
                    className={styles.inputContent}
                    value={chat}
                    onChange={onChange}
                    type="text"
                    placeholder="?????? ????????? ????????? ?????????."
                    maxLength={120}
                  />
                </div>
                <div>
                  {!chat && !file ? (
                    <div className={styles.planeButton} />
                  ) : loading ? (
                    <Circles
                      color="gray"
                      heigt={25}
                      width={25}
                      timeout={3000}
                    />
                  ) : (
                    <input
                      type="submit"
                      value=""
                      className={styles.planeButton}
                    />
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
