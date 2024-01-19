import { ReactNode } from "react";
import { AsideNav } from "./AsideNav";
import Navbar from "./Navbar";

type Props = {
  children: ReactNode;
};

const SideBarLayout = (props: Props) => {
  return (
    <div className="w-screen h-screen flex overflow-hidden bg-gray-50">
      <div className="sticky">
        <AsideNav />
      </div>
      <div className="w-full overflow-y-auto">
        <div className="overflow-hidden">
          <Navbar />
        </div>
        <div className="">{props.children}</div>
      </div>
    </div>
  );
};

export default SideBarLayout;
