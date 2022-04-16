import React, { useState } from "react";
import { Table, Button, Modal, Input } from "antd";
import { useModal } from "../context/ModalContext";
import ClientForm from "../Clients/ClientForm";
import {
  DeleteFilled,
  EditFilled,
  PlusSquareOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";
import '../Clients/clients.css'

const Clients = () => {

  //Komponenta nije do kraja funkcionalna

  const { open } = useModal();
  const { confirm } = Modal;
  const { Search } = Input;
  const [search, setSearch] = useState("");

  const editButtonClick = (id) => {
    open({
      title: `Edit client - ${id}`,
      content: <ClientForm id={id} />,
    });
  };

  const columns = [
    {
      key: "identification_document_no",
      dataIndex: "identification_document_no",
      title: "Number od identification document",
    },
    { key: "name", dataIndex: "name", title: "Name" },
    {
      key: "phone_no",
      dataIndex: "phone_no",
      title: "Phone",
    },
    { key: "email", dataIndex: "email", title: "Email" },
    {
      key: "date_of_first_reservation",
      dataIndex: "date_of_first_reservation",
      title: "Date of first reservation",
    },
    {
      key: "date_of_last_reservation",
      dataIndex: "date_of_last_reservation",
      title: "Date of last reservation",
    },
    {
      key: "country_id",
      dataIndex: ["country", "name"],
      title: "Country",
    },
    {
      key: "remarks",
      dataIndex: "remarks",
      title: "Remarks",
      ellipsis: true,
    },
    {
      key: "edit",
      title: "Edit",
      render: (record) => (
        <Button
          icon={
            <EditFilled
              className="site-form-item-icon"
            />
          }
          onClick={(e) => {
            e.stopPropagation();
            if (record?.user?.id) {
              editButtonClick(record?.user.id);
            } else {
              confirm({
                title: "This user dont have client data.",
                icon: <ExclamationCircleOutlined />,
                onOk() {
                  console.log("OK");
                },
                onCancel() {
                  console.log("Cancel");
                },
              });
            }
          }}
        >
          Edit
        </Button>
      ),
    },
    {
      key: "delete",
      title: "Delete",
      render: (record) => (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            if (record?.user?.id) {
              confirm({
                title: `Do you want to delete client ${record?.name}?`,
                icon: <DeleteFilled/>,
                okType: "danger",
                onOk() {
                  console.log("OK");
                },
                onCancel() {
                  console.log("Cancel");
                },
              });
            } else {
              confirm({
                title: "This user dont have client data. You cant delete it.",
                icon: <ExclamationCircleOutlined />,
                onOk() {
                  console.log("OK");
                },
                onCancel() {
                  console.log("Cancel");
                },
              });
            }
          }}
          icon={<DeleteFilled/>}
        >
          Delete
        </Button>
      ),
    },
  ];

  const onSearch = (data) => {
    setSearch(data);
  };


  return (
    <div>
      <div className="buttons">
        <Button
          onClick={() =>
            open({
              title: `Add new client`,
              content: <ClientForm />,
            })
          }
          icon={<PlusSquareOutlined/>}
        >
          Add Client
        </Button>
        <Search
          style={{ width: "250px" }}
          placeholder="Search"
          onSearch={onSearch}
          allowClear
        />
      </div>
      <div>
        <Table
          columns={columns}
          scroll={{ x: "1200px", y: "500px" }}
          pagination={false}
          rowKey={(record) => record?.id}
          onRow={(record) => {
            return {
              onClick: () => {
                if (record?.user?.id) {
                  open({
                    title: `Info - ${record?.name}`,
                    content: (
                      <ClientForm id={record?.user?.id} disabled={true} />
                    ),
                  });
                } else {
                  confirm({
                    title: "This user dont have client data.",
                    icon: <ExclamationCircleOutlined />,
                    onOk() {
                      console.log("OK");
                    },
                    onCancel() {
                      console.log("Cancel");
                    },
                  });
                }
              },
            };
          }}
        />
      </div>
    </div>
  );
};

export default Clients;
