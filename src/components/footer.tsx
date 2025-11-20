import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12">
      <div className="section-panel">
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Smart Traffic Management</h3>
              <p className="text-sm text-gray-600">
                Revolutionizing urban mobility with AI-powered traffic control and real-time analytics.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-medium">Technologies</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>YOLO Object Detection</li>
                <li>SUMO Simulation</li>
                <li>Real-time Analytics</li>
                <li>AI Optimization</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-medium">Contact</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>📧 support@smarttraffic.com</p>
                <p>📞 +1 (555) 123-4567</p>
                <p>🏢 123 Innovation Drive, Tech City</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 text-center">
            <p className="text-sm text-gray-500">
              © 2024 Smart Traffic Management System. All rights reserved. | Built with Next.js & Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
