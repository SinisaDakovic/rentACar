import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Spin } from "antd";
import { useForm, Controller } from "react-hook-form";
import {
  IdcardOutlined,
  CalendarOutlined,
  InsertRowRightOutlined,
  EuroOutlined,
  CloudUploadOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { storeCar, getCarTypes, updateCar, showCar } from "../../services/cars";
import TextArea from "antd/lib/input/TextArea";
import { useMutation, useQuery, useQueryClient, QueryClientProvider } from "react-query";
import { useModal } from "../context/ModalContext";
import PropTypes from "prop-types";
import "antd/dist/antd.css";
import {useTranslation} from 'react-i18next'

const CarForm = ({ id, disabled }) => {
    
  const queryClient = useQueryClient();
  const [enableQuery, setEnableQuery] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { close } = useModal();
  const { data: getCarTypesResponse } = useQuery("getCarTypes", getCarTypes);
  const { data: showCarResponse, isLoading } = useQuery(
    ["showCar", id],
    () => showCar(id),
    {
      enabled: enableQuery,
    }
  );
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: showCarResponse?.data });

  const addMutation = useMutation((data) => storeCar(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("vehicle");
      setErrorMessage("");
      close();
    },
    onError: (error) => {
      setErrorMessage(error?.response?.data?.message);
    },
  });

  const editMutation = useMutation(
    ["editMutation", id],
    (data) => updateCar(data, id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("vehicle");
        setErrorMessage("");
        close();
      },
      onError: (error) => {
      queryClient.invalidateQueries("vehicle");
      console.log(error.response);
      setErrorMessage(error?.response?.data?.message);
      },
    }
  );

  const onSubmit = (data) => {
    if (!id) {
       
      addMutation.mutate({
        plate_no: data.plate_no,
        production_year: data.production_year,
        car_type_id: data.car_type_id,
        no_of_seats: data.no_of_seats,
        price_per_day: data.price_per_day,
        remarks: data.remarks,
        'photo[]': data.photo
      });
      queryClient.invalidateQueries("vehicle");
      setErrorMessage("");
      close();
    } else {
      let numberOfSeats = "" + data.no_of_seats
      let pricePerDay = "" + data.price_per_day
      let productionYear = "" + data.production_year
      editMutation.mutate({
        plate_no: data.plate_no,
        production_year: productionYear,
        car_type_id: data.car_type_id,
        no_of_seats: numberOfSeats,
        price_per_day: pricePerDay,
        remarks: data.remarks,
        'photo[]': data.photo
      });
      queryClient.invalidateQueries("vehicle");
      setErrorMessage("");
      close();
    }
  };

  useEffect(() => {
    reset(showCarResponse?.data);
    setErrorMessage("");
  }, [showCarResponse?.data, reset]);

  useEffect(() => {
    if (id) {
      setEnableQuery(true);
    }
    return () => {
      reset({});
    };
  }, [id, reset]);

  const { t } = useTranslation()

  return (
    <QueryClientProvider client={queryClient}>
      <Spin spinning={isLoading}>
        <Form>
          <Form.Item label={t('plateNum.1')}></Form.Item>
          <Controller
            name="plate_no"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled={disabled}
                autoComplete="off"
                placeholder={t('plateNum.1')}
                prefix={<IdcardOutlined className="site-form-item-icon" />}
              />
            )}
            rules={{
              required: {
                value: true,
                message: t('plsEntPlNo.1'),
              },
              // pattern: {
              //   value: /^[A-Z]{2,2} [A-Z0-9]{5,5}$/,
              //   message: t('plsEntValPlNo.1'),
              // },
            }}
          />
          {errors?.plate_no?.message !== "" ? (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors?.plate_no?.message}
            </span>
          ) : (
            <span></span>
          )}
          <Form.Item label={t('prodYear.1')}></Form.Item>
          <Controller
            name="production_year"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled={disabled}
                autoComplete="off"
                placeholder={t('prodYear.1')}
                prefix={<CalendarOutlined className="site-form-item-icon" />}
              />
            )}
            rules={{
              required: {
                value: true,
                message: t('plsEntProdYear.1'),
              },
              min: {
                value: 1950,
                message: t('prodYrCant.1'),
              },
              max: {
                value: new Date().getFullYear(),
                message: t('prdYrCantO.1'),
              },
            }}
          />
          {errors?.production_year?.message !== "" ? (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors?.production_year?.message}
            </span>
          ) : (
            <span></span>
          )}
          <Form.Item label={t('carType.1')}></Form.Item>
          <Controller
            name="car_type_id"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                className="width"
                disabled={disabled}
                placeholder={t('chooseType.1')}
                options={getCarTypesResponse?.data?.data.map((type) => {
                  return { value: type.id, label: type.name };
                })}
              />
            )}
            rules={{
              required: {
                value: true,
                message: t('plsSelCarT.1'),
              },
            }}
          />
          {errors?.car_type_id?.message !== "" ? (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors?.car_type_id?.message}
            </span>
          ) : (
            <span></span>
          )}
          <Form.Item label={t('noOfSeats.1')}></Form.Item>
          <Controller
            name="no_of_seats"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled={disabled}
                type="number"
                autoComplete="off"
                placeholder={t('noOfSeats.1')}
                prefix={
                  <InsertRowRightOutlined className="site-form-item-icon" />
                }
              />
            )}
            rules={{
              required: {
                value: true,
                message: t('plsEntNoSeat.1'),
              },
              pattern: {
                value: /^[0-9]{1,2}$/,
                message: t('plsEntValNoSeat.1'),
              },
              min: {
                value: 1,
                message: t('minNumSeats.1'),
              },
              max: {
                value: 55,
                message: t('maxNumSeats.1'),
              },
            }}
          />
          {errors?.no_of_seats?.message !== "" ? (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors?.no_of_seats?.message}
            </span>
          ) : (
            <span></span>
          )}
          <Form.Item label={t('pricePerD.1')}></Form.Item>
          <Controller
            name="price_per_day"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled={disabled}
                autoComplete="off"
                placeholder={t('pricePerD.1')}
                prefix={<EuroOutlined className="site-form-item-icon" />}
              />
            )}
            rules={{
              required: {
                value: true,
                message: t('plsEntPrcPD.1'),
              },
              min: {
                value: 30,
                message: t('minPrcPD.1'),
              },
              max: {
                value: 150,
                message: t('maxPrcPD.1'),
              },
              pattern: {
                value: /^[0-9]{1,3}$/,
                message: t('plsEntValPrcPD.1'),
              },
            }}
          />
          {errors?.price_per_day?.message !== "" ? (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors?.price_per_day?.message}
            </span>
          ) : (
            <span></span>
          )}
          <Form.Item
            label={t('remarks.1')}
            tooltip={{
              title: t('optionalField.1'),
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
                placeholder={t('remarks.1')}
                showCount
                maxLength={255}
              />
            )}
          />
          <Form.Item label={"Photo"}></Form.Item>
          <Controller
            name="photo"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled={disabled}
                autoComplete="off"
                type="file"
              />
            )}
          />
          {errors?.production_year?.message !== "" ? (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors?.production_year?.message}
            </span>
          ) : (
            <span></span>
          )}
          <div style={{ textAlign: "center", marginTop: "1em" }}>
            <Button
              icon={<CloudUploadOutlined className="site-form-item-icon" />}
              type="primary"
              onClick={handleSubmit(onSubmit)}
              disabled={disabled}
            >
             {t('submit.1')}
            </Button>
          </div>
        </Form>
        {errorMessage !== "" ? (
          <div style={{ color: "red", fontSize: "12px" }}>{errorMessage}</div>
        ) : null}
      </Spin>
    </QueryClientProvider>
  );
};

export default CarForm;

CarForm.propTypes = {
  id: PropTypes.number,
  disabled: PropTypes.bool,
};
