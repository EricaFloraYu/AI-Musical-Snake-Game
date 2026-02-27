import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Terminal,
} from "lucide-react";

const TRACKS = [
  {
    title: "ERR_01: DRIFT",
    artist: "SYS.ADMIN",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    title: "ERR_02: PULSE",
    artist: "SYS.ADMIN",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    title: "ERR_03: HORIZON",
    artist: "SYS.ADMIN",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          // Autoplay might be blocked
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const handleEnded = () => {
    playNext();
  };

  return (
    <div className="bg-black border-4 border-[#0ff] p-6 shadow-[8px_8px_0px_#f0f] w-full max-w-md mx-auto flex flex-col items-center space-y-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#f0f] animate-pulse"></div>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleEnded}
        preload="auto"
      />

      <div
        className="w-24 h-24 border-4 border-[#f0f] bg-black flex items-center justify-center shadow-[0_0_15px_#f0f] screen-tear"
      >
        <Terminal className={`w-12 h-12 text-[#0ff] ${isPlaying ? 'animate-pulse' : ''}`} />
      </div>

      <div className="text-center w-full border-b-2 border-[#0ff] pb-4">
        <h2 className="text-4xl font-bold text-[#0ff] glitch-text uppercase">
          {currentTrack.title}
        </h2>
        <p className="text-2xl text-[#f0f] uppercase">[{currentTrack.artist}]</p>
      </div>

      <div className="flex items-center space-x-8">
        <button
          onClick={playPrev}
          className="text-[#0ff] hover:text-[#f0f] transition-colors hover:scale-110"
        >
          <SkipBack className="w-10 h-10 drop-shadow-[2px_2px_0px_#f0f]" />
        </button>

        <button
          onClick={togglePlay}
          className="bg-[#0ff] hover:bg-[#f0f] text-black rounded-none p-4 shadow-[4px_4px_0px_#f0f] hover:shadow-[4px_4px_0px_#0ff] transition-all transform"
        >
          {isPlaying ? (
            <Pause className="w-12 h-12" />
          ) : (
            <Play className="w-12 h-12 ml-1" />
          )}
        </button>

        <button
          onClick={playNext}
          className="text-[#0ff] hover:text-[#f0f] transition-colors hover:scale-110"
        >
          <SkipForward className="w-10 h-10 drop-shadow-[2px_2px_0px_#f0f]" />
        </button>
      </div>

      <div className="flex items-center justify-between w-full pt-4">
        <button
          onClick={toggleMute}
          className="text-[#f0f] hover:text-[#0ff] transition-colors"
        >
          {isMuted ? (
            <VolumeX className="w-8 h-8" />
          ) : (
            <Volume2 className="w-8 h-8" />
          )}
        </button>
        <div className="flex space-x-2">
          {TRACKS.map((_, idx) => (
            <div
              key={idx}
              className={`h-4 transition-all duration-75 border-2 ${idx === currentTrackIndex ? "w-8 bg-[#0ff] border-[#0ff] shadow-[2px_2px_0px_#f0f]" : "w-4 bg-black border-[#f0f]"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
