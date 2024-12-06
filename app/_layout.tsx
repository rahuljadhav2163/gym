import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
       <Stack.Screen name="profile" options={{ headerShown: false }}/>
      <Stack.Screen name="index" options={{ headerShown: false }}/>
      <Stack.Screen name="aitrainer" options={{ headerShown: false }}/>
      <Stack.Screen name="login"  options={{ headerShown: false }}/>
      <Stack.Screen name="membership" options={{ headerShown: false }}/>
      <Stack.Screen name="signup" options={{ headerShown: false }}/>
      <Stack.Screen name="dietplan" options={{ headerShown: false }}/>
      <Stack.Screen name="admin" options={{ headerShown: false }}/>
      <Stack.Screen name="activity" options={{ headerShown: false }}/>
      <Stack.Screen name="register" options={{ headerShown: false }}/>
    </Stack>
  );
}
