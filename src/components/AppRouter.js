import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { useState } from "react";
import Items from "../routes/Items";
import StuffDetail from "../routes/StuffDetail";
import NoMatch from "../routes/NoMatch";
import WritingStuff from "../routes/WritingStuff";
import EditProfile from "../routes/EditProfile";
import Gps from "../routes/Gps";
import SalePage from "../routes/SalePage";
import BuyPage from "../routes/BuyPage";
import LikePage from "../routes/LikePage";
import Review from "../routes/Review";
import SellerProfile from "../routes/SellerProfile";
import { useSelector } from "react-redux";
import ChatRoom from "../routes/ChatRoom";
import NoticeRoom from "../routes/NoticeRoom";
import ChatList from "../routes/ChatList";
import ReviewWrite from "../routes/ReviewWrite";
import EditingStuff from "../routes/EditingStuff";

const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
  const [list, setList] = useState();
  const [tags, setTags] = useState();
  const { user } = useSelector(({ user }) => ({
    user: user.currentUser,
  }));
  const tagsState = (args) => {
    setTags(args);
    console.log("tagState", args);
  };
  const listState = (args) => {
    setList(args);
  };
  console.log(list);

  return (
    <>
      <Router>
        <Navigation listState={listState} setList={setList} list={list} />

        <Routes>
          {isLoggedIn && (
            <>
              <Route path="/writeReview/:id" element={<ReviewWrite />} />
              <Route
                path="/chatlist"
                element={<ChatList refreshUser={refreshUser} />}
              />
              <Route
                path="/chatroom"
                element={<ChatRoom refreshUser={refreshUser} />}
              />
              <Route
                path="/noticeroom"
                element={<NoticeRoom refreshUser={refreshUser} />}
              />
              <Route path="/seller_profile/:uid" element={<SellerProfile />} />
              <Route path="/sale" element={<SalePage />} />
              <Route path="/review/:id" element={<Review />} />
              <Route path="/buy" element={<BuyPage />} />
              <Route path="/like" element={<LikePage />} />
              <Route
                path="/profile"
                element={<Profile refreshUser={refreshUser} />}
              />
              <Route path="/gps" element={<Gps></Gps>} />
              <Route
                path="/edit_profile"
                element={<EditProfile refreshUser={refreshUser} />}
              />
              <Route path="/*" element={<Navigate replace to="/" />} />
              <Route
                path="/writeItem"
                element={<WritingStuff tagsState={tagsState} tags={tags} />}
              />
              <Route
                path="/editItem"
                element={<EditingStuff tagsState={tagsState} tags={tags} />}
              />
            </>
          )}
          <>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Home />} />
            <Route
              path="items/*"
              element={<Items listState={listState} list={list} />}
            />
            <Route path="items/:id" element={<StuffDetail />} />
            <Route path="/*" element={<Navigate replace to="/" />} />
          </>
        </Routes>
      </Router>
    </>
  );
};

export default AppRouter;
