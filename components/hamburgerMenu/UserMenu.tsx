import React from "react";
import styled from "styled-components";
import {
  IoSettingsOutline,
  IoHomeOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import Link from "next/link";
import palette from "styles/palette";
import useSocket from "hooks/useSocket";
import { logoutAPI } from "lib/api/auth";
import useUser from "hooks/useUser";
import MenuHeader from "./MenuHeader";

const Container = styled.div`
  .user-menu_items {
    display: flex;
    height: calc(100vh - 128px);
    flex-direction: column;
    justify-content: space-between;
  }
  .user-menu_list {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    font-weight: 300;
    svg {
      margin-right: 10px;
    }
  }
  .user-menu_logout {
    border-top: 1px solid ${palette.gray_f7};
  }
  @media ${({ theme }) => theme.device.tabletSmall} {
    width: 300px;
  }
  @media ${({ theme }) => theme.device.mobile} {
    width: 70vw;
  }
`;

const UserMenu = ({ closeMenu }: { closeMenu: () => void }) => {
  const { mutateUser } = useUser();

  const handleLogout = () => {
    closeMenu();
    mutateUser(async () => {
      const { data } = await logoutAPI();
      return data;
    }, false);
  };

  return (
    <Container>
      <MenuHeader onClick={closeMenu}>사용자 메뉴</MenuHeader>
      <div className="user-menu_items">
        <div>
          <Link href="/become-a-host/building">
            <a>
              <div className="user-menu_list">
                <IoHomeOutline size={20} />
                숙소 등록
              </div>
            </a>
          </Link>
          <Link href="/management">
            <a>
              <div className="user-menu_list">
                <IoSettingsOutline size={20} />
                숙소 관리
              </div>
            </a>
          </Link>
        </div>
        <div className="user-menu_logout" onClick={handleLogout}>
          <div className="user-menu_list">
            <IoLogOutOutline size={22} />
            로그아웃
          </div>
        </div>
      </div>
    </Container>
  );
};

export default UserMenu;
