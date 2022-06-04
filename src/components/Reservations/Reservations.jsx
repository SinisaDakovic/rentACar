import React, {useEffect, useState} from "react";
import { useMutation, useInfiniteQuery, useQueryClient } from "react-query";
import { getReservations, deleteReservation } from "../../services/reservations";
import { Table, Button, Modal, Input } from "antd";
import { useModal } from "../context/ModalContext";
import ReservationForm from "../Reservations/ReservationForm";
import {
  DeleteFilled,
  EditFilled,
  PlusSquareOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";
import {useTranslation} from 'react-i18next'

const Reservations = () => {
  const { t } = useTranslation();
  const { open } = useModal();
  const { Search } = Input;
  const { confirm } = Modal;
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const deleteMutation = useMutation((id) => deleteReservation(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("reservations");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const editButtonClick = (record) => {
    open({
      title: `${t('editReserv.1')} - ${record?.id}`,
      content: <ReservationForm id={record?.id} />,
    });
  };

    const {
    data: getReservationsResponse,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(["reservations",{search}, 1], getReservations, {
    getNextPageParam: (lastPage) => {
      return lastPage.data.current_page === lastPage.data.last_page
        ? undefined
        : lastPage.data.current_page + 1;
    },
  });

  // useEffect(() => {
  //   let table = document.querySelector(".ant-table-body");
  //   table.addEventListener("scroll", (event) => {
  //     if (
  //       event.target.scrollTop ===
  //       event.target.scrollHeight - event.target.clientHeight
  //     ) {
  //       fetchNextPage();
  //     }
  //   });
  // });

  const columns = [
    {
      key: "client",
      dataIndex: ["client", "name"],
      title: t('clients.1'),
    },
    {
      key: "plate_no",
      dataIndex: ["vehicle", "plate_no"],
      title: t("plateNum.1"),
    },
    {
      key: "from_date",
      dataIndex: "from_date",
      title: t("fromDate.1"),
    },
    {
      key: "to_date",
      dataIndex: "to_date",
      title: t('toDate.1'),
    },
    {
      key: "rent_location",
      dataIndex: ["rent_location", "name"],
      title: t('pickUpLoc.1'),
    },
    {
      key: "return_location",
      dataIndex: ["return_location", "name"],
      title: t('dropOffLoc.1'),
    },
    {
      key: "total_price",
      dataIndex: "total_price",
      title: t('totPrice.1'),
    },
    {
      key: "edit",
      title: t('edit.1'),
      render: (record) => (
        <Button
          icon={<EditFilled className="site-form-item-icon blue" />}
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
              title: `${t('doYouWantToDel.1')} ${record?.id}?`,
              icon: <DeleteFilled className="red" />,
              content: `${t('thisActWillDel.1')} ${record?.id}!`,
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
      width: "120px",
    },
  ];

   const onSearch = (data) => {
    setSearch(data);
  };

  const newData = [];
  getReservationsResponse?.pages.forEach((page) => {
    newData.push(...page.data.data);
  });


  return (
    <div>
      <div className="buttons">
        <Button
          onClick={() =>
            open({
              title: t('addNewReserv.1'),
              content: <ReservationForm addForm={true}/>,
            })
          }
          icon={<PlusSquareOutlined />}
        >
          {t("addResrv.1")}
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
          pagination={false}
          dataSource={newData}
          rowKey={(record) => record?.id}
          onRow={(record) => {
            return {
              onClick: () => {
                open({
                  title: `${t('infoReserv.1')} - ${record?.id}`,
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
