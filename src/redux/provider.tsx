"use client"
import { store } from "./store";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { fetchProductsAndCategories } from "./features/productSlice";

function DataInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(fetchProductsAndCategories());
  }, []);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
      <Provider store={store}>
        <DataInitializer>{children}</DataInitializer>
      </Provider>
  );
}
