import { TrainRounded } from "@material-ui/icons";
import { createContext, useState } from "react";

const DrawerContext = createContext({
  open: true,
  changeDrawer: (value) => {},
});

export function DrawerContextProvider(props) {
  const [isOpen, setOpen] = useState(true);
  function handleChange(newValue: boolean) {
    setOpen(newValue);
  }
  const context = {
    open: isOpen,
    changeDrawer: handleChange,
  };
  return (
    <DrawerContext.Provider value={context}>
      {props.children}
    </DrawerContext.Provider>
  );
}
export default DrawerContext;
