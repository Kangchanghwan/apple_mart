import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import getLocation from "./getLocation";
import * as Styled from "../../common/neighbor/Body";
import * as Line from "../../common/neighbor/Line";
import * as Button from "../../common/neighbor/Button";
import { setNeighbor } from "../../../modules/neighbor";

const Neighbor = ({ neighbor }) => {
  const dispatch = useDispatch();
  const onSetNeighbor = (address) => dispatch(setNeighbor(address));
  const history = useNavigate();
  const writingStuffPage = () => {
    history(-1);
  };

  return (
    <>
      <Styled.NeighborList>
        <Button.Span
          type="submit"
          onClick={() => {
            onSetNeighbor(neighbor.value);
            writingStuffPage();
          }}
        >
          {neighbor.value}
        </Button.Span>
      </Styled.NeighborList>
      <Line.Border />
    </>
  );
};

const AddressArray = ({ addressObj }) => {
  let addressObjElements = { ...addressObj };
  let addressObjArray = [];
  const keys = Object.keys(addressObjElements);

  for (let i = 0; i < keys.length; i += 1) {
    const obj = { key: i, value: addressObjElements[i] };
    addressObjArray.push(obj);
  }

  return (
    <>
      {addressObjArray.map((neighbor) => (
        <Neighbor neighbor={neighbor} key={neighbor.key} />
      ))}
    </>
  );
};

const AddressObject = () => {
  const [addressObj, setAddressObj] = useState([]);

  useEffect(() => {
    getLocation().then((passedAddressSet) => {
      setAddressObj(Array.from(passedAddressSet));
    });
  }, []);

  return (
    <>
      <AddressArray addressObj={addressObj} />
    </>
  );
};

const List = () => {
  return (
    <>
      <Button.Orange>현재위치로 찾기</Button.Orange>
      <Styled.Span>근처 동네</Styled.Span>
      <AddressObject />
    </>
  );
};

export default List;
