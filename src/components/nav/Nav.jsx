import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import {
  LogoutOutlined,
  TeamOutlined,
  UserOutlined,
  SolutionOutlined,
  SettingOutlined,
  ReadOutlined,
  CarOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";
import { useNavigate } from "react-router-dom";
import { Content } from "antd/lib/layout/layout";
import { getAccountData, logout } from "../../services/account";
import { useMutation } from "react-query";
import PropTypes from "prop-types";
import Logo from '../../logo.png'
import {useModal} from '../context/ModalContext'
import CarForm from '../Cars/CarForm'
import ClientForm from '../Clients/ClientForm'
import ReservationForm from '../Reservations/ReservationForm'
import {useTranslation} from 'react-i18next'

const { Header, Sider } = Layout;
const { SubMenu } = Menu;

const Nav = ({ content }) => {

  const { open } = useModal();

  const [collapsed, setCollapsed] = useState(true);

    const navigate = useNavigate();

  const logoutMutation = useMutation(() => logout(), {
    onSuccess: () => {
      localStorage.clear();
      navigate("/");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const logoutEvent = () => {
    logoutMutation.mutate();
  };

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const accountDataMutation = useMutation(() => getAccountData(), {
    onSuccess: (res) => {
      setUser(res?.data?.name)     
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const [user, setUser] = useState('')

  useEffect(() => {
    try{
      accountDataMutation.mutate()

    }catch(err){
      console.log(err)
    }
  }, [])


  const { t, i18n } = useTranslation()

  const translate = (language) => {
      i18n.changeLanguage(language)
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header>
        <Menu mode="horizontal" theme={"dark"}>
          <Menu.Item
            key="logo"
            onClick={() => navigate("/home")}
          >
            <img src={Logo} alt="Logo" height="50px" width="150px"/>
          </Menu.Item>

          <div>

          <SubMenu key="options" icon={<SettingOutlined />} title={t('options.1')}>
            <Menu.ItemGroup className="siderMenuGroup" title={t('pages.1')}>
              <Menu.Item
                key="clients"
                icon={<TeamOutlined />}
                title="Clients"
                onClick={() => navigate("/clients")}
                >
                {t('client.1')}
              </Menu.Item>
              <Menu.Item
                key="cars"
                icon={<CarOutlined />}
                title="Cars"
                onClick={() => navigate("/cars")}
                >
                {t('cars.1')}
              </Menu.Item>
              <Menu.Item
                key="reservations"
                icon={<SolutionOutlined />}
                title="Reservations"
                onClick={() => navigate("/reservations")}
                >
                {t('reserv.1')}
              </Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title={t('add.1')}>
              <Menu.Item
                key="option:1"
                icon={<TeamOutlined />}
                onClick={() =>
                  open({
                    title: t('addNewClientTitle.1'),
                    content: <ClientForm />,
                  })}
                    >
                {t('addNewClient.1')}
              </Menu.Item>
              <Menu.Item
                key="option:2"
                icon={<CarOutlined />}
                onClick={() =>
                  open({
                    title: t('addNewCarTitle.1'),
                    content: <CarForm />,
                  })}
                    >
                {t('addNewCar.1')}
              </Menu.Item>
              <Menu.Item 
               key="option:3"
               icon={<SolutionOutlined />}
               onClick={() =>
                  open({
                    title: t('addNewReserv.1'),
                    content: <ReservationForm />,
                  })}
              >
                {t('addNewReserv.1')}
              </Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title={t('chooseLang.1')}>
              <Menu.Item
               key="option:4"
               icon={<ReadOutlined />}
               onClick={() => translate('mne')}
               >
                MNE
              </Menu.Item>
              <Menu.Item
               key="option:5"
               icon={<ReadOutlined />}
               onClick={() => translate('en')}
               >
                ENG
              </Menu.Item>
            </Menu.ItemGroup>
          </SubMenu>
          </div>
          <Menu.Item key="user" icon={<UserOutlined />}>
            {t('usr.1')}: {user}
          </Menu.Item>
          <Menu.Item
            key="logout"
            danger={true}
            icon={<LogoutOutlined />}
            onClick={() => {
                  logoutEvent();
                }}
                >
            {t('logOut.1')}
          </Menu.Item>
        </Menu>
      </Header>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={onCollapse}
          breakpoint="lg"
          onBreakpoint={onCollapse}
        >
          <Menu theme="dark" mode="inline">
            <Menu.Item
              key="2"
              icon={<TeamOutlined />}
              title="Clients"
              onClick={() => navigate("/clients")}
            >
              {t('client.1')}
            </Menu.Item>
            <Menu.Item
              key="3"
              icon={<CarOutlined />}
              title="Cars"
              onClick={() => navigate("/cars")}
            >
              {t('cars.1')}
            </Menu.Item>
            <Menu.Item
              key="4"
              icon={<SolutionOutlined />}
              title="Reservations"
              onClick={() => navigate("/reservations")}
            >
              {t('reserv.1')}
            </Menu.Item>
          </Menu>
        </Sider>
        <Content>{content}</Content>
      </Layout>
    </Layout>
  );
};

export default Nav;

Nav.propTypes = {
  content: PropTypes.node,
};
