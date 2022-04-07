import React from "react";
import styled from "styled-components";
import { categoryList, returnTime } from "./commonFunc";
import Tag from "../../common/tags/Tag";

const ContentsWrap = styled.div`
  padding-top: 10px;
  border-bottom: 1px solid #f0f0f0;
`;
const TagWrap = styled(Tag)`
  padding-bottom: 10px;
`;
const ContentsTitle = styled.h3`
  font-size: 1.375rem;
  font-weight: 700;
`;

const ContentsInfo = styled.div`
  font-size: 0.875rem;
  color: #aaa;
  padding: 23px 0;
`;
const ContentsTxt = styled.p``;

function DetailContents({ title, contents, time, tags }) {
  const categoryFilter = categoryList();
  // const categoryName = categoryFilter.filter(
  //   (list) => list.id === Number(category)
  // );
  // const [categoryItem] = categoryName;
  const { listName } = { id: 1, listName: "디지털/가전" };
  return (
    <ContentsWrap>
      <ContentsTitle>{title || "임시"}</ContentsTitle>
      <Tag tags={tags} isDetail={true}></Tag>

      <ContentsInfo>
        <span>{returnTime(time)}전</span>
      </ContentsInfo>
      <ContentsTxt>
        {contents.split(/\n/gi).map((e) => {
          return (
            <>
              {e}
              <br />
            </>
          );
        })}
      </ContentsTxt>
      <ContentsInfo>
        <span>관심 3 · 조회 111</span>
      </ContentsInfo>
    </ContentsWrap>
  );
}

export default React.memo(DetailContents);
