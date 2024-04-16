import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { LoginScreen } from "./screens/LoginScreen";
import { getCurrentUser } from "./services";
import { useCurrentUserStore } from "./store";

if (process.env.NODE_ENV === "development" && Platform.OS === "web") {
	require("@expo/metro-runtime"); // #23104 (comment)
}

export default function App() {
	const { currentUser, setCurrentUser } = useCurrentUserStore((state) => ({
		currentUser: state.currentUser,
		setCurrentUser: state.setCurrentUser,
	}));

	const [progress, setProgress] = useState(false);

	// const user = await getCurrentUser();

	useEffect(() => {
		getCurrentUser().then((user) => {
			setCurrentUser(user);
			setProgress(false);
		});
	}, []);
	console.log("USER", currentUser);

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: "#fff",
			alignItems: "center",
			justifyContent: "center",
			rowGap: 20,
		},
	});

	return (
		<View style={styles.container}>
			{!currentUser && <LoginScreen />}
			{currentUser && <Text>Welcome {currentUser}</Text>}
			<StatusBar style="auto" />
		</View>
	);
}
