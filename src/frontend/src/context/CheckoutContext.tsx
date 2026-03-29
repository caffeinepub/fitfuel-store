import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface DeliveryAddress {
  addressType: string;
  flat: string;
  floor: string;
  area: string;
  landmark: string;
  name: string;
  phone: string;
}

type PaymentMethod = "upi" | "cod";

interface CheckoutContextType {
  address: DeliveryAddress;
  setAddress: (addr: DeliveryAddress) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  upiId: string;
  setUpiId: (id: string) => void;
}

const CheckoutContext = createContext<CheckoutContextType | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<DeliveryAddress>({
    addressType: "Home",
    flat: "",
    floor: "",
    area: "",
    landmark: "",
    name: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [upiId, setUpiId] = useState("");

  return (
    <CheckoutContext.Provider
      value={{
        address,
        setAddress,
        paymentMethod,
        setPaymentMethod,
        upiId,
        setUpiId,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within CheckoutProvider");
  return ctx;
}
