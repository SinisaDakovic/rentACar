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
import {useTranslation} from 'react-i18next'

const Cars = () => {
  const { t } = useTranslation()
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
      title: `${t('editCar.1')} - ${record?.id}`,
      content: <CarForm id={record?.id}/>,
    });
  };

  const {
    data: getCarsResponse,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(["vehicle", { search },1], getCars, {
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
      title: t('plateNum.1'),
    },
    {
      key: "production_year",
      dataIndex: "production_year",
      title: t('prodYear.1'),
    },
    {
      key: "car_type_id",
      title: t('carType.1'),
      render: (record) => record.car_type.name,
    },
    {
      key: "price_per_day",
      dataIndex: "price_per_day",
      title: t('pricePerD.1'),
    },
    {
      key: "no_of_seats",
      dataIndex: "no_of_seats",
      title: t('noOfSeats.1'),
    },
    { key: "remarks", dataIndex: "remarks", title: t('remarks.1'), ellipsis: true },
    {
      key: "edit",
      title: t('edit.1'),
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
          {t('edit.1')}
        </Button>
      ),
    },
    {
      key: "delete",
      title: t('delete.1'),
      render: (record) => (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            confirm({
              title: `${t('doYouWanDelCar.1')} ${record?.id}?`,
              icon: <DeleteFilled className="red" />,
              content: `${t("thisAcWill.1")} ${record?.id}!`,
              okType: "danger",
              onOk() {
                deleteMutation.mutate(record.id);
              },
              onCancel() {},
            });
          }}
          icon={<DeleteFilled className="red" />}
        >
          {t('delete.1')}
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
              title: t('addNewCarTitle.1'),
              content: <CarForm addForm={true}/>,
            })
          }
          icon={<PlusSquareOutlined/>}
        >
          {t('addCar.1')}
        </Button>
        <Search
          style={{ width: "250px" }}
          placeholder={t('search.1')}
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
                  title: `${t('infCar.1')} ${record?.id} - ${record?.plate_no}`,
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
