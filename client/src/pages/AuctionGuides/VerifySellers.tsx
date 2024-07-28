import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import {
  CheckCircle,
  Star,
  AlertTriangle,
  MessageSquare,
  Image,
  DollarSign,
  Shield,
  Search,
} from "lucide-react";

const VerifySellers = () => {
  const verificationTips = [
    {
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      title: "Check Seller Ratings",
      description:
        "Examine the seller's feedback score and read recent reviews. Look for consistently positive ratings over time.",
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      title: "Verified Seller Badges",
      description:
        "Prioritize sellers with platform-verified badges or certifications. These indicate a track record of trustworthy transactions.",
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      title: "New Account Caution",
      description:
        "Be extra cautious with new sellers or accounts with limited history. They may be legitimate, but require more scrutiny.",
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-green-500" />,
      title: "Use Platform Messaging",
      description:
        "Communicate with sellers through the auction site's messaging system. This keeps a record and helps protect both parties.",
    },
    {
      icon: <Image className="w-6 h-6 text-purple-500" />,
      title: "Request Additional Details",
      description:
        "Don't hesitate to ask for more photos or information about an item. Reputable sellers will be happy to provide these.",
    },
    {
      icon: <DollarSign className="w-6 h-6 text-emerald-500" />,
      title: "Research Market Prices",
      description:
        "Know the typical price range for the item you're interested in. Be wary of deals that seem too good to be true.",
    },
    {
      icon: <Search className="w-6 h-6 text-indigo-500" />,
      title: "Cross-Reference Seller Info",
      description:
        "If possible, look up the seller on other platforms or social media to verify their authenticity and reputation.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 ">
      <h1 className="text-3xl font-bold mb-4  ">Verifying Sellers</h1>
      <p className="text-xl  mb-8 text-gray-300">
        Ensure a safe auction experience by following these seller verification
        tips
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {verificationTips.map((tip, index) => (
          <Card
            key={index}
            className=" hover:shadow-lg transition-all duration-300"
          >
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-semibold">
                <div className="mr-3 p-2 rounded-full ">{tip.icon}</div>
                {tip.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">{tip.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-12  border">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-purple-300">
            <CheckCircle className="w-8 h-8 mr-3 text-gray-300" />
            Pro Tip: Trust Your Instincts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-300">
            While these verification methods are crucial, always trust your
            instincts. If something feels off about a seller or a deal, it's
            okay to walk away. There will always be other opportunities. Your
            safety and satisfaction are paramount in the auction process.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifySellers;
