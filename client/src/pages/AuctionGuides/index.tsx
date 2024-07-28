import { Link, Outlet, useLocation } from "react-router-dom";
import { Shield, Search, Lightbulb } from "lucide-react";

const AuctionGuides = () => {
  const guides = [
    {
      icon: <Shield className="w-6 h-6 text-blue-400" />,
      title: "Safe Bidding",
      description: "Learn how to bid safely and avoid scams",
      link: "/AuctionGuides/SafeBidding",
    },
    {
      icon: <Search className="w-6 h-6 text-green-400" />,
      title: "Verify Sellers",
      description: "Tips on verifying seller authenticity",
      link: "/AuctionGuides/VerifySellers",
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-yellow-400" />,
      title: "Auction Tips",
      description: "General tips for successful auctions",
      link: "/AuctionGuides/AuctionTips",
    },
  ];

  return (
    <div className=" mx-auto px-4 py-8  text-gray-100 ">
      <h1 className="text-3xl font-bold mb-4 text-center ">Auction Guides</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {guides.map((guide, index) => (
          <GuideCard key={index} {...guide} />
        ))}
      </div>
      <Outlet />
    </div>
  );
};

const GuideCard = ({
  icon,
  title,
  description,
  link,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}) => {
  const location = useLocation();
  const isActive = location.pathname === link;

  return (
    <Link
      to={link}
      className={`block p-6 rounded-lg  border ${
        isActive
          ? "bg-purple-900/20 hover:bg-purple-900/40 border-2 border-purple-600/40 "
          : "bg-gray-800/30 hover:bg-gray-700/40"
      }`}
    >
      <div className="flex items-center mb-4">
        <div className="mr-4">{icon}</div>
        <h2
          className={`text-xl font-semibold ${isActive ? "text-blue-200" : ""}`}
        >
          {title}
        </h2>
      </div>
      <p className={isActive ? "text-blue-100" : "text-gray-400"}>
        {description}
      </p>
    </Link>
  );
};

export default AuctionGuides;
