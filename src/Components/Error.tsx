import React from 'react'

type ErrorMessageType = {
    msg: string
}
const ErrorMessage: React.FC<ErrorMessageType> = ({ msg }) => (
    <div className="content error">Error {msg ? `: ${msg}` : ''}</div>
)

export default ErrorMessage
