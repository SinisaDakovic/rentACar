import React from "react";
import { useMutation } from "react-query";
import {
  deleteReservation,
} from "../../services/reservations";
import { Table, Button, Modal, Input } from "antd";
import { useModal } from "../context/ModalContext";
import ReservationForm from "../Reservations/ReservationForm";
import { DeleteFilled, EditFilled, PlusSquareOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";

const Reservations = () => {

    

  const { open } = useModal();
  const { Search } = Input;
  const { confirm } = Modal;

  const deleteMutation = useMutation((id) => deleteReservation(id), {
    onSuccess: () => {
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const editButtonClick = (record) => {
    open({
      title: `Edit reservation - ${record?.id}`,
      content: <ReservationForm id={record?.id} />,
    });
  };

  const columns = [
    {
      key: "client",
      dataIndex: ["client", "name"],
      title: "Client",
    },
    {
      key: "plate_no",
      dataIndex: ["vehicle", "plate_no"],
      title: "Plate number",
    },
    {
      key: "from_date",
      dataIndex: "from_date",
      title: "From date",
    },
    {
      key: "to_date",
      dataIndex: "to_date",
      title: "To date",
    },
    {
      key: "rent_location",
      dataIndex: ["rent_location", "name"],
      title: "Pick-up location",
    },
    {
      key: "return_location",
      dataIndex: ["return_location", "name"],
      title: "Drop-off location",
    },
    {
      key: "total_price",
      dataIndex: "total_price",
      title: "Total price",
    },
    {
      key: "edit",
      title: "Edit",
      render: (record) => (
        <Button
          icon={<EditFilled className="site-form-item-icon blue" />}
          onClick={(e) => {
            e.stopPropagation();
            editButtonClick(record);
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
            confirm({
              title: `Do you want to delete reservation ${record?.id}?`,
              icon: <DeleteFilled className="red" />,
              content: `This action will delete reservation ${record?.id}!`,
              okType: "danger",
              onOk() {
                deleteMutation.mutate(record.id);
              },
              onCancel() {},
            });
          }}
          icon={<DeleteFilled className="red" />}
        >
          Delete
        </Button>
      ),
      width: "120px",
    },
  ];


  return (
    <div>
      <div className="buttons">
           <Button
          onClick={() =>
            open({
              title: `Add new reservation`,
              content: <ReservationForm />,
            })
          }
          icon={<PlusSquareOutlined/>}
        >
          Add Reservation
        </Button>
        <Search
          style={{ width: "250px" }}
          placeholder="Search"
          allowClear
        />
      </div>
      <div>
        <Table
          columns={columns}
          pagination={false}
          rowKey={(record) => record?.id}
          onRow={(record) => {
            return {
              onClick: () => {
                open({
                  title: `Info reservation - ${record?.id}`,
                  content: <ReservationForm id={record?.id} disabled={true} />,
                });
              },
            };
          }}
        />
      </div>
    </div>
  );
};

export default Reservations;
