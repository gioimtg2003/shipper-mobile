import { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

export default function OverlayScan() {
    const { height: screenHeight } = Dimensions.get("window");
    const y = useSharedValue(20);

    useEffect(() => {
        y.value = withRepeat(
            withTiming(screenHeight, {
                duration: 1000,
                easing: Easing.linear,
            }),
            -1,
            true
        );
    }, []);

    const styleScan = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: y.value }],
        };
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.scan, styleScan]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        justifyContent: "flex-start",
        zIndex: 9999,
        flex: 1,
    },
    scan: {
        width: "100%",
        height: 2,
        backgroundColor: "#BFECFF",
        borderRadius: 5,
    },
});
