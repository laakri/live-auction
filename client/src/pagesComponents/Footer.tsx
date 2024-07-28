import React from "react";

const Footer: React.FC = () => {
  return (
    <>
      <footer className=" py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Lexura</h3>
              <p className="text-gray-400">
                Elevating the art of luxury auctions
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-purple-400 transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-purple-400 transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-purple-400 transition">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="hover:text-purple-400 transition">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="hover:text-purple-400 transition">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="hover:text-purple-400 transition">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p>&copy; 2024 Lexura. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
