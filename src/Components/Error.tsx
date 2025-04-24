import React from 'react'
import { t } from '../i18n/i18n'

type ErrorMessageType = {
    msg: string
}
const ErrorMessage: React.FC<ErrorMessageType> = ({ msg }) => (
    <div className="content error">Error {msg ? `: ${t(msg)}` : ''}</div>
)

export default ErrorMessage
