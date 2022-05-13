import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { useDispatch, useSelector } from "react-redux";
import getLocation from "../components/layout/neighborhood/getLocation";
import Location from "../components/layout/write/Location";
import * as PropTypes from "prop-types";
import styled from "styled-components";
import { setNeighbor } from "../modules/neighbor";
import axios from "axios";
import { forEach } from "react-bootstrap/ElementChildren";
import imgApi from "../utils/api/imgApi";

const TagArea = styled.div`
  width: 100%;
  margin-top: 10px;
  text-align: end;
`;

TagArea.propTypes = { children: PropTypes.node };
const EditingStuff = () => {
  const { userObj } = useSelector(({ user }) => ({
    userObj: user.currentUser,
  }));
  function intToStringNumber(intNumber) {
    return intNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const location = useLocation();
  const state = location.state;
  const [inputs, setInputs] = useState({
    title: state.title,
    price: state.price === null ? 0 : intToStringNumber(state.price),
    contents: state.content,
  });

  let region = useSelector((state) => state.neighbor.address);
  if (region === "notMyNeighbor") {
    region = state.region;
  }
  const tags = state.tags;
  const [attachment, setAttachment] = useState(
    state.photoList.map((e) => imgApi(e.photoPath))
    // state.photoList.map((e) => {
    //   let url = "http://localhost:8080/api/image?path=" + e.photoPath;
    //   fetch(url)
    //       .then(res => res.blob())
    //       .then(blob => {
    //         console.log(blob)
    //       })
    // })
  );
  const [loading, setLoading] = useState(false);
  const history = useNavigate();
  const [addr, setAddr] = useState([]);

  const selecAddr = useSelector(({ neighbor: { address } }) => address);
  useEffect(() => {
    console.log(attachment);
    const isBase64 = attachment.filter((e) => {
      return e.includes("base64");
    });
    console.log(isBase64);
  }, [attachment]);

  const geolocation = getLocation();
  // if (state.tags) {
  //   state.tags.map((e) => tagsState(e));
  // }
  if (userObj.uid === undefined) {
    alert("로그인을 하지않은 상태입니다. 로그인을 해주세요.");
    history("/auth");
    return <p>로그인을 하지않은 상태입니다. 로그인을 해주세요.</p>;
  }
  // fetch("http://localhost:8080/api/image?path=images/63c7c268-d18f-4e21-b8f1-f9029a6fbe3f.jpg")
  //     .then(res => res.blob())
  //     .then(blob => {
  //       console.log(blob)
  //     })
  // attachment.forEach((attachment) => {
  //   if (attachment.includes("http")) {
  //     fetch(attachment)
  //         .then(res => res.blob())
  //         .then(blob => console.log(blob))
  //   }
  // })
  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const { title, contents } = inputs;

    if (title.length < 3) {
      setLoading(false);
      return alert("글 제목을 최소 세 글자 이상 작성해 주세요");
    }

    if (contents.length < 3) {
      setLoading(false);
      return alert("글 내용을 최소 세 글자 이상 작성해 주세요");
    }

    setInputs({ title: "", price: "", contents: "" });
    setAttachment([]);
    setLoading(false);
    const formData = new FormData();
    function stringNumberToInt(stringNumber) {
      return parseInt(stringNumber.replace(/,/g, ""));
    }
    let postUpdateReqDto = {
      title: title,
      price: stringNumberToInt(price),
      tags: tags,
      content: contents,
      town: region,
    };
    // attachment.forEach((attachment) => {
    //   if (attachment.includes("http")) {
    //     let blob = fetch(attachment).then(res => {return res.blob()})
    //     let promise = new Promise(async (resolve, _) => {
    //         const reader = new FileReader();
    //         reader.onloadend = () => resolve(reader.result);
    //         reader.readAsDataURL(await blob);
    //     });

    // let getData = () => {
    // promise.then((result) => {
    //   console.log("ehdgh dhfmsqnfdkf")
    //   formData.append("file",DataURIToBlob(result),DataURIToBlob(result).type.replace(/image\//g, "."));
    // console.log(result)
    // formData.append("file", result);
    // });
    // };

    // getData()
    // console.log("base64Blob = ", base64Blob)

    // .then(a => {
    // formData.append("file",DataURIToBlob(blob),DataURIToBlob(blob).type.replace(/image\//g, "."));
    // })
    // }
    // else {
    //  formData.append("file", DataURIToBlob(attachment), DataURIToBlob(attachment).type.replace(/image\//g, "."));
    // }
    // })
    const isBase64 = attachment.filter((e) => {
      return e.includes("base64");
    });
    const links = attachment.filter((e) => {
      return !e.includes("base64");
    });
    isBase64.forEach((attachment) =>
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
      "postUpdateReqDto",
      new Blob([JSON.stringify(postUpdateReqDto)], { type: "application/json" })
    );
    formData.append(
      "link",
      new Blob([JSON.stringify(links)], { type: "application/json" })
    );
    let a = formData.keys();
    for (let item of a) {
      console.log(item);
    }

    // FIXME formData에 file 비어있으니까, 넣는 것 해결

    axios
      .put("/item/" + state.id, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response, " 성공");
        history("/items/" + state.id);
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
          <Location region={region} isEdit={true} />
          <form>
            <SelectPhoto
              onChange={onFileChange}
              attachment={attachment}
              onClearPhoto={onClearPhoto}
            />
            <StuffTitle onChange={onChange} title={title} />

            <WritePrice onChange={onPrice} price={price} />

            <WriteContents onChange={onChange} contents={contents} />
          </form>
          <TagArea>{tags && <Tag tags={tags} isEdit={true}></Tag>}</TagArea>
        </PaddingInner>
        {loading && <Loading />}
      </MobileInner>
    </MobileContainer>
  );
};

export default EditingStuff;
