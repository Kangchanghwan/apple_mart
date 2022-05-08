import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Inner } from "../components/layout/Inner";
import WriteSwiper from "../components/layout/write/WriteSwiper";
import OneDepthHeader from "../components/layout/OneDepthHeader";
import DetailUserData from "../components/layout/write/DetailUserData";
import DetailContents from "../components/layout/write/DetailContents";
import OneDepthFooter from "../components/layout/write/OneDepthFooter";
import DetailSale from "../components/layout/write/DetailSale";
import { useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import itemOfJson from "../data/carrot.json";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import user from "../modules/user";
import Loading from "../components/layout/write/Loading";
import { setNeighbor } from "../modules/neighbor";

const StuffDetailWrap = styled.div`
  position: relative;
`;

function StuffDetail() {
  const param = useParams();
  const { userObj } = useSelector(({ user }) => ({
    userObj: user.currentUser,
  }));
  const [loading, setLoading] = useState(true);
  const item = itemOfJson[param.id];
  const [trigger, setTrigger] = useState(false);
  // const stuffs = useSelector((state) => state.stuffs.data);
  const detailHead = useRef(null);
  const dispatch = useDispatch();
  const resetNeighbor = () => dispatch(setNeighbor("notMyNeighbor"));
  const stuffs = [
    {
      photoList: [item.img_src],
      afterDate: "1시간전",
      id: 1,
      creatorName: "test",
      profileImg: [
        "https://firebasestorage.googleapis.com/v0/b/nwitter-63c79.appspot.com/o/IhuBtJ1JcwZ1AKkV5D5r8cOOfVU2%2F5115280b-5606-46ca-97c9-28d5dd9a2b3e?alt=media&token=87553d4b-d01d-44e2-9b93-aab8511f43b2",
      ],
      creatorId: "usmkw124kasv",

      title: item.title,
      price: item.price,
      content: item.content,

      view: 111,
      like: 10,
      region: item.region_name,
      tags: item.tags.split(","),
      owner: false,
      status: "ING",
    },
  ];
  const [stuff, setStuff] = useState({ data: stuffs[0] });
  const history = useNavigate();
  const { search } = useLocation();
  // const query = queryString.parse(search);
  // const { no } = query;

  //  useCallList();

  // const toggleNav = () => {
  //   const scrollValue = window.scrollY;
  //   const userData = detailHead.current?.offsetTop;
  //   if (scrollValue >= userData) setTrigger(true);
  //   else setTrigger(false);
  // };
  //
  // const scrollTrigger = () => {
  //   window.addEventListener("scroll", toggleNav);
  //   return () => window.removeEventListener("scroll", toggleNav);
  // };

  useEffect(() => {
    setLoading(true);
    axios
      .get("/items/" + param.id)
      .then((result) => {
        const resultObj = result.data.data;
        console.log(resultObj.tags);
        setStuff((prevState) => ({
          ...prevState,
          data: {
            ...prevState.data,
            photoList: resultObj.photoList,
            afterDate: resultObj.afterDate,
            id: resultObj.id,
            creatorName: resultObj.creatorName,
            profileImg: resultObj.profileImg,
            creatorId: resultObj.creatorId,
            //
            view: resultObj.view,
            like: resultObj.like,
            title: resultObj.title,
            price: resultObj.price,
            content: resultObj.content,
            //
            isLike: resultObj.booleanLike,
            region: resultObj.region,
            tags: resultObj.tags,
            owner: resultObj.owner,
            status: resultObj.status,
          },
        }));
        resetNeighbor();
      })
      .catch((reason) => {
        console.log(reason);
      })
      .then(() => {
        setLoading(false);
      });
  }, []);
  //
  // useEffect(() => {
  //   scrollTrigger();
  // }, [scrollTrigger]);
  const {
    id,
    tags,
    creatorName,
    profileImg,
    photoList,
    creatorId,
    region,
    title,
    content,
    price,
    afterDate,
    view,
    like,
    status,
    owner,
    isLike,
  } = stuff.data;
  const stateData = {
    title,
    tags,
    photoList,
    region,
    content,
    price,
    id,
  };

  const chattingObj = {
    opponentName: creatorName,
    opponentId: creatorId,
    opponentPhoto: profileImg,
    productId: id,
    productName: title,
    price: price,
    status: status,
    owner: userObj ? userObj.uid : "",
    productPhoto: photoList[0],
    chatRoomId: id + (userObj ? userObj.uid : ""),
  };
  console.log(chattingObj);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {" "}
          <section
            className="pt-4"
            style={{
              height: "60px",
              width: "100%",
            }}
          />
          <Container
            style={{
              maxWidth: "1100px",
              paddingRight: "10%",
              paddingLeft: "10%",
              width: "100%",
            }}
          >
            <StuffDetailWrap key="1">
              <OneDepthHeader trigger={trigger} />
              <WriteSwiper carouselImg={photoList} />
              <Inner>
                <Link to={"/seller_profile/" + creatorId}>
                  {" "}
                  <DetailUserData
                    profileImg={profileImg}
                    username={creatorName}
                    ref={detailHead}
                  />
                </Link>
                <DetailContents
                  view={view}
                  like={like}
                  title={title}
                  region={region}
                  contents={content}
                  time={afterDate}
                  tags={tags}
                />
                <DetailSale username={creatorName} stuff={stuffs} />
              </Inner>
              <OneDepthFooter
                stuffData={stuff}
                stateData={stateData}
                isOwner={owner}
                chattingObj={chattingObj}
                isLogin={userObj}
                no={id}
                isLike={isLike}
              />
            </StuffDetailWrap>
          </Container>
        </>
      )}
    </>
  );
}

export default StuffDetail;
