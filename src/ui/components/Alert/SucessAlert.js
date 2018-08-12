import React from "react";
import { Alert } from 'antd';

const SucessAlert = ({successful, message}) => {
    return (
        successful ? <Alert showIcon={false} type="success" message={message} banner/> : ''
    )
}

export default SucessAlert

