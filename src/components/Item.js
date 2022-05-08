import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";
import priceCommaFunc from "../utils/priceCommaFunc";
import axios from "axios";
import imgApi from "../utils/api/imgApi";

const ItemImgBox = styled.div`
  margin: 1rem;
`;
const TextBox = styled.div`
  margin: 0 auto;
  max-width: 330px;
`;

const EndProduct = styled.div`
  padding: 5px 10px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  font-size: 14px;
  text-align: center;
  position: absolute;
  color: white;
  top: 54%;
  left: 70%;
  transform: translate(-50%, -50%);
`;
const Item = ({ item }) => {
  const { id, title, region, price, img, status, afterDate } = item;
  const isEnd = status === "END";

  return (
    <>
      <ItemImgBox>
        <img className="product-image" src={imgApi(img)} alt="Product image" />
        {isEnd && <EndProduct>판매완료</EndProduct>}
        <TextBox>
          <p
            className="text-xl-start wrap-text"
            style={{ marginBottom: "0.1rem" }}
          >
            {title}
          </p>
          <p
            className="text-lg-start small-text"
            style={{ marginBottom: "0.1rem", justifyContent: "start" }}
          >
            {region} | {afterDate}
          </p>
          <Row>
            <Col>
              {" "}
              <p className="text-lg-start">{priceCommaFunc(price)}원</p>
            </Col>
          </Row>
        </TextBox>
      </ItemImgBox>
    </>
  );
};

export default Item;
