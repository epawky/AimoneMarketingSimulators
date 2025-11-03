import * as React from "react";
export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={"px-4 py-2 rounded-xl shadow bg-black text-white hover:opacity-90 " + (props.className ?? "")} />
  );
}
