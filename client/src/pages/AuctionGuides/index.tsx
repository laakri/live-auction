import { Link, Outlet } from "react-router-dom";
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
    <div className="container mx-auto px-4 py-8  text-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center">Auction Guides</h1>
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
}) => (
  <Link
    to={link}
    className="block p-6 bg-gray-800/30 rounded-lg hover:bg-gray-700/40 transition-all duration-300"
  >
    <div className="flex items-center mb-4">
      <div className="mr-4">{icon}</div>
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    <p className="text-gray-400">{description}</p>
  </Link>
);

export default AuctionGuides;
