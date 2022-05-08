import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { DateLocation } from "../../common/list/DateLocation";
import { PriceTag } from "../../common/list/PriceTag";
import { StuffContents } from "../../common/list/StuffContents";
import { returnTime } from "../write/commonFunc";
import more from "../../../images/ico/ico_more.png";
import { dbService } from "../../../utils/api/fbInstance";
import likeIconOn from "../../../images/ico/ico_like.png";
import likeIconOff from "../../../images/ico/ico_like_count.png";
import * as PropTypes from "prop-types";
import axios from "axios";
import priceCommaFunc from "../../../utils/priceCommaFunc";
import imgApi from "../../../utils/api/imgApi";

const StuffContentWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-top: 15px;
  a {
    display: block;
    position: relative;
    width: 32%;
    max-height: 200px;

    &::after {
      content: "";
      display: block;
      padding-top: 100%;
    }

    & div {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 10px;
      background: url(${({ thumb }) => thumb}) center center/cover no-repeat;
    }
  }
`;

const StuffTopWrap = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StuffTitle = styled.strong`
  display: block;
  width: 80%;
  font-size: 1.0625rem;
  font-weight: 600;
  letter-spacing: -0.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  overflow: hidden;
`;

const StuffBtn = styled.button`
  width: 20%;
  height: 25px;
  background: url(${more}) center center/contain no-repeat;
  outline: none;
`;

const MoreBtnWrap = styled.div`
  position: absolute;
  top: 30px;
  right: 0;
  width: 50px;
  overflow: hidden;
  display: ${({ toggle }) => (toggle ? "block" : "none")};
`;

const MoreBtn = styled.button`
  display: block;
  width: 100%;
  height: 30px;
  border: 1px solid #d7d7d7;

  font-size: 14px;
  font-weight: 700;
  color: #666;
  background-color: #efefef;
`;

const LikeBx = styled.div`
  width: 40px;
  padding-right: 20px;

  & button {
    width: 100%;
    height: 100%;
    background: url(${({ color }) =>
        color === "on" ? likeIconOn : likeIconOff})
      center center/contain no-repeat;
    outline: none;
    transition: background ease-in-out 0.3s;
  }
`;

const EndTag = styled.span`
  font-size: 12px;
  background-color: rgba(0, 0, 0, 0.72);
  color: white;
  margin: 4px;
  padding: 4px;
  border-radius: 5px;
  font-weight: 400;
`;

EndTag.propTypes = { children: PropTypes.node };

function SaleStuff({
  thumb,
  matter,
  time,
  no,
  region,
  page,
  like,
  status,
  render,
  reset,
}) {
  const [toggle, setToggle] = useState(false);
  const isEnd = status === "END";
  const { price, title } = matter;
  const queryElement = { no };

  const onChange = async () => {
    await axios
      .post("/likePost/" + no)
      .then(() => {
        setToggleIcon((state) => !state);
      })
      .catch((reason) => {
        console.log(reason);
      });
  };

  const onDelete = async () => {
    // eslint-disable-next-line no-restricted-globals
    const del = confirm("정말로 이 상품을 삭제하시겠습니까?");
    if (del) {
      axios
        .delete("/items/" + no)
        .then(() => {
          render(!reset);
          setToggle(false);
        })
        .catch((reason) => {
          console.log(reason);
        });
    }
  };
  const [toggleIcon, setToggleIcon] = useState(like);
  return (
    <StuffContentWrap thumb={imgApi(thumb)}>
      <Link to={"/items/" + no}>
        <div />
      </Link>
      <StuffContents>
        <StuffTopWrap>
          <StuffTitle>{title}</StuffTitle>
          {page && (page === "like" || page === "sale") ? (
            page === "like" ? (
              <LikeBx color={toggleIcon ? "on" : "off"}>
                <button type="button" onClick={onChange}>
                  {}
                </button>
              </LikeBx>
            ) : (
              <StuffBtn onClick={() => setToggle((state) => !state)}>
                {}
              </StuffBtn>
            )
          ) : (
            ""
          )}
        </StuffTopWrap>
        <DateLocation>
          {region || "행복동"} · {time}
        </DateLocation>

        <PriceTag>
          {price && priceCommaFunc(price)}원{isEnd && <EndTag>판매완료</EndTag>}
        </PriceTag>
        {page && (page === "like" || page === "sale") ? (
          <MoreBtnWrap toggle={toggle}>
            <MoreBtn onClick={onDelete}>삭제</MoreBtn>
          </MoreBtnWrap>
        ) : (
          ""
        )}
      </StuffContents>
    </StuffContentWrap>
  );
}

export default SaleStuff;
