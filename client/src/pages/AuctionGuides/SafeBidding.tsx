import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import {
  Shield,
  Eye,
  Lock,
  CreditCard,
  FileText,
  Bell,
  MessageCircle,
} from "lucide-react";

const SafeBidding = () => {
  const safetyTips = [
    {
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      title: "Verify Seller Credibility",
      description:
        "Check the seller's feedback score, history, and read recent reviews. Be cautious of new sellers with limited history.",
    },
    {
      icon: <Eye className="w-6 h-6 text-green-500" />,
      title: "Scrutinize Item Details",
      description:
        "Carefully examine all photos and read the full item description. Don't hesitate to ask for additional images or information.",
    },
    {
      icon: <Lock className="w-6 h-6 text-red-500" />,
      title: "Use Secure Payment Methods",
      description:
        "Stick to the platform's recommended payment options. Avoid direct bank transfers or cash payments.",
    },
    {
      icon: <CreditCard className="w-6 h-6 text-purple-500" />,
      title: "Set a Realistic Budget",
      description:
        "Decide your maximum bid in advance and factor in additional costs like shipping and taxes. Stick to your limit!",
    },
    {
      icon: <FileText className="w-6 h-6 text-orange-500" />,
      title: "Understand Terms and Conditions",
      description:
        "Familiarize yourself with the auction's rules, return policies, and buyer protections before placing a bid.",
    },
    {
      icon: <Bell className="w-6 h-6 text-yellow-500" />,
      title: "Be Wary of Red Flags",
      description:
        "If a deal seems too good to be true, it probably is. Watch out for pressure tactics or requests to transact off-platform.",
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-indigo-500" />,
      title: "Communicate Through the Platform",
      description:
        "Keep all conversations with the seller on the auction site's messaging system for your protection.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 ">
      <h1 className="text-3xl font-bold mb-4  ">Safe Bidding Guide</h1>
      <p className="text-xl  mb-8 text-gray-200">
        Protect yourself and bid with confidence using these essential tips
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safetyTips.map((tip, index) => (
          <Card
            key={index}
            className=" hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-semibold">
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

      <div className="mt-12 border p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-purple-300">Remember:</h2>
        <p className="text-lg text-gray-300">
          Your safety and satisfaction are our top priorities. If you ever feel
          unsure about a transaction or encounter any suspicious activity, don't
          hesitate to contact our customer support team. We're here to ensure
          your auction experience is secure and enjoyable!
        </p>
      </div>
    </div>
  );
};

export default SafeBidding;
