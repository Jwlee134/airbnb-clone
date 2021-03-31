import React, { useEffect } from "react";
import styled from "styled-components";
import Head from "next/head";
import Header from "components/header";
import { useDispatch } from "react-redux";
import { commonActions } from "store/common";
import { useRouter } from "next/router";
import Error from "pages/_error";
import RoomDetailSkeleton from "components/skeleton/RoomDetailSkeleton";
import { makeQueryString } from "utils";
import { searchActions } from "store/search";
import useRoom from "hooks/useRoom";
import dynamic from "next/dynamic";

import Photos from "./contents/Photos";
import BookingWindow from "./BookingWindow";
import Contents from "./contents";
import Title from "./title";
import Rating from "./rating";

const Map = dynamic(() => import("components/common/Map"), { ssr: false });

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  @media screen and (max-width: 1023px) {
    > div {
      padding: 24px 24px !important;
    }
  }
  > div {
    padding: 24px 80px;
    max-width: 1280px;
    margin: 0 auto;
    .detail_photo-container {
      img {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
    .detail_main-container {
      padding-top: 40px;
      display: flex;
      .detail_main-container_left {
        width: 64%;
      }
      .detail_main-container_right {
        width: 36%;
        margin-left: 90px;
      }
    }
    .detail_content-title {
      font-size: 24px;
      font-weight: 500;
      padding-bottom: 24px;
    }
    .detail_map-container {
      padding: 48px 0px;
      .detail_map-container_address {
        padding-bottom: 24px;
        font-weight: 300;
      }
      > div {
        max-height: 480px;
      }
    }
  }
`;

const RoomDetail = () => {
  const router = useRouter();
  const { query } = router;

  const { room, error } = useRoom();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!query) return;
    dispatch(
      searchActions.setSearch({
        ...query,
        id: "",
        adults: Number(query.adults) < 1 ? 1 : Number(query.adults),
        children: Number(query.children) < 0 ? 0 : Number(query.children),
        infants: Number(query.infants) < 0 ? 0 : Number(query.infants),
      })
    );
    dispatch(commonActions.setShowMiniSearchBar(true));
    dispatch(commonActions.setShowSearchBar(false));
    if (Number(query.adults) < 1) {
      router.push(
        `/room/${query.id}${makeQueryString({
          ...query,
          id: "",
          adults: "1",
        })}`
      );
    }
    if (Number(query.children) < 0) {
      router.push(
        `/room/${query.id}${makeQueryString({
          ...query,
          id: "",
          children: "0",
        })}`
      );
    }
    if (Number(query.infants) < 0) {
      router.push(
        `/room/${query.id}${makeQueryString({
          ...query,
          id: "",
          infants: "0",
        })}`
      );
    }
  }, [query]);

  if (error) {
    return (
      <Error statusCode={error.response.status} message={error.response.data} />
    );
  }

  if (!room) {
    return (
      <>
        <Head>
          <title>숙소, 체험, 장소를 모두 한 곳에서 - 에어비앤비</title>
        </Head>
        <HeaderContainer>
          <Header />
        </HeaderContainer>
        <Container>
          <RoomDetailSkeleton />
        </Container>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{room.title}</title>
      </Head>
      <HeaderContainer>
        <Header />
      </HeaderContainer>
      <Container>
        <div>
          <Title />
          <div className="detail_photo-container">
            <Photos photos={room.photos} />
          </div>
          <div className="detail_main-container">
            <div className="detail_main-container_left">
              <Contents />
            </div>
            <div className="detail_main-container_right">
              <BookingWindow />
            </div>
          </div>
          <Rating />
          <div className="detail_map-container">
            <div className="detail_content-title">위치</div>
            <div className="detail_map-container_address">
              {room.streetAddress}, {room.city}, {room.province}, {room.country}
            </div>
            <Map
              room={room}
              useFitBounds
              useInteractiveMarker={false}
              gestureHandling="auto"
            />
          </div>
        </div>
      </Container>
    </>
  );
};

export default RoomDetail;
