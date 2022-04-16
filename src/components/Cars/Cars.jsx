import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient, useInfiniteQuery } from "react-query";
import { getCars, deleteCar } from "../../services/cars";
import { Table, Button, Modal, Input } from "antd";
import { useModal } from "../context/ModalContext";
import CarForm from "../Cars/CarForm";
import {
  DeleteFilled,
  EditFilled,
  PlusSquareOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";

const Cars = () => {
  const queryClient = useQueryClient();
  const { open } = useModal();
  const { confirm } = Modal;
  const { Search } = Input;
  const [search, setSearch] = useState("");

  const deleteMutation = useMutation((id) => deleteCar(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("vehicle");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const editButtonClick = (record) => {
    open({
      title: `Edit car - ${record?.id}`,
      content: <CarForm id={record?.id} />,
    });
  };

  const {
    data: getCarsResponse,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(["vehicle", { search },2], getCars, {
    getNextPageParam: (lastPage) => {
      return lastPage.data.current_page === lastPage.data.last_page
        ? undefined
        : lastPage.data.current_page + 1;
    },
  });

  useEffect(() => {
    let table = document.querySelector(".ant-table-body");
    table.addEventListener("scroll", (event) => {
      if (
        event.target.scrollTop ===
        event.target.scrollHeight - event.target.clientHeight
      ) {
        fetchNextPage();
      }
    });
  });

  const columns = [
    { key: "id", dataIndex: "id", title: "ID" },
    {
      key: "plate_no",
      dataIndex: "plate_no",
      title: "Plate number",
    },
    {
      key: "production_year",
      dataIndex: "production_year",
      title: "Production year",
    },
    {
      key: "car_type_id",
      title: "Car type",
      render: (record) => record.car_type.name,
    },
    {
      key: "price_per_day",
      dataIndex: "price_per_day",
      title: "Price per day",
    },
    {
      key: "no_of_seats",
      dataIndex: "no_of_seats",
      title: "Number of seats",
    },
    { key: "remarks", dataIndex: "remarks", title: "Remarks", ellipsis: true },
    {
      key: "edit",
      title: "Edit",
      render: (record) => (
        <Button
          icon={
            <EditFilled
              className="site-form-item-icon blue"
            />
          }
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
              title: `Do you want to delete car ${record?.id}?`,
              icon: <DeleteFilled className="red" />,
              content: `This action will also delete all reservations tied to car ${record?.id}!`,
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
    },
  ];

  const onSearch = (data) => {
    setSearch(data);
  };

  const newData = [];
  getCarsResponse?.pages.forEach((page) => {
    newData.push(...page.data.data);
  });

  return (
    <div>
      <div className="buttons">
        <Button
          onClick={() =>
            open({
              title: `Add new car`,
              content: <CarForm />,
            })
          }
          icon={<PlusSquareOutlined/>}
        >
          Add Car
        </Button>
        <Search
          style={{ width: "250px" }}
          placeholder="Search"
          onSearch={onSearch}
          loading={isFetching}
          allowClear
        />
      </div>
      <div>
        <Table
          columns={columns}
          dataSource={newData}
          loading={isFetchingNextPage}
          scroll={{ x: "1200px", y: "500px" }}
          pagination={false}
          rowKey={(record) => record?.id}
          onRow={(record) => {
            return {
              onClick: () => {
                open({
                  title: `Info car ${record?.id} - ${record?.plate_no}`,
                  content: <CarForm id={record?.id} disabled={true} />,
                });
              },
            };
          }}
        />
      </div>
    </div>
  );
};

export default Cars;
