import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import PageTransition from "./PageTransition";
import { FiMessageCircle } from "react-icons/fi";
import ChatBot from "./ChatBot";

const Layout = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <main className="flex-grow pt-16">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      {/* Chatbot Icon */}
      <button
        className="fixed bottom-6 right-6 bg-health-500 text-white p-4 rounded-full shadow-lg hover:bg-health-600 transition"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        <FiMessageCircle size={24} />
      </button>

      {/* Chatbot Container */}
      {isChatOpen && <ChatBot onClose={() => setIsChatOpen(false)} />}

      <footer className="py-6 px-4 border-t border-health-100 mt-10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-health-800 font-semibold">Femme care</span>
              <p className="text-sm text-muted-foreground mt-1">
                Empowering women through health insights
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Femme care. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
