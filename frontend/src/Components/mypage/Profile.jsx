import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useParams,   } from "react-router-dom";
import NavBottom from "../nav/BottomNav"
import NavTop from "../nav/TopNav"
import { MyPageMainBox, MyPageMainImgBox, MyPageMainBtnBox, MypageResipeBox} from "./ProfileStyle"
import ResipeButton from "../mypage/ResipeList"
import axios from 'axios';
import { useRecoilValue } from "recoil";
import { userIdAtom } from "../../states";
import { TargetPostZone, TargetPostBox } from "./FollowerStyle";

const MyPageTemplate = () => {
  const [ userData, setUserData] = useState([])
  const [ targetUserData, setTargetUserData] = useState([])
  const [ myPostResipe, setMyPostResipe ] = useState([])
  const [ targetPostResipe, setTargetPostResipe ] = useState([])
  const [ myLikeResipe, setMyLikeResipe ] = useState([])
  const [ myCommentResipe, setMyCommentResipe ] = useState([])
  const [ myHistoryResipe, setHistoryResipe ] = useState([])
  let { userId } = useParams()
  const authId =  useRecoilValue(userIdAtom)

  console.log("유저", userId)
  console.log("로그인", authId)
  console.log("타켓", targetUserData)
  
  useEffect(()=>{
    fetch(`http://localhost:8080/user/${authId}/profile`)
      .then(response => response.json())
      .then(data => setUserData(data.user))
      
      .catch(err => console.log(err))
  },[]);
  
  useEffect(()=>{
    fetch(`http://localhost:8080/user/${userId}/profile`)
      .then(response => response.json())
      .then(data => setTargetUserData(data.user))
      
      .catch(err => console.log(err))
  },[]);


  useEffect(()=>{
    fetch(`http://localhost:8080/user/${authId}/post`)
      .then(response => response.json())
      .then(data => setMyPostResipe(data.userPosts))
    },[]);

  useEffect(()=>{
    fetch(`http://localhost:8080/user/${userId}/post`)
      .then(response => response.json())
      .then(data => setTargetPostResipe(data.userPosts))
    },[]);

  useEffect(()=>{
    fetch(`http://localhost:8080/user/${authId}/like`)
      .then(response => response.json())
      .then(data => setMyLikeResipe(data.likePosts))
    },[]);

  useEffect(()=>{
    fetch(`http://localhost:8080/user/${authId}/comment`)
      .then(response => response.json())
      .then(data => setMyCommentResipe(data.commentPosts))
    },[]);

  useEffect(()=>{
    fetch(`http://localhost:8080/user/${authId}/history`)
      .then(response => response.json())
      .then(data => setHistoryResipe(data.lastViewedPosts))
    },[]);


  async function followerCall() {
    await axios
      .post("/follow", {
      followerId : userId,
      headers: {
        "Content-Type": "application/json",
        },
      })
      .then((data) => alert("팔로우 성공"))
      .catch((err) => console.log(err));
  }


  return (
    <div>
      <NavTop />
        <MyPageMainBox style={{ marginTop: "80px", marginBottom: "90px" }}>
        { userId === authId 
        ?
          <MyPageMainImgBox inImgBox>
            <MyPageMainInfoBox>
              <div className="InfoProfile">
                <MyPageImage src={userData.profileImage ? userData.profileImage : "../../images/baseimage.png"}/>
                <p>{userData.nickName}</p>
              </div>
                <MyPageFollowBox className="followBox">
                   <div>
                      <p>게시글</p>
                      <span>{myPostResipe.length}</span>
                  </div>
                  <div>
                    <Link to="/">
                      <p>팔로워</p>
                      <span>{userData.numFollowers}</span>
                    </Link>
                  </div>
                  <div>
                    <Link to="/">
                      <p>팔로잉</p>
                      <span>{userData.numFollowees}</span>
                    </Link>
                  </div>
                </MyPageFollowBox>
            </MyPageMainInfoBox>
            <MyPageMainBtnBox >

              <Link to={`/user/${userData._id}/edit`}>
                <MyPageMainProfileEdit type="button" >프로필 수정</MyPageMainProfileEdit>
              </Link>

              <div style={{width: "100%", borderBottom : "1px solid #c5c5c5", marginBottom: "5px"}}>
              </div>
              <ResipeButton postResipe={myPostResipe} nums="0"/>
              <ResipeButton likeResipe={myLikeResipe} nums="1"/>
              <ResipeButton commentResipe={myCommentResipe} nums="2"/>
              <ResipeButton historyResipe={myHistoryResipe} nums="3"/>
              <div style={{width: "300px", height: "70px"}}></div>
              
            </MyPageMainBtnBox>
          </MyPageMainImgBox>
        : 
        <MyPageMainImgBox>
          <MyPageMainInfoBox>
            <div className="InfoProfile">
              <MyPageImage src={targetUserData.profileImage ? targetUserData.profileImage : "../../images/baseimage.png"}/>
              <p>{targetUserData.nickName}</p>
            </div>
          </MyPageMainInfoBox>

          <MyPageMainBtnBox>
            <MyPageMainProfileEdit type="button" onClick={followerCall}>팔로우 +</MyPageMainProfileEdit>
          </MyPageMainBtnBox>

          <div style={{width: "100%", borderBottom : "1px solid #c5c5c5", marginBottom: "20px"}} />
          <TargetPostBox>
            <TargetPostZone>
              { targetPostResipe.map((item) => {
                return (
                  <Link to={`/detail/${item.id}`}>
                    <img src={item.thumbnail}/>
                  </Link>
                )
              })}
            </TargetPostZone>
          </TargetPostBox>


        </MyPageMainImgBox>
        }
        </MyPageMainBox>
      <NavBottom />
    </div>
  
  );
};

const MyPageImage = styled.img`
  width: 115px;
  height: 115px;
  border-radius: 50%;

  + p {
    font-family: sans-serif;
    margin-top: 15px;
    font-size: 18px;
    font-weight: 500;
  }
`
const MyPageMainProfileEdit = styled.button`
  width: 315px;
  height: 45px;
  font-weight: bold;
  font-size: 16px;
  border-radius: 10px;
  background-color: #FEAE11;
  display: inline-block;
  outline: none;
  border: none;
  cursor: pointer;
  color: white;
  margin-top: 14px;
  margin-bottom: 30px;
`

const MyPageFollowBox = styled.div`
  width: 150px;
  height: 100px;
`

const MyPageMainInfoBox = styled.div`
  display: flex;
  justify-content: center;

  .InfoProfile {
    margin-left: 10px;
    width: 160px;

    p {
      font-size: 16px;
      margin: 8px 0 20px 0;
    }
  };

  .followBox {
    position: relative;
    border-radius: 10px;
    top: 10px;
    display: flex;
    justify-content: center;
    line-height: 5px;    
    align-items: center;
    width: 220px;
    color: gray;
    margin-right: 10px;
    div {
      a {
        color: gray;
        text-decoration: none;
      }

      margin-left: 10px;
      margin-right: 10px;
      margin-bottom: 15px;

      p {
        font-size: 14px;
      }

      span {
        color: black;
        font-weight: bold;
        font-size: 14px;
      }
    }
  }
`
export default MyPageTemplate;
