import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Spin } from "antd";
import { useForm, Controller } from "react-hook-form";
import {
  IdcardOutlined,
  PhoneOutlined,
  UserOutlined,
  MailOutlined,
  CloudUploadOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";
import {
  addClient,
  getCountries,
  updateClient,
  showClient,
} from "../../services/clients";
import { useModal } from "../context/ModalContext";
import {
  useMutation,
  useQuery,
  useQueryClient,
  QueryClientProvider,
} from "react-query";
import PropTypes from "prop-types";
import TextArea from "antd/lib/input/TextArea";
import {useTranslation} from 'react-i18next'

const ClientForm = ({ id, disabled, addForm }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [enableQuery, setEnableQuery] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { close } = useModal();
  const { data: getCountriesResponse } = useQuery("getCountries", getCountries);
  const { data: showClientResponse, isLoading } = useQuery(
    ["showClient", id],
    () => showClient(id),
    {
      enabled: enableQuery,
    }
  );
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: showClientResponse?.data?.client });

  const addMutation = useMutation((data) => addClient(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("clients");
      setErrorMessage("");
      close();
    },
    onError: (error) => {
      queryClient.invalidateQueries("clients");
      setErrorMessage(error?.response?.data?.message);
    },
  });

  const editMutation = useMutation(
    ["editMutation", id],
    (data) => updateClient(data, id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("clients");
        setErrorMessage("");
        close();
      },
      onError: (error) => {
        console.log(error.response);
        setErrorMessage(error?.response?.data?.message);
      },
    }
  );

  const onSubmit = (data) => {
    if (!id) {
      addMutation.mutate({
        name:data.name,
        phone_no: data.phone_no,
        email: data.email,
        identification_document_no: data.identification_document_no,
        country_id: data.country_id,
        remarks: data.remarks
      });
      queryClient.invalidateQueries("clients");
    } else {
      let phone_number = parseInt(data.phone_no.split(' ').join(''))
      editMutation.mutate({
        name:data.name,
        phone_no: phone_number,
        email: data.email,
        identification_document_no: data.identification_document_no,
        country_id: data.country_id,
        remarks: data.remarks
      });
    }
  };

  useEffect(() => {
    reset(showClientResponse?.data?.client);
    setErrorMessage("");
  }, [showClientResponse?.data?.client, reset]);

  useEffect(() => {
    if (id) {
      setEnableQuery(true);
    }
    return () => {
      reset({});
    };
  }, [id, reset]);

  return (
    <QueryClientProvider client={queryClient}>
      <Spin spinning={isLoading}>
        <Form>
          <Form.Item label={t('name.1')}></Form.Item>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder={t('name.1')}
                autoComplete="off"
                disabled={disabled}
                prefix={<UserOutlined className="site-form-item-icon" />}
              />
            )}
            rules={{
              required: {
                value: true,
                message: t('plsEntNam.1'),
              },
              minLength: {
                value: 4,
                message: t('minLen.1'),
              },
              maxLength: {
                value: 30,
                message: t('maxLen30.1'),
              },
              pattern: {
                value: /^[a-z ,.'-]+$/i,
                message: t('plsEntValNam.1'),
              },
            }}
          />
          {errors?.name?.message !== "" ? (
            <span style={{color:'red', fontSize:'12px'}}>{errors?.name?.message}</span>
            ) : (
              <span></span>
              )}
          <Form.Item label={t('indentNumber.1')}></Form.Item>
          <Controller
          name="identification_document_no"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled={disabled}
                autoComplete="off"
                placeholder={t('indentNumber.1')}
                prefix={<IdcardOutlined className="site-form-item-icon" />}
              />
            )}
            rules={{
              required: {
                value: true,
                message: t('plsEntIdDocNO.1'),
              },
              pattern: {
                value: /^[0-9]{1,3}$/i,
                message:t('plsEntValId.1'),
              },
            }}
          />
          {errors?.identification_document_no?.message !== "" ? (
            <span style={{color:'red', fontSize:'12px'}}>
              {errors?.identification_document_no?.message}
            </span>
          ) : (
            <span></span>
          )}
          <Form.Item label={t('country.1')}></Form.Item>
          <Controller
            name="country_id"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                className="width"
                disabled={disabled}
                placeholder={t('chooseCountry.1')}
                options={getCountriesResponse?.data?.map((country) => {
                  return { value: country.id, label: country.name };
                })}
              />
            )}
            rules={{
              required: {
                value: true,
                message: t('plsSelCon.1'),
              },
            }}
          />
          {errors?.country_id?.message !== "" ? (
            <span style={{color:'red', fontSize:'12px'}}>{errors?.country_id?.message}</span>
          ) : (
            <span></span>
          )}
          <Form.Item label={t("phone.1")}></Form.Item>
          <Controller
            name="phone_no"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder={t("phone.1")}
                autoComplete="off"
                disabled={disabled}
                prefix={<PhoneOutlined className="site-form-item-icon" />}
              />
            )}
            rules={{
              required: {
                value: true,
                message: t('plsEntPhon.1'),
              },
              pattern: {
                value: /^(\+\d{1,3}\s)?\(?\d{2,3}\)?[\s.-]\d{3}[\s.-]\d{3}$/i,
                message: t('plsEntValPhon.1'),
              },
            }}
          />
          {errors?.phone_no?.message !== "" ? (
            <span style={{color:'red', fontSize:'12px'}}>{errors?.phone_no?.message}</span>
          ) : (
            <span></span>
          )}
          {addForm ? <></> : <>
          
          <Form.Item label={"First registration"}></Form.Item>
          <Controller
            name="date_of_first_reservation"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                autoComplete="off"
                disabled={true}
              />
            )}
            />
          {errors?.name?.message !== "" ? (
            <span style={{color:'red', fontSize:'12px'}}>{errors?.name?.message}</span>
          ) : (
            <span></span>
            )}
          <Form.Item label={"Last registration"}></Form.Item>
          <Controller
            name="date_of_last_reservation"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                autoComplete="off"
                disabled={true}
              />
            )}
          />
          {errors?.name?.message !== "" ? (
            <span style={{color:'red', fontSize:'12px'}}>{errors?.name?.message}</span>
            ) : (
            <span></span>
          )}
          </>}
          <Form.Item label="Email"></Form.Item>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled={disabled}
                autoComplete="off"
                placeholder="Email"
                prefix={<MailOutlined className="site-form-item-icon" />}
              />
            )}
            rules={{
              minLength: {
                value: 4,
                message: t('minLen.1'),
              },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t("plsEntValEmailCl.1"),
              },
              required: {
                value: true,
                message: t('plsInpEmail.1'),
              },
            }}
          />
          {errors?.email?.message !== "" ? (
            <span style={{color:'red', fontSize:'12px'}}>{errors?.email?.message}</span>
          ) : (
            <span></span>
          )}
          <Form.Item
            label={t("remarks.1")}
            tooltip={{
              title: t("optionalField.1"),
              icon: <InfoCircleOutlined />,
            }}
          ></Form.Item>
          <Controller
            name="remarks"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                disabled={disabled}
                placeholder={t("remarks.1")}
                showCount
                maxLength={255}
              />
            )}
          />
          <div style={{textAlign:'center', marginTop:'1em'}}>
            <Button
              icon={<CloudUploadOutlined className="site-form-item-icon" />}
              type="primary"
              disabled={disabled}
              onClick={handleSubmit(onSubmit)}
              htmlType="submit"
            >
              {t('submit.1')}
            </Button>
          </div>
        </Form>
        {errorMessage !== "" ? (
          <div>{errorMessage}</div>
        ) : null}
      </Spin>
    </QueryClientProvider>
  );
};

export default ClientForm;

ClientForm.propTypes = {
  id: PropTypes.number,
  disabled: PropTypes.bool,
};
