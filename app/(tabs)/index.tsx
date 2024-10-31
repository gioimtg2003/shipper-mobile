import OverlayScan from "@/components/common/overlay/OverlayScan";
import ScanFrame from "@/components/common/scan-frame/ScanFrame";
import ScanButton from "@/components/common/ScanButton";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useCallback, useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getPrompt } from "@/utils";

export default function App() {
    const [permission, requestPermission] = useCameraPermissions();
    const [isOverlayVisible, setOverlayVisible] = useState(false);

    const cameraRef = useRef<CameraView>(null);
    const captureAndProcessImage = useCallback(async () => {
        setOverlayVisible(true);
        if (cameraRef.current) {
            const data = await cameraRef.current.takePictureAsync({
                quality: 1,
                base64: true,
            });
            if (!data?.uri) {
                console.log("No image captured");
                return;
            }

            console.log("Captured image", data.uri);
            const formdata = new FormData();
            formdata.append("file", {
                uri: data.uri,
                type: "image/jpeg", // hoặc type phù hợp với ảnh của bạn
                name: "photo.jpg",
            } as any);

            const requestOptions = {
                method: "POST",
                body: formdata,
            };

            if (process.env.EXPO_PUBLIC_API_OCR) {
                fetch(process.env.EXPO_PUBLIC_API_OCR, requestOptions)
                    .then((response) => response.json())
                    .then(async (result: any) => {
                        const data = result.readResult.blocks[0].lines;
                        const text = data
                            .map((line: any) => line.text)
                            .join("\n");
                        const genAI = new GoogleGenerativeAI(
                            String(
                                process.env.EXPO_PUBLIC_API_KEY_GOOGLE_AI_STUDIO
                            )
                        );
                        const model = genAI.getGenerativeModel({
                            model: "gemini-1.5-flash",
                        });
                        const prompt = getPrompt(text);

                        const rs = await model.generateContent(
                            prompt.frontIdentity()
                        );
                        console.log(rs.response.text());
                        setOverlayVisible(false);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                console.log("API_OCR environment variable is not defined");
            }

            // // Xử lý xong thì reset lại
        }
    }, []);

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {isOverlayVisible && <OverlayScan />}

            <CameraView style={styles.camera} facing={"back"} ref={cameraRef}>
                <View
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingHorizontal: 32,
                        paddingVertical: 72,
                    }}
                >
                    <View
                        style={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <ScanFrame />
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <ScanButton
                        disable={isOverlayVisible}
                        style={{
                            alignSelf: "flex-end",
                            marginBottom: 32,
                            position: "relative",
                        }}
                        onCapture={captureAndProcessImage}
                    />
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
    },

    camera: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    buttonContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "transparent",
        width: "100%",
        justifyContent: "center",
    },
    button: {
        flex: 1,
        alignSelf: "flex-end",
        alignItems: "center",
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
});
