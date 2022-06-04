import React,{useState, useEffect} from "react";
import { Form, Button, Select, DatePicker, Popover, Spin } from "antd";
import { useForm, Controller } from "react-hook-form";
import {
  CloudUploadOutlined,
  CarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";
import moment from 'moment';
import { useModal } from "../context/ModalContext";
import { getLocations, updateReservation, storeReservation, showReservation } from "../../services/reservations";
import { useQuery, useMutation, useQueryClient, QueryClientProvider } from "react-query";
import PropTypes from "prop-types";
import {useTranslation} from 'react-i18next'
import { getAllClients } from "../../services/clients";
import { getAllCars } from "../../services/cars";

const ReservationForm = ({ id, disabled, addForm }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [enableQuery, setEnableQuery] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { close } = useModal();
  const { data: getLocationsResponse } = useQuery("getLocations", getLocations);
  const { data: getClientsResponse } = useQuery("getAllClients", getAllClients);
  const { data: getVehicleResponse } = useQuery("getAllVehicles", getAllCars);
  const { data: showReservationResponse, isLoading } = useQuery(
    ["showReservation", id],
    () => showReservation(id),
    {
      enabled: enableQuery,
    }
  );
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({defaultValues: showReservationResponse?.data?.client});

  const clientContent = (
    <div>
      <p>{t('name.1')}: {showReservationResponse?.data.client.name}</p>
      <p>{t('noOfDoc.1')}:{showReservationResponse?.data.client.identification_document_no}</p>
      <p>Email: {showReservationResponse?.data?.client.email}</p>
      <p>{t('phone.1')}: {showReservationResponse?.data?.client.phone_no}</p>
      <p>{t('country.1')}: {showReservationResponse?.data?.client.country.name}</p>
    </div>
  );

  const carContent = (
    <div>
      <p>{t('plateNum.1')}: {showReservationResponse?.data.vehicle.plate_no}</p>
      <p>{t('prodYear.1')}: {showReservationResponse?.data.vehicle.production_year}</p>
      <p>{t('carType.1')}: {showReservationResponse?.data.vehicle.car_type.name}</p>
      <p>{t('noOfSeats.1')}: {showReservationResponse?.data.vehicle.no_of_seats}</p>
      <p>{t('pricePerD.1')}: {showReservationResponse?.data.vehicle.price_per_day}</p>
    </div>
  );

  const addMutation = useMutation((data) => storeReservation(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("reservations");
      setErrorMessage("");
      close();
    },
    onError: (error) => {
      console.log(error.response);
      setErrorMessage(error?.response?.data?.message);
    },
  });

    const editMutation = useMutation(
    ["editMutation", id],
    (data) => updateReservation(data, id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("reservations");
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
    if (id) {
      editMutation.mutate({
        client_id: showReservationResponse?.data.client_id,
        vehicle_id: showReservationResponse?.data.vehicle_id,
        from_date: data.from_date.format("YYYY-MM-DD"),
        to_date: data.to_date.format("YYYY-MM-DD"),
        rent_location_id: data.rent_location_id,
        return_location_id: data.return_location_id,
        equipment: showReservationResponse?.data?.equipment.map((equipment) => {
          return {
            equipment_id: equipment.id,
            quantity: equipment.max_quantity,
          };
        }),
      });
    }else{
      addMutation.mutate({
        client_id: data.client_id,
        vehicle_id: data.vehicle_id,
        from_date: data.from_date.format("YYYY-MM-DD"),
        to_date: data.to_date.format("YYYY-MM-DD"),
        rent_location_id: data.rent_location_id,
        return_location_id: data.return_location_id
      })
      queryClient.invalidateQueries("reservations");
      setErrorMessage("");
      close();
  }};


   useEffect(() => {
    if (id) {
      reset({
        from_date: moment(showReservationResponse?.data.from_date),
        to_date: moment(showReservationResponse?.data.to_date),
        rent_location_id: showReservationResponse?.data.rent_location_id,
        return_location_id: showReservationResponse?.data.return_location_id,
      });
    }
  }, [id, showReservationResponse, reset]);

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
        {addForm ? <></> :
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
        }
      <Form>
        {addForm && <>
        <Form.Item label={"Client"}></Form.Item>
        <Controller
        name="client_id"
        control={control}
        render={({ field }) => (
          <Select
          {...field}
          disabled={disabled}
          className="width"
          placeholder={"Choose client"}
          options={getClientsResponse?.data?.data?.map((client) => {
            return ({ value: client.id, label: client.name });
          })}
          />
          )}
          rules={{
            required: {
              value: true,
              message: t('plsSelRetL.1'),
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
        <Form.Item label={"Vehicle"}></Form.Item>
        <Controller
        name="vehicle_id"
        control={control}
        render={({ field }) => (
            <Select
            {...field}
              disabled={disabled}
              className="width"
              placeholder={"Choose vehicle"}
              options={getVehicleResponse?.data?.data?.map((vehicle) => {
                return ({ value: vehicle.id, label: vehicle.plate_no });
              })}
              />
              )}
              rules={{
            required: {
              value: true,
              message: t('plsSelRetL.1'),
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
              </>
            }
          
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
              message: t('plsSelFrDt.1'),
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
              message: t('plsSelecRenL.1'),
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
              message: t('plsSelRetL.1'),
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
            onClick={handleSubmit(onSubmit)}
            type="primary"
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

export default ReservationForm;

ReservationForm.propTypes = {
  id: PropTypes.number,
  disabled: PropTypes.bool,
};
