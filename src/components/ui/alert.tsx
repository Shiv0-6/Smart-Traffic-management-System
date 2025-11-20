import React from "react";

export const Alert = ({ children }: { children: React.ReactNode }) => {
  return <div role="alert">{children}</div>;
};

export const AlertDescription = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};
