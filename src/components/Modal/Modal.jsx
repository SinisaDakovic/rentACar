import React from "react";
import { Modal } from "antd";
import PropTypes from "prop-types";
import "antd/dist/antd.css";

const ModalComponent = ({
  title = "",
  children = <></>,
  isModalOpen,
  setIsModalOpen,
}) => {
  return (
    <Modal
      width="380px"
      title={title}
      visible={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
    >
      {children}
    </Modal>
  );
};

export default ModalComponent;

ModalComponent.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  isModalOpen: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
};
