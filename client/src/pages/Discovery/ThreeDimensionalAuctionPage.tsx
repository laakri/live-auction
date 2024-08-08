import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  CSS3DObject,
  CSS3DRenderer,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Auction } from "../../services/auctionService";

const ThreeDimensionalAuctionPage: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<CSS3DRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auctions/3d`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch auctions");
        }
        const data = await response.json();
        setAuctions(data.auctions);
      } catch (error) {
        console.error("Error fetching 3D auctions:", error);
        setError("Failed to load auctions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new CSS3DRenderer();
    const controls = new OrbitControls(camera, renderer.domElement);

    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    camera.position.z = 500;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    controlsRef.current = controls;

    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (
      !sceneRef.current ||
      !cameraRef.current ||
      !rendererRef.current ||
      !controlsRef.current
    )
      return;

    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    const controls = controlsRef.current;

    // Clear existing objects
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }

    // Add auction cards to the 3D scene
    auctions.forEach((auction, index) => {
      const element = document.createElement("div");
      element.className = "auction-card";
      element.style.width = "200px";
      element.style.height = "300px";
      element.innerHTML = `
        <div class="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
          <img src="${import.meta.env.VITE_API_URL}/uploads/${
        auction.image
      }" alt="${auction.title}" class="w-full h-32 object-cover" />
          <div class="p-4">
            <h3 class="text-lg font-bold text-white mb-2 truncate">${
              auction.title
            }</h3>
            <p class="text-sm text-gray-300 mb-2">$${auction.currentPrice.toLocaleString()}</p>
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-400">${
                auction.watchersCount
              } viewers</span>
              <button class="bg-purple-600 text-white text-xs px-2 py-1 rounded">Bid Now</button>
            </div>
          </div>
        </div>
      `;

      const object = new CSS3DObject(element);
      const phi = Math.acos(-1 + (2 * index) / auctions.length);
      const theta = Math.sqrt(auctions.length * Math.PI) * phi;
      const radius = 800;

      object.position.setFromSphericalCoords(radius, phi, theta);
      object.lookAt(scene.position);
      scene.add(object);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();
  }, [auctions]);

  const handleSearch = () => {
    // Implement search functionality
    console.log("Search term:", searchTerm);
    // You might want to filter the auctions based on the search term
    // and update the 3D view accordingly
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-950 text-gray-100 overflow-hidden relative">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute top-0 left-0 right-0 p-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900/80 backdrop-blur-md rounded-lg shadow-lg p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-purple-300">
              3D Auction Space
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search auctions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow bg-gray-800 text-white border-gray-700 focus:border-purple-500"
            />
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button variant="secondary">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-900/80 backdrop-blur-md rounded-lg shadow-lg p-4"
        >
          <p className="text-center text-sm">
            Use your mouse or touch to explore the 3D auction space. Zoom in/out
            to discover more auctions.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ThreeDimensionalAuctionPage;
