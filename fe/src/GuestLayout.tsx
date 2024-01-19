import { ReactNode } from "react";
import Logo from "./components/Logo";

type Props = {
  children: ReactNode;
};

const GuestLayout = (props: Props) => {
  const accessToken = localStorage.getItem("accessToken");
  return (
    <div className="">
      <div className={`fixed top-0 bg-white w-full`}>
        {!accessToken && <Logo />}
      </div>
      <div className="w-full h-full overflow-y-auto">{props.children}</div>
    </div>
  );
};

export default GuestLayout;