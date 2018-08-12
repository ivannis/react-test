import React from "react";
import { Alert } from 'antd';

const ErrorAlert = ({errors = []}) => {    
    return (
        errors.map(function(error, i) {
            return <Alert showIcon={false} type="error" message={ error.message } banner key={i}/>
        })
    )
}

export default ErrorAlert

