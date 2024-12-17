import React, { useState, useEffect, useRef } from "react";
import { Typography } from "@mui/material";

interface DynamicTypographyProps {
    text: string;
    maxFontSize?: number;
    minFontSize?: number;
    containerWidth: number;
    setFontSizeElsewhere: (newFontSize: number) => void;
    color: string;
}

const DynamicTypography: React.FC<DynamicTypographyProps> = ({
    text,
    containerWidth,
    maxFontSize = 20,
    minFontSize = 12,
    color,
    setFontSizeElsewhere
}) => {
    const [fontSize, setFontSize] = useState(maxFontSize);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const adjustFontSize = () => {
            const element = ref.current;

            if (element) {
                let newFontSize = maxFontSize;

                while (newFontSize > minFontSize) {
                    element.style.fontSize = `${newFontSize}px`;

                    if (element.scrollWidth <= containerWidth) {
                        break;
                    }

                    newFontSize -= 1;
                }
                if (setFontSizeElsewhere) {
                    setFontSizeElsewhere(newFontSize);
                }
                setFontSize(newFontSize);
            }
        };

        adjustFontSize();
    }, [text, containerWidth, maxFontSize, minFontSize]);

    return (
        <Typography
            ref={ref}
            style={{
                fontSize: `${fontSize}px`,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: `${containerWidth}px`,
                textAlign: 'center'
            }}
            variant="body1"
            color={color}
        >
            {text}
        </Typography>
    );
};

export default DynamicTypography;
