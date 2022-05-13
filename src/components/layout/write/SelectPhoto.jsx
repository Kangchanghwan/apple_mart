import React from "react";
import styled from "styled-components";
import PhotoPreview from "../../common/PhotoPreview";
import camera from "../../../images/ico/ico_camera.png";
import imgApi from "../../../utils/api/imgApi";

const PhotoWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 36px 0 18px;
  border-bottom: 2px solid #f0f0f0;
`;

const AddPhotoInupt = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: react(0, 0, 0, 0);
  border: 0;
  outline: none;
`;

const AddPhotoLabel = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 70px;
  height: 70px;
  border: 2px solid #ebebeb;
  border-radius: 5px;
  color: #888;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    & img {
      animation-name: moving;
      animation-duration: 1.5s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
    }
  }

  & img {
    width: 22px;
    transform: rotate(0deg);
  }

  & span {
    padding-top: 3px;
  }

  @keyframes moving {
    0% {
      transform: rotate(0deg);
    }
    30% {
      transform: rotate(-20deg);
    }
    40% {
      transform: rotate(30deg);
    }
    70% {
      transform: rotate(-20deg);
    }
    80% {
      transform: rotate(10deg);
    }
    90% {
      transform: rotate(-10deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
`;

function SelectPhoto({ onChange, attachment, onClearPhoto }) {
  return (
    <PhotoWrap>
      <AddPhotoInupt
        id="addPhoto"
        type="file"
        accept="image/*"
        onChange={onChange}
        multiple
      />
      <AddPhotoLabel htmlFor="addPhoto">
        <img src={camera} alt="camera" />
        <span>{attachment.length}/10</span>
      </AddPhotoLabel>
      {attachment?.map((dataUrl, idx) => {
        return (
          <PhotoPreview
            attachment={dataUrl}
            onClearPhoto={onClearPhoto}
            no={idx}
            // eslint-disable-next-line react/no-array-index-key
            key={idx}
          />
        );
      })}
    </PhotoWrap>
  );
}

export default SelectPhoto;
