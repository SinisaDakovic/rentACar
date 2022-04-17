import React from "react";
import { Form, Button, Select, DatePicker, Popover } from "antd";
import { useForm, Controller } from "react-hook-form";
import {
  CloudUploadOutlined,
  CarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";
import { getLocations } from "../../services/reservations";
import { useQuery } from "react-query";
import PropTypes from "prop-types";

const ReservationForm = ({ id, disabled }) => {
  const { data: getLocationsResponse } = useQuery("getLocations", getLocations);

  const {
    control,
    formState: { errors },
  } = useForm();

  const clientContent = (
    <div>
      <p>Name: </p>
      <p>No of document:</p>
      <p>Email: </p>
      <p>Phone: </p>
      <p>Country: </p>
    </div>
  );

  const carContent = (
    <div>
      <p>Plate number: </p>
      <p>Production year:</p>
      <p>Type of car: </p>
      <p>No of seats: </p>
      <p>Price per day:</p>
    </div>
  );

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Popover placement="bottom" content={carContent} title="Car info">
          <Button icon={<CarOutlined />} shape="round">
            Car info
          </Button>
        </Popover>
        {disabled !== true ? (
          <Popover
            placement="bottom"
            content={clientContent}
            title="Client info"
          >
            <Button icon={<UserOutlined />} shape="round" hidden={disabled}>
              Client info
            </Button>
          </Popover>
        ) : (
          <></>
        )}
      </div>
      <Form>
        <Form.Item label="From date"></Form.Item>
        <Controller
          name="from_date"
          control={control}
          render={({ field }) => (
            <DatePicker
              {...field}
              placeholder="From date"
              disabled={disabled}
            />
          )}
          rules={{
            required: {
              value: true,
              message: "Please select from data!",
            },
          }}
        />
        {errors?.from_date?.message !== "" ? (
          <span style={{ color: "red", fontSize: "12px" }}>
            {errors?.from_date?.message}
          </span>
        ) : (
          <span></span>
        )}
        <Form.Item label="To date"></Form.Item>
        <Controller
          name="to_date"
          control={control}
          render={({ field }) => (
            <DatePicker {...field} placeholder="To date" disabled={disabled} />
          )}
          rules={{
            required: {
              value: true,
              message: "Please select from data!",
            },
          }}
        />
        {errors?.to_date?.message !== "" ? (
          <span style={{ color: "red", fontSize: "12px" }}>
            {errors?.to_date?.message}
          </span>
        ) : (
          <span></span>
        )}
        <Form.Item label="Country"></Form.Item>
        <Controller
          name="rent_location_id"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              disabled={disabled}
              placeholder="Choose rent location"
              options={getLocationsResponse?.data?.map((location) => {
                return { value: location.id, label: location.name };
              })}
            />
          )}
          rules={{
            required: {
              value: true,
              message: "Please select rent location!",
            },
          }}
        />
        {errors?.rent_location_id?.message !== "" ? (
          <span style={{ color: "red", fontSize: "12px" }}>
            {errors?.rent_location_id?.message}
          </span>
        ) : (
          <span></span>
        )}
        <Form.Item label="Country"></Form.Item>
        <Controller
          name="return_location_id"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              disabled={disabled}
              className="width"
              placeholder="Choose return location"
              options={getLocationsResponse?.data?.map((location) => {
                return { value: location.id, label: location.name };
              })}
            />
          )}
          rules={{
            required: {
              value: true,
              message: "Please select return location!",
            },
          }}
        />
        {errors?.return_location_id?.message !== "" ? (
          <span style={{ color: "red", fontSize: "12px" }}>
            {errors?.return_location_id?.message}
          </span>
        ) : (
          <span></span>
        )}
        <div style={{ textAlign: "center", marginTop: "1em" }}>
          <Button
            icon={<CloudUploadOutlined className="site-form-item-icon" />}
            type="primary"
            disabled={disabled}
          >
            Submit
          </Button>
        </div>
      </Form>
    </>
  );
};

export default ReservationForm;

ReservationForm.propTypes = {
  id: PropTypes.number,
  disabled: PropTypes.bool,
};
