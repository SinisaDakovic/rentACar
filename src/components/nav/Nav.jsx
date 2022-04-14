import React, { useState } from "react";
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
import { logout } from "../../services/account";
import { useMutation } from "react-query";
import PropTypes from "prop-types";
import Logo from '../../logo.png'

const { Header, Sider } = Layout;
const { SubMenu } = Menu;

const Navbar = ({ content }) => {

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

          <SubMenu key="options" icon={<SettingOutlined />} title="Options">
            <Menu.ItemGroup className="siderMenuGroup" title="Pages">
              <Menu.Item
                key="clients"
                icon={<TeamOutlined />}
                title="Clients"
                onClick={() => navigate("/clients")}
                >
                Clients
              </Menu.Item>
              <Menu.Item
                key="cars"
                icon={<CarOutlined />}
                title="Cars"
                onClick={() => navigate("/cars")}
                >
                Cars
              </Menu.Item>
              <Menu.Item
                key="reservations"
                icon={<SolutionOutlined />}
                title="Reservations"
                onClick={() => navigate("/reservations")}
                >
                Reservations
              </Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="Add">
              <Menu.Item
                key="option:1"
                icon={<TeamOutlined />}
                // onClick={() =>
                //   open({
                    //     title: `Add new car`,
                    //     content: <ClientForm />,
                    //   })
                    // }
                    >
                Add new Client
              </Menu.Item>
              <Menu.Item
                key="option:2"
                icon={<CarOutlined />}
                // onClick={() =>
                //   open({
                    //     title: `Add new car`,
                    //     content: <CarForm />,
                    //   })
                    // }
                    >
                Add new Car
              </Menu.Item>
              <Menu.Item key="option:3" icon={<SolutionOutlined />}>
                Add new Reservation
              </Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="Choose language">
              <Menu.Item key="option:4" icon={<ReadOutlined />}>
                MNE
              </Menu.Item>
              <Menu.Item key="option:5" icon={<ReadOutlined />}>
                ENG
              </Menu.Item>
            </Menu.ItemGroup>
          </SubMenu>
          </div>
          <Menu.Item key="user" icon={<UserOutlined />}>
            User:
          </Menu.Item>
          <Menu.Item
            key="logout"
            danger={true}
            icon={<LogoutOutlined />}
            onClick={() => {
                  logoutEvent();
                }}
                >
            Logout
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
              Clients
            </Menu.Item>
            <Menu.Item
              key="3"
              icon={<CarOutlined />}
              title="Cars"
              onClick={() => navigate("/cars")}
            >
              Cars
            </Menu.Item>
            <Menu.Item
              key="4"
              icon={<SolutionOutlined />}
              title="Reservations"
              onClick={() => navigate("/reservations")}
            >
              Reservations
            </Menu.Item>
          </Menu>
        </Sider>
        <Content>{content}</Content>
      </Layout>
    </Layout>
  );
};

export default Navbar;

Navbar.propTypes = {
  content: PropTypes.node,
};
