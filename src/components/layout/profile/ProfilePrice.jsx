import React from "react";
import styled from "styled-components";
import { ProfileInputWrap } from "./ProfileInputWrap";
import { WriteInput } from "../../common/WriteInput";
import { Link } from "react-router-dom";
import PointChargeModal from "./PointChargeModal";
import PointRefundModal from "./PointRefundModal";
import priceCommaFunc from "../../../utils/priceCommaFunc";

const PriceWrap = styled(ProfileInputWrap)`
  display: flex;
  justify-content: end;
`;

const PriceShape = styled.span`
  padding-top: 3px;
  color: ${({ price }) => (price === "" ? "#aaa" : "#202020")};
`;

const PriceInput = styled(WriteInput)`
  width: 150px;

  background: rgb(250, 250, 250) !important;
`;
const PointBtn = styled.span`
  height: 35px;
  border: 2px solid #f0f0f0;
  border-radius: 5px;
  text-align: center;
  padding: 5px;
  margin-right: 3px;
  font-size: 14px;
  font-weight: 500;
  background-color: #ffffff;
  cursor: pointer;
`;

function ProfilePrice({ onChange, price, priceOnclick }) {
  return (
    <PriceWrap>
      <PriceShape price={priceCommaFunc(price)}>￦</PriceShape>
      <PriceInput
        type="text"
        readOnly={true}
        name="price"
        onChange={onChange}
        value={priceCommaFunc(price)}
      />
      <PointChargeModal price={price} priceOnclick={priceOnclick} />
      <PointRefundModal price={price} priceOnclick={priceOnclick} />
    </PriceWrap>
  );
}

export default ProfilePrice;
