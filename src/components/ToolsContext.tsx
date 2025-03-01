import { createContext, ReactNode, useContext, useState } from "react";
// интерфейсы нужны чтобы тайпскрипт убедился что передаются данные правильных типов которые указаны
interface ToolsContextType {
    ideasFormVisibilityToggle: () => void;
    isFormVisible: boolean;
}
//undifiend bc context requires garanteed value
export const ToolsContext = createContext<ToolsContextType | null>(null);

//provider will containt each tool function to share with children components
export const ToolsProvider = ({ children }: {children: ReactNode}) => {
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

    const ideasFormVisibilityToggle = () => {
        setIsFormVisible((prevVisibility) => !prevVisibility);
      };

    return (
        <ToolsContext.Provider value={{ideasFormVisibilityToggle, isFormVisible}}>
            {children}
        </ToolsContext.Provider>
    )
}

// hook is neaded to check context availability I guess. So i don`t need to do it every time I use context.
export const useTools = () => {
    const toolsContextHook = useContext(ToolsContext);

    if(!toolsContextHook) {
        throw new Error (
            "these components needs to be inside ToolsContext provider to use useTools hook"
        );
    }

    return toolsContextHook;
}