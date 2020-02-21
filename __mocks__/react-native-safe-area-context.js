import React from "react";
import { View } from "react-native";

export const SafeAreaView = jest.fn().mockReturnValue(function NavigationContainer(props) {return <View>{props.children}</View>;});