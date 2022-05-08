import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Inner } from "../components/layout/Inner";
import SaleHeader from "../components/layout/sale/SaleHeader";
import SaleBtnList from "../components/layout/sale/SaleBtnList";
import SaleStuff from "../components/layout/sale/SaleStuff";
import { MobileContainer } from "../components/common/MobileContainer";
import { MobileInner } from "../components/common/MobileInner";
import { useSelector } from "react-redux";
import axios from "axios";

const SaleWrap = styled.div`
  display: block;
`;

const DepthInner = styled.div`
  min-height: calc(100vh);
  background: rgb(250, 250, 250);
`;

const SaleInner = styled(Inner)`
  background: rgb(250, 250, 250);
`;

const SalePage = () => {
  const { userObj } = useSelector(({ user }) => ({
    userObj: user.currentUser,
  }));
  const [tab, setTab] = useState(1);
  const user = userObj;
  const [reset, setReset] = useState(false);
  const [item, setItem] = useState([]);
  const onClick = (id) => setTab(id);
  const history = useNavigate();
  const render = (render) => {
    setReset(render);
  };
  useEffect(() => {
    axios
      .get("/sale")
      .then((result) => {
        setItem(result.data.data);
      })
      .catch((reason) => {
        console.log(reason);
      });
  }, [reset]);
  return (
    <MobileContainer>
      <MobileInner>
        <SaleWrap>
          <SaleHeader history={history} tab={tab} onClick={onClick} />
          <DepthInner>
            {tab === 1 &&
              item.map((item, i) => {
                const {
                  region,
                  img,
                  title,
                  content,
                  price,
                  id,
                  status,
                  afterDate,
                } = item;
                if (item.status == "ING") {
                  if (i > 10) {
                    return;
                  }

                  return (
                    <div key={i}>
                      <SaleInner>
                        <SaleStuff
                          no={id}
                          thumb={img}
                          matter={{
                            title: title,
                            content: content,
                            price: price,
                          }}
                          status={status}
                          reset={reset}
                          render={render}
                          time={afterDate}
                          creatorId={userObj.uid}
                          region={region}
                          page="sale"
                        />
                      </SaleInner>
                      <SaleBtnList
                        no={id}
                        reset={reset}
                        render={render}
                        page="sale"
                      />
                    </div>
                  );
                }
              })}
            {tab === 2 &&
              item.map((item, i) => {
                const {
                  region,
                  img,
                  title,
                  content,
                  price,
                  id,
                  status,
                  afterDate,
                } = item;
                if (item.status == "END") {
                  if (i > 10) {
                    return;
                  }

                  return (
                    <div key={i}>
                      <SaleInner>
                        <SaleStuff
                          no={id}
                          thumb={img}
                          matter={{
                            title: title,
                            content: content,
                            price: price,
                          }}
                          status={status}
                          reset={reset}
                          render={render}
                          time={afterDate}
                          creatorId={userObj.uid}
                          region={region}
                          page="sale"
                        />
                      </SaleInner>
                    </div>
                  );
                }
              })}
          </DepthInner>
        </SaleWrap>
      </MobileInner>
    </MobileContainer>
  );
};

export default SalePage;
