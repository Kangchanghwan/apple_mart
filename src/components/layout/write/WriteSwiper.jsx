import React from "react";
import styled from "styled-components";
import SwiperCore, { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import imgApi from "../../../utils/api/imgApi";

// import 'swiper/swiper-bundle.css';
// import 'swiper/swiper.scss';

SwiperCore.use([Pagination]);

const SwiperWrap = styled.div`
  .swiper-slide {
    height: 40vw;
    background: url(${({ imgLink }) => imgLink}) center center/cover no-repeat;
  }

  .swiper-pagination-bullet,
  .swiper-pagination-bullet-active {
    background-color: #fff;
  }
`;

function WriteSwiper({ carouselImg }) {
  console.log(carouselImg);
  return (
    <SwiperWrap>
      <Swiper spaceBetween={0} pagination>
        {carouselImg !== "default" && carouselImg?.length >= 1 ? (
          carouselImg.map((img, idx) => {
            return (
              <SwiperSlide
                // eslint-disable-next-line react/no-array-index-key
                key={idx}
                style={{
                  background: `url(${imgApi(
                    img.photoPath
                  )}) center center/cover no-repeat`,
                }}
              />
            );
          })
        ) : (
          <SwiperSlide
            style={{
              backgroundColor: "#CCC",
              fontSize: "2rem",
              textAlign: "center",
              lineHeight: "100vw",
            }}
          >
            NO IMAGE
          </SwiperSlide>
        )}
      </Swiper>
    </SwiperWrap>
  );
}

export default WriteSwiper;
