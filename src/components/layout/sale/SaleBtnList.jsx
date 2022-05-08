import React from "react";
import styled from "styled-components";
import axios from "axios";
import { useState } from "react";

const ChangeBtnGroup = styled.div`
  font-size: 13px;
  justify-content: space-around;
  width: 100%;
  display: flex;
`;
const ChangeBtn = styled.div`
  cursor: pointer;
  width: 100%;
  text-align: center;
  padding: 10px 0;
  margin-top: 15px;
  border: 1px solid #d7d7d7;
`;

function SaleBtnList({ no, reset, render }) {
  const [toggle, setToggle] = useState(false);
  const onChange = async () => {
    // eslint-disable-next-line no-restricted-globals
    const chn = confirm("이 상품을 판매완료로 변경하시겠습니까?");
    if (chn) {
      axios
        .put("/sale/changeend/" + no)
        .then(() => {
          render(!reset);
          setToggle(false);
        })
        .catch((reason) => {
          console.log(reason);
        });
    }
  };

  return (
    <>
      <ChangeBtnGroup toggle={toggle}>
        <ChangeBtn onClick={onChange}>
          <button>거래완료로 변경</button>
        </ChangeBtn>
      </ChangeBtnGroup>
    </>
  );
}

export default SaleBtnList;
