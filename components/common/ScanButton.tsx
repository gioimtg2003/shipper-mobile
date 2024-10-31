import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, ViewProps } from "react-native";
import Animated, {
    Easing,
    interpolate,
    ReduceMotion,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

interface ScanButtonProps extends ViewProps {
    color?: string;
    size?: number;
    strokeWidth?: number;
    onCapture?: () => void;
    disable?: boolean;
}

const ScanButton = React.forwardRef<ViewProps, ScanButtonProps>(
    (
        {
            color = "white",
            size = 64,
            strokeWidth = 2.5,
            style,
            onCapture,
            disable = false,
            ...props
        },
        ref
    ) => {
        const scale = useSharedValue(1);

        useEffect(() => {
            scale.value = withRepeat(
                withTiming(1.5, {
                    duration: 800,
                    easing: Easing.inOut(Easing.quad),
                    reduceMotion: ReduceMotion.System,
                }),
                -1,
                true
            );
        }, []);

        const outerAnimatedStyle = useAnimatedStyle(() => {
            return {
                opacity: interpolate(scale.value, [1, 1.5], [1, 0]),
                transform: [
                    {
                        scale: scale.value,
                    },
                ],
            };
        });

        return (
            <View
                {...props}
                style={[
                    {
                        width: size,
                        height: size,
                    },
                    style,
                ]}
            >
                <TouchableOpacity
                    disabled={disable}
                    activeOpacity={0.7}
                    onPress={onCapture}
                    style={[
                        styles.inner,
                        { backgroundColor: color, borderRadius: size / 2 },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.outer,
                        {
                            borderRadius: size / 2,
                            borderWidth: strokeWidth,
                            borderColor: color,
                        },
                        outerAnimatedStyle,
                    ]}
                />
            </View>
        );
    }
);

const styles = StyleSheet.create({
    inner: {
        position: "absolute",
        width: "100%",
        height: "100%",
        transform: [
            {
                scale: 0.8,
            },
        ],
        zIndex: 99,
    },

    outer: {
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        zIndex: 1,
    },
});

ScanButton.displayName = "ScanButton";

export default ScanButton;
