import React, { MouseEventHandler, useCallback } from 'react'
import { t } from '../i18n/i18n'
import settings from '../settings.json'

type ThermomixIcons = {
    onIconClick: (src: string) => void
}
type ThermomixIcon = {
    src: string
    tKey: string
}

const ThermomixIcons: React.FC<ThermomixIcons> = ({ onIconClick }) => {
    const icons: ThermomixIcon[] = [
        { src: 'imgs/icon-inverse.png', tKey: 'icons.reverse' },
        { src: `imgs/icon-mijotage.png`, tKey: 'icons.simmer' },
        {
            src: `imgs/icon-tare.png`,
            tKey: 'icons.tare',
        },
        {
            src: `imgs/icon-ouverture.png`,
            tKey: 'icons.opening',
        },
        {
            src: `imgs/icon-verrouillage.png`,
            tKey: 'icons.locking',
        },
        {
            src: 'imgs/icon-petrin.png',
            tKey: 'icons.pickle',
        },
    ]

    const onImgClick: (
        icon: ThermomixIcon
    ) => MouseEventHandler<HTMLImageElement> = useCallback(
        (icon) => (event) => {
            event.stopPropagation()
            onIconClick(`![${t(icon.tKey)}](${icon.src})`)
        },
        [onIconClick]
    )

    return (
        <p>
            {icons.map((icon) => (
                <img
                    key={icon.tKey}
                    src={`${settings.baseUrl}${icon.src}`}
                    className="thermomixIcon"
                    title={t(icon.tKey)}
                    alt={t(icon.tKey)}
                    onClick={onImgClick(icon)}
                />
            ))}
        </p>
    )
}

export default ThermomixIcons
