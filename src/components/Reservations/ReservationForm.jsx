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
import {useTranslation} from 'react-i18next'

const ReservationForm = ({ id, disabled }) => {
  const { t } = useTranslation();
  const { data: getLocationsResponse } = useQuery("getLocations", getLocations);

  const {
    control,
    formState: { errors },
  } = useForm();

  const clientContent = (
    <div>
      <p>{t('name.1')}: </p>
      <p>{t('noOfDoc.1')}:</p>
      <p>Email: </p>
      <p>{t('phone.1')}: </p>
      <p>{t('country.1')}: </p>
    </div>
  );

  const carContent = (
    <div>
      <p>{t('plateNum.1')}: </p>
      <p>{t('prodYear.1')}:</p>
      <p>{t('carType.1')}: </p>
      <p>{t('noOfSeats.1')}: </p>
      <p>{t('pricePerD.1')}:</p>
    </div>
  );

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Popover placement="bottom" content={carContent} title={t('carInf.1')}>
          <Button icon={<CarOutlined />} shape="round">
            {t('carInf.1')}
          </Button>
        </Popover>
        {disabled !== true ? (
          <Popover
            placement="bottom"
            content={clientContent}
            title={t('clientInf.1')}
          >
            <Button icon={<UserOutlined />} shape="round" hidden={disabled}>
              {t('clientInf.1')}
            </Button>
          </Popover>
        ) : (
          <></>
        )}
      </div>
      <Form>
        <Form.Item label={t('fromDate.1')}></Form.Item>
        <Controller
          name="from_date"
          control={control}
          render={({ field }) => (
            <DatePicker
              {...field}
              placeholder={t('fromDate.1')}
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
        <Form.Item label={t('toDate.1')}></Form.Item>
        <Controller
          name="to_date"
          control={control}
          render={({ field }) => (
            <DatePicker {...field} placeholder={t('toDate.1')} disabled={disabled} />
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
        <Form.Item label={t('country.1')}></Form.Item>
        <Controller
          name="rent_location_id"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              disabled={disabled}
              placeholder={t('chooseRentL.1')}
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
        <Form.Item label={t('country.1')}></Form.Item>
        <Controller
          name="return_location_id"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              disabled={disabled}
              className="width"
              placeholder={t('chooseRetL.1')}
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
            {t('submit.1')}
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
