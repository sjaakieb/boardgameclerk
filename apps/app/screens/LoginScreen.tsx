import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { getCurrentUser, login } from "../services";
import { useCurrentUserStore } from "../store";

export const LoginScreen = () => {
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");

	const [progress, setInProgress] = useState(false);

	const { currentUser, setCurrentUser } = useCurrentUserStore((state) => ({
		currentUser: state.currentUser,
		setCurrentUser: state.setCurrentUser,
	}));

	const handleLoginPress = async () => {
		if (!progress) {
			setInProgress(true);
			console.log("USERNAME", username);
			console.log("PASSWORD", password);
			await login(username, password);
			const user = await getCurrentUser();
			setCurrentUser(user);
		}
	};

	const styles = StyleSheet.create({
		inputs: {
			padding: 10,
			borderWidth: 1,
			borderColor: "black",
			borderRadius: 10,
			width: 300,
		},
		title: {
			fontSize: 20,
		},
	});

	return (
		<View>
			<Text style={styles.title}>Board Game Clerk</Text>
			<View>
				<Text>Username</Text>
				<TextInput
					style={styles.inputs}
					value={username}
					onChangeText={setUsername}
				/>
			</View>
			<View>
				<Text>Password</Text>
				<TextInput
					style={styles.inputs}
					value={password}
					onChangeText={setPassword}
					secureTextEntry={true}
				/>
			</View>
			<Button title="Login" onPress={handleLoginPress} />
		</View>
	);
};
