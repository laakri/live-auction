import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { PlayIcon, PlusIcon } from "lucide-react";

const ProfileTest = () => {
  return (
    <div className="min-h-screen  text-white ">
      <div className="relative overflow-hidden rounded-xl my-4 mr-4">
        {/* Blurred background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://i.gyazo.com/edc5fab952f9dba49341d1c8b049675e.png')",
            filter: "blur(20px)",
            transform: "scale(1.1)",
          }}
        />

        {/* Content overlay */}

        <div className="relative bg-zinc-900/70 p-6 ">
          <div className="flex items-center  justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-32 w-32 rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700/50"
              >
                <PlusIcon className="h-10 w-10" />
              </Button>
              <div>
                <h1 className="text-4xl font-bold mb-1">Select a voice</h1>
                <a
                  href="#"
                  className="text-zinc-300 hover:text-purple-400 hover:underline text-sm"
                >
                  Read our guide to learn how to get the best conversion
                  results.
                </a>
              </div>
            </div>
            <Card className="ml-auto bg-purple-900/80 p-4 rounded-xl">
              <div className="flex flex-col justify-between gap-4 items-center   ">
                <div>
                  <span className="text-xs font-semibold text-purple-300">
                    TUTORIAL
                  </span>
                  <h3 className="text-lg font-semibold">
                    How to convert a voice
                  </h3>
                </div>
                <Button variant="secondary" className=" w-full">
                  Watch tutorial
                  <span className="ml-2">→</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <main className="max-w-6xl mx-auto">
        {/* Voice controls */}
        <div className="flex space-x-2 mb-4">
          <Button variant="outline" className="text-sm">
            SWITCH VOICE
          </Button>
          <Button variant="outline" className="text-sm">
            + ADD VOICE
          </Button>
        </div>

        {/* Desktop app promotion */}
        <Card className="bg-purple-950 p-4 mb-8 rounded-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <svg
                className="h-5 w-5 text-purple-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm">
                Install the Kits.AI Desktop App for the fastest Kits workflow,
                featuring drag-and-drop integrations with your favorite DAWs.
              </p>
            </div>
            <Button variant="secondary" size="sm">
              INSTALL
            </Button>
          </div>
        </Card>

        {/* Input/Output section */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="bg-zinc-900 p-6 rounded-xl">
            <h3 className="font-semibold mb-4">Input</h3>
            <div className="flex space-x-2 mb-6">
              <Button variant="outline" size="sm" className="text-xs">
                AUDIO INPUT
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                SONG INPUT
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                TEXT-TO-SPEECH
              </Button>
            </div>
            <div className="border-2 border-dashed border-zinc-700 rounded-xl p-10 text-center mb-6">
              <div className="flex flex-col items-center">
                <svg
                  className="h-10 w-10 text-green-500 mb-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="font-semibold mb-1">Add or drop up to 5 files</p>
                <p className="text-sm text-zinc-400">
                  Click and browse, or drag and drop here
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                size="lg"
                className="text-left flex items-center space-x-2"
              >
                <PlayIcon className="h-5 w-5" />
                <span>Free demo audio</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-left flex items-center space-x-2"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a2 2 0 00-2 2v6a2 2 0 104 0V4a2 2 0 00-2-2zM5 8a5 5 0 1010 0H5z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Record</span>
              </Button>
            </div>
          </Card>
          <Card className="bg-zinc-900 p-6 rounded-xl">
            <h3 className="font-semibold mb-4">Output</h3>
            <div className="h-64 flex items-center justify-center text-zinc-400">
              <div className="text-center">
                <svg
                  className="h-10 w-10 mx-auto mb-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M19 10v2a7 7 0 01-14 0v-2M12 19v3M8 22h8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Your conversions will appear here
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};
export default ProfileTest;
