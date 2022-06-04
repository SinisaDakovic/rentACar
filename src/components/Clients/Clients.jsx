import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input } from "antd";
import { useModal } from "../context/ModalContext";
import ClientForm from "../Clients/ClientForm";
import { useMutation, useInfiniteQuery, useQueryClient } from "react-query";
import { getClients, deleteClient } from "../../services/clients";
import {
  DeleteFilled,
  EditFilled,
  PlusSquareOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";
import '../Clients/clients.css'
import {useTranslation} from 'react-i18next'

const Clients = () => {

const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { open } = useModal();
  const { confirm } = Modal;
  const { Search } = Input;
  const [search, setSearch] = useState("");


  const deleteMutation = useMutation((id) => deleteClient(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("clients");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const editButtonClick = (id) => {
    open({
      title: `${t('editClient.1')} - ${id}`,
      content: <ClientForm id={id} />,
    });
  };

    const {
    data: getClientsResponse,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(["clients", { search },1], getClients, {
    getNextPageParam: (lastPage) => {
      return lastPage.data.current_page === lastPage.data.last_page
        ? undefined
        : lastPage.data.current_page + 1;
    },
  });

  useEffect(() => {
    let data = document.querySelector(".ant-table-body");
    data.addEventListener("scroll", (event) => {
      if (
        event.target.scrollTop ===
        event.target.scrollHeight - event.target.clientHeight
      ) {
        fetchNextPage();
      }
    });
  });

  console.log(getClientsResponse)
  const columns = [
    {
      key: "identification_document_no",
      dataIndex: "identification_document_no",
      title: t('numIndentDoc.1'),
    },
    { key: "name", dataIndex: "name", title: t('name.1') },
    {
      key: "phone_no",
      dataIndex: "phone_no",
      title: t('phone.1'),
    },
    { key: "email", dataIndex: "email", title: "Email" },
    {
      key: "date_of_first_reservation",
      dataIndex: "date_of_first_reservation",
      title: t('dateOfFirstRes.1'),
    },
    {
      key: "date_of_last_reservation",
      dataIndex: "date_of_last_reservation",
      title: t('dateOfLastRes.1'),
    },
    {
      key: "country_id",
      dataIndex: ["country", "name"],
      title: t('country.1'),
    },
    {
      key: "remarks",
      dataIndex: "remarks",
      title: t('remarks.1'),
      ellipsis: true,
    },
    {
      key: "edit",
      title: t('edit.1'),
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
            if (record?.user?.id) {
              confirm({
                title: `${t('doYouWantToDelCli.1')} ${record?.name}?`,
                icon: <DeleteFilled/>,
                okType: "danger",
                onOk() {
                  deleteMutation.mutate(record.user.id)
                },
                onCancel() {
                  console.log("Cancel");
                },
              });
            } else {
              confirm({
                title: t('thisUsrDontHaveCli.1'),
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
          {t('delete.1')}
        </Button>
      ),
    },
  ];

  const onSearch = (data) => {
    setSearch(data);
  };

   const newData = [];
  getClientsResponse?.pages.forEach((page) => {
    newData.push(...page.data.data);
  });


  return (
    <div>
      <div className="buttons">
        <Button
          onClick={() =>
            open({
              title: t('addNewClientTitle.1'),
              content: <ClientForm addForm={true}/>,
            })
          }
          icon={<PlusSquareOutlined/>}
        >
          {t('addClient.1')}
        </Button>
        <Search
          style={{ width: "250px" }}
          placeholder={t('search.1')}
          onSearch={onSearch}
          allowClear
        />
      </div>
      <div>
        <Table
          columns={columns}
          dataSource={newData}
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
