import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WritingHeader from "../components/layout/write/WritingHeader";
import { PaddingInner } from "../components/layout/Inner";
import SelectPhoto from "../components/layout/write/SelectPhoto";
import StuffTitle from "../components/layout/write/StuffTitle";
import WriteContents from "../components/layout/write/WriteContents";
import WritePrice from "../components/layout/write/WritePrice";
import Loading from "../components/layout/write/Loading";
import { MobileContainer } from "../components/common/MobileContainer";
import { MobileInner } from "../components/common/MobileInner";
import ToggleButtons from "../components/common/tags/ToggleButtons";
import WritingStuffTag from "../components/common/WritingStuffTag";
import { WriteInputWrap } from "../components/layout/write/WriteInputWrap";
import Tag from "../components/common/tags/Tag";
import { useSelector } from "react-redux";
import getLocation from "../components/layout/neighborhood/getLocation";
import Location from "../components/layout/write/Location";
import axios from "axios";
const WritingStuff = ({ tags, tagsState }) => {
  const { userObj } = useSelector(({ user }) => ({
    userObj: user.currentUser,
  }));
  const [inputs, setInputs] = useState({ title: "", price: "", contents: "" });
  const [attachment, setAttachment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState(
    useSelector((state) => state.neighbor.address)
  );
  const history = useNavigate();
  const [addr, setAddr] = useState([]);
  const selecAddr = useSelector(({ neighbor: { address } }) => address);
  const geolocation = getLocation();
  useEffect(() => {
    geolocation.then((res) => {
      setAddr(Array.from(res));
      if (region === "notMyNeighbor") {
        setRegion(Array.from(res)[0]);
      }
    });
  }, []);
  if (userObj.uid === undefined) {
    alert("로그인을 하지않은 상태입니다. 로그인을 해주세요.");
    history("/auth");
    return <p>로그인을 하지않은 상태입니다. 로그인을 해주세요.</p>;
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const { title, contents } = inputs;

    if (tags.length < 1) {
      setLoading(false);
      return alert("태그를 하나 이상 입력해 주세요")
    }

    if (title.length < 3) {
      setLoading(false);
      return alert("글 제목을 최소 세 글자 이상 작성해 주세요");
    }

    if (contents.length < 3) {
      setLoading(false);
      return alert("글 내용을 최소 세 글자 이상 작성해 주세요");
    }
    if (tags.length < 1) {
      setLoading(false);
      return alert("태그를 하나 이상 입력해 주세요");
    }

    setInputs({ title: "", price: "", contents: "" });
    setAttachment([]);
    setLoading(false);

    const formData = new FormData();

    function stringNumberToInt(stringNumber) {
      return parseInt(stringNumber.replace(/,/g, ""));
    }

    let postReqDto = {
      title: title,
      price: stringNumberToInt(price),
      tags: tags,
      content: contents,
      town: region,
    };

    attachment.forEach((attachment) =>
      formData.append(
        "file",
        DataURIToBlob(attachment),
        DataURIToBlob(attachment).type.replace(/image\//g, ".")
      )
    );
    function DataURIToBlob(dataURI) {
      const splitDataURI = String(dataURI).split(",");
      const byteString =
        splitDataURI[0].indexOf("base64") >= 0
          ? atob(splitDataURI[1])
          : decodeURI(splitDataURI[1]);
      const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

      const ia = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i);

      return new Blob([ia], { type: mimeString });
    }

    formData.append(
      "postReqDto",
      new Blob([JSON.stringify(postReqDto)], { type: "application/json" })
    );
    axios
      .post("/item", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response, " 성공");
        history("/items/" + response.data);
      })
      .catch((reason) => {
        console.log(reason);
      });
    alert("상품이 성공적으로 등록되었습니다.");
  };

  const onChange = (event) => {
    const {
      target: { value, name },
    } = event;

    setInputs({ ...inputs, [name]: value });
  };

  const onPrice = (event) => {
    const regex = /[^0-9]/g;
    const price = event.target.value.replace(regex, "");
    let NumberPrice = Number(price);
    if (NumberPrice >= 99999999) NumberPrice = 99999999;
    let priceComma = NumberPrice.toString().replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    );
    if (priceComma === "0") priceComma = "";

    setInputs({ ...inputs, price: priceComma });
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;

    let fileUrl = [];

    const fileArr = Array.from(files);
    fileArr.map((file) => {
      const reader = new FileReader();

      reader.onloadend = (event) => {
        const {
          currentTarget: { result },
        } = event;

        fileUrl.push(result);
        setAttachment([...attachment, ...fileUrl]);
      };
      return reader && reader.readAsDataURL(file);
    });
  };

  const onClearPhoto = (no) => {
    setAttachment((state) => {
      return state.filter((item) => item !== state[no]);
    });
  };

  const { title, price, contents } = inputs;

  return (
    <MobileContainer>
      <MobileInner>
        <WritingHeader onClick={onSubmit} />
        <PaddingInner>
          <Location selecAddr={selecAddr} addr={addr} />
          <form>
            <SelectPhoto
              onChange={onFileChange}
              attachment={attachment}
              onClearPhoto={onClearPhoto}
            />
            <StuffTitle onChange={onChange} title={title} />
            <WritingStuffTag tags={tags} tagsState={tagsState} />
            {tags && <ToggleButtons list={tags} listState={tagsState} />}
            <WriteInputWrap>
              {tags && <Tag tags={tags} listState={tagsState}></Tag>}
            </WriteInputWrap>
            <WritePrice onChange={onPrice} price={price} />

            <WriteContents onChange={onChange} contents={contents} />
          </form>
        </PaddingInner>
        {loading && <Loading />}
      </MobileInner>
    </MobileContainer>
  );
};

export default WritingStuff;
