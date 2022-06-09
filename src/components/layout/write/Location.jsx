import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Circles } from "react-loader-spinner";
import {add} from "react-modal/lib/helpers/classList";

const LocationWrap = styled.div`
  text-align: end;
  font-size: 13px;
  margin-top: 8px;
`;

const LocationImg = styled.img`
  display: inline-block;
  margin-bottom: 2px;
  width: 17px;
  height: 17px;
`;

const Location = ({ selecAddr, addr, isEdit, region }) => {
  const filterFunc = (addr) => {
    const region = addr.split(' ');
    if (addr === "notMyNeigbor") return null;
    return region[region.length -1];
  };
  return (
    <LocationWrap>
      {!isEdit ? (
        <span style={{ display: "inline-flex", alignItems: "center" }}>
          내 위치 :{" "}
          {filterFunc(selecAddr) || filterFunc(addr[0]) || (
            <Circles color="gray" height={10} width={10} timeout={3000} />
          )}{" "}
        </span>
      ) : (
        <span>
          {" "}
          내 위치 :{" "}
          {filterFunc(region) || (
            <Circles color="gray" height={10} width={10} timeout={3000} />
          )}{" "}
        </span>
      )}
      <Link to={"/gps"} isEdit={isEdit}>
        {" "}
        <LocationImg src="https://cdn4.iconfinder.com/data/icons/game-general-icon-set-1/512/reset-512.png" />
      </Link>
    </LocationWrap>
  );
};

export default Location;
