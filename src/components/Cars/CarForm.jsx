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
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useModal } from "../context/ModalContext";
import PropTypes from "prop-types";
import "antd/dist/antd.css";

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
      console.log(error);
      if (
        error?.response?.data?.message ===
        "Invalid argument supplied for foreach()"
      ) {
        queryClient.invalidateQueries("vehicle");
        setErrorMessage("");
        close();
      } else {
        setErrorMessage(error?.response?.data?.message);
      }
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
        if (
          error?.response?.data?.message ===
          "Invalid argument supplied for foreach()"
        ) {
          queryClient.invalidateQueries("vehicle");
          setErrorMessage("");
          close();
        } else {
          setErrorMessage(error?.response?.data?.message);
        }
      },
    }
  );

  const onSubmit = (data) => {
    if (!id) {
      addMutation.mutate(data);
    } else {
      let year = "" + data.production_year;
      editMutation.mutate({
        plate_no: data.plate_no,
        production_year: year,
        car_type_id: data.car_type_id,
        no_of_seats: data.no_of_seats,
        price_per_day: data.price_per_day,
        remarks: data.remarks,
      });
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

  return (
    <>
      <Spin spinning={isLoading}>
        <Form>
          <Form.Item label="Plate number"></Form.Item>
          <Controller
            name="plate_no"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled={disabled}
                autoComplete="off"
                placeholder="Plate number"
                prefix={<IdcardOutlined className="site-form-item-icon" />}
              />
            )}
            rules={{
              required: {
                value: true,
                message: "Please enter plate number!",
              },
              pattern: {
                value: /^[A-Z]{2,2} [A-Z0-9]{5,5}$/,
                message: "Please enter a valid plate number (ex AB AB123)",
              },
            }}
          />
          {errors?.plate_no?.message !== "" ? (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors?.plate_no?.message}
            </span>
          ) : (
            <span></span>
          )}
          <Form.Item label="Production year"></Form.Item>
          <Controller
            name="production_year"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled={disabled}
                autoComplete="off"
                placeholder="Production year"
                prefix={<CalendarOutlined className="site-form-item-icon" />}
              />
            )}
            rules={{
              required: {
                value: true,
                message: "Please enter production year!",
              },
              min: {
                value: 1950,
                message: "Production year cant be under 1950!",
              },
              max: {
                value: new Date().getFullYear(),
                message: "Production year cant be over this year!",
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
          <Form.Item label="Car type"></Form.Item>
          <Controller
            name="car_type_id"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                className="width"
                disabled={disabled}
                placeholder="-- Choose type --"
                options={getCarTypesResponse?.data?.data.map((type) => {
                  return { value: type.id, label: type.name };
                })}
              />
            )}
            rules={{
              required: {
                value: true,
                message: "Please select car type!",
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
          <Form.Item label="No of seats"></Form.Item>
          <Controller
            name="no_of_seats"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled={disabled}
                autoComplete="off"
                placeholder="Number of seats"
                prefix={
                  <InsertRowRightOutlined className="site-form-item-icon" />
                }
              />
            )}
            rules={{
              required: {
                value: true,
                message: "Please enter number of seats!",
              },
              pattern: {
                value: /^[0-9]{1,2}$/,
                message: "Please enter a valid number of seats",
              },
              min: {
                value: 1,
                message: "Minimum number of seats: 1.",
              },
              max: {
                value: 55,
                message: "Maximum number of seats: 55.",
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
          <Form.Item label="Price per day"></Form.Item>
          <Controller
            name="price_per_day"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled={disabled}
                autoComplete="off"
                placeholder="Price per day"
                prefix={<EuroOutlined className="site-form-item-icon" />}
              />
            )}
            rules={{
              required: {
                value: true,
                message: "Please enter price per day!",
              },
              min: {
                value: 30,
                message: "Minimum price per day - 30.",
              },
              max: {
                value: 150,
                message: "Maximum price per day - 150.",
              },
              pattern: {
                value: /^[0-9]{1,3}$/,
                message: "Please enter a valid price per day",
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
            label="Remarks"
            tooltip={{
              title: "This is a optional field",
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
                placeholder="Remarks"
                showCount
                maxLength={255}
              />
            )}
          />
          <div style={{ textAlign: "center", marginTop: "1em" }}>
            <Button
              icon={<CloudUploadOutlined className="site-form-item-icon" />}
              type="primary"
              onClick={handleSubmit(onSubmit)}
              disabled={disabled}
            >
              Submit
            </Button>
          </div>
        </Form>
        {errorMessage !== "" ? (
          <div style={{ color: "red", fontSize: "12px" }}>{errorMessage}</div>
        ) : null}
      </Spin>
    </>
  );
};

export default CarForm;

CarForm.propTypes = {
  id: PropTypes.number,
  disabled: PropTypes.bool,
};
