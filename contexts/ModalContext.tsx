import { useState, createContext } from "react";

interface AppContextInterface {
	open: boolean;
	setOpen: Function;
}

type Props = {
	children: React.ReactNode;
};

const initialContext: AppContextInterface = {
	open: false,
	setOpen: () => {},
};

export const ModalContext = createContext<AppContextInterface>(initialContext);

export default function ModalContextProvider({ children }: Props) {
	const [open, setOpen] = useState(false);
	return (
		<ModalContext.Provider value={{ open, setOpen }}>
			{children}
		</ModalContext.Provider>
	);
}
