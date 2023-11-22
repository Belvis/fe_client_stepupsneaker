import React, { ReactNode } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "../store";

type PersistProviderProps = {
  children: ReactNode;
};

const PersistProvider: React.FC<PersistProviderProps> = ({ children }) => {
  return (
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  );
};

export default PersistProvider;
