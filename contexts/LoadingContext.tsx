import { useState, createContext } from "react";

interface AppContextInterface {
	loading: boolean;
	setLoading: Function;
}

type Props = {
	children: React.ReactNode;
};

const initialContext: AppContextInterface = {
	loading: false,
	setLoading: () => {},
};

export const LoadingContext =
	createContext<AppContextInterface>(initialContext);

export default function LoadingContextProvider({ children }: Props) {
	const [loading, setLoading] = useState(false);
	return (
		<LoadingContext.Provider value={{ loading, setLoading }}>
			{children}
		</LoadingContext.Provider>
	);
}
