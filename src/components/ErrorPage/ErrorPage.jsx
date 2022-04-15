import React from 'react'
import { useNavigate } from "react-router";
import { Result, Button } from "antd";
import PropTypes from "prop-types";


function ErrorPage({error, errorMessage}) {

    const navigate = useNavigate()

    return (
         <div className="errContainer">
      <Result
        status={error}
        title={"Error " + error}
        subTitle={errorMessage}
        extra={
          <div>
            <Button
              type="primary"
              onClick={() => navigate("/")}
              className="button"
            >
              Back to Home
            </Button>
          </div>
        }
      />
    </div>
    )
}

export default ErrorPage

ErrorPage.propTypes = {
  error: PropTypes.string,
  errorMessage: PropTypes.string,
};

