import { Link } from "react-router-dom";

interface IDashboardCardProps {
  color: string;
  cardName: string;
  count: number;
  link: string;
  icon: any;
}

const DashboardCard = (props: IDashboardCardProps) => {
  return (
    <Link className="flex bg-white gap-3 h-28 p-4" to={props.link}>
      <div
        className={`${props.color} rounded-lg w-1/3 flex items-center text-4xl justify-center text-white
        `}
      >
        {props.icon}
      </div>
      <div className="flex flex-col justify-center">
        <div className="text-gray-400">{props.cardName}</div>
        <div className="font-mono"> {props.count}</div>
      </div>
    </Link>
  );
};

export default DashboardCard;
