import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as Styled from "../../common/neighbor/Header";
import * as Line from "../../common/neighbor/Line";
import * as Icon from "../../common/neighbor/Icon";
import searchLocation from "./searchLocation";
import { inputAddress, keepAddress } from "../../../modules/neighbor";

const Header = () => {
  const [inputText, setInputText] = useState("");
  const [searchAddress, setSearchAddress] = useState("empty");

  const dispatch = useDispatch();
  const onSearchAddress = (address, isSearched) =>
    dispatch(inputAddress(address, isSearched));

  useEffect(() => {
    searchLocation(searchAddress).then((passedAddress) => {
      const address = passedAddress.documents;
      if (address.length > 0) {
        const addressArray = address.map((address) => address.address_name);
        const addressObj = { ...addressArray };
        onSearchAddress(addressObj, true);
      }
    });
  }, [inputText]);

  const onChangeAddress = (event) => {
    setInputText(event.target.value);
    if (event.target.value.trim() === "") {
      setSearchAddress("empty");
      onSearchAddress("", false);
    } else setSearchAddress(event.target.value);
  };

  const onReset = () => {
    setInputText("");
    setSearchAddress("empty");
    onSearchAddress("", false);
  };

  const history = useNavigate();
  const mainPage = () => history(-1);

  return (
    <Styled.Wrapper>
      <Link to="/">
        <Icon.ArrowBack
          onClick={() => {
            mainPage();
            keepAddress();
            onReset();
          }}
        />
      </Link>
      <Styled.SearchBarWrapper>
        <Styled.SearchBarInner>
          <Styled.SearchBarLeft>
            <Icon.Search />
            <Styled.Input
              value={inputText}
              placeholder="동명(읍, 면)으로 검색 (ex. 서초동)"
              onChange={onChangeAddress}
            />
          </Styled.SearchBarLeft>
          <Icon.Close onClick={onReset} />
        </Styled.SearchBarInner>
        <Line.Underline />
      </Styled.SearchBarWrapper>
    </Styled.Wrapper>
  );
};

export default Header;
