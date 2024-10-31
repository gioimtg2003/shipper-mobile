import React, { Fragment } from "react";
import { View } from "react-native";
import { styles } from "./styles";

const edges: Array<keyof typeof styles> = [
    "tLr",
    "tLb",
    "tRl",
    "tRb",
    "bLt",
    "bLr",
    "bRl",
    "bRt",
];

export default function ScanFrame({ color = "white" }: { color?: string }) {
    return (
        <Fragment>
            {edges.map((edge, index) => (
                <View
                    key={index}
                    style={[
                        styles[edge],
                        {
                            backgroundColor: color,
                        },
                    ]}
                />
            ))}
        </Fragment>
    );
}
