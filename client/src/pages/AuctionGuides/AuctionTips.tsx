import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import {
  Lightbulb,
  DollarSign,
  Clock,
  BookOpen,
  ShieldCheck,
  TrendingUp,
  Camera,
  Truck,
} from "lucide-react";

const AuctionTips = () => {
  const generalTips = [
    {
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
      title: "Research Thoroughly",
      description:
        "Investigate the item's market value, history, and authenticity before bidding. Check completed listings for similar items to gauge fair prices.",
    },
    {
      icon: <DollarSign className="w-6 h-6 text-green-500" />,
      title: "Set a Realistic Budget",
      description:
        "Determine your maximum bid beforehand, factoring in additional costs like shipping and potential restoration. Stick to this budget to avoid overspending.",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-red-500" />,
      title: "Avoid Bidding Wars",
      description:
        "Stay calm and avoid emotional bidding. If the price exceeds your budget, be prepared to walk away. There will always be other opportunities.",
    },
    {
      icon: <Truck className="w-6 h-6 text-purple-500" />,
      title: "Consider All Costs",
      description:
        "Factor in shipping fees, taxes, and any potential import duties. These can significantly increase the total cost of your purchase.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-indigo-500" />,
      title: "Understand Terms and Conditions",
      description:
        "Carefully read the auction's rules, return policies, and buyer protections. Be clear on payment methods and deadlines to avoid complications.",
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      title: "Time Your Bids Strategically",
      description:
        "Consider placing bids in the final moments of an auction to avoid driving up the price early. Use automatic bidding features when available.",
    },
    {
      icon: <Camera className="w-6 h-6 text-pink-500" />,
      title: "Scrutinize Item Condition",
      description:
        "Carefully examine all photos and descriptions. Don't hesitate to ask for additional images or details about the item's condition or provenance.",
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-yellow-500" />,
      title: "Stay Informed and Patient",
      description:
        "Keep track of market trends and upcoming auctions. Sometimes, waiting for the right opportunity can lead to better deals and more satisfying purchases.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 ">
        Master the Art of Auction Bidding
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {generalTips.map((tip, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-all duration-300"
          >
            <CardHeader>
              <CardTitle className="flex items-center text-xl -mb-4">
                {tip.icon}
                <span className="ml-2">{tip.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">{tip.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AuctionTips;
