import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
} from "lucide-react";

export interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Pulse (AI Generated)",
    artist: "Cyber Synth AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "Digital Grid (AI Generated)",
    artist: "Cyber Synth AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "Retro Overdrive (AI Generated)",
    artist: "Cyber Synth AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((e) => console.error("Audio play failed:", e));
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
  const toggleMute = () => setIsMuted(!isMuted);

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? TRACKS.length - 1 : prev - 1));
    setIsPlaying(true);
  };

  const handleEnded = () => {
    playNext();
  };

  return (
    <>
      <div className="aspect-square w-full neon-border mb-4 overflow-hidden relative group shrink-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 to-blue-900 opacity-60"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 border-2 border-white/20 rounded-full flex items-center justify-center relative">
            <div className={`w-16 h-16 border border-[#00ffff]/70 rounded-full ${isPlaying ? 'animate-ping' : ''}`}></div>
            <Music className={`absolute text-[#00ffff] ${isPlaying ? 'animate-pulse' : ''}`} size={24} />
          </div>
        </div>
        <div className="absolute bottom-2 left-2 flex flex-col">
          <span className="text-[10px] neon-blue uppercase">Now Playing</span>
          <span className="text-sm font-bold truncate max-w-[200px]">{currentTrack.title}</span>
        </div>
      </div>

      <div className="space-y-4 mb-6 shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[10px] uppercase opacity-60">
            <span>{currentTrack.artist}</span>
            <span>{isMuted ? 'MUTED' : 'VOL 50%'}</span>
          </div>
          <div className="h-1 bg-white/10 w-full rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400 w-2/3"></div>
          </div>
        </div>

        <div className="flex justify-center gap-6 items-center">
          <button onClick={playPrev} className="opacity-50 hover:opacity-100 focus:outline-none">
            <SkipBack size={20} />
          </button>
          <button 
            onClick={togglePlay}
            className="w-12 h-12 rounded-full border border-cyan-400 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:bg-cyan-400 hover:text-[#020205] transition-all focus:outline-none"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={playNext} className="opacity-50 hover:opacity-100 focus:outline-none">
            <SkipForward size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 flex-1 overflow-y-auto min-h-[120px]">
        <div className="flex justify-between items-center mb-1">
           <span className="text-[10px] uppercase tracking-widest opacity-50">Queue</span>
           <button onClick={toggleMute} className="opacity-50 hover:opacity-100 outline-none">
             {isMuted ? <VolumeX size={14}/> : <Volume2 size={14} />}
           </button>
        </div>
        
        {TRACKS.map((track, i) => (
          <div 
            key={track.id} 
            onClick={() => { setCurrentTrackIndex(i); setIsPlaying(true); }}
            className={`flex items-center gap-3 p-2 cursor-pointer transition-all ${
              currentTrackIndex === i 
                ? 'bg-white/5 border-l-2 border-cyan-400 opacity-100' 
                : 'hover:bg-white/5 opacity-60'
            }`}
          >
            <div className={`w-8 h-8 flex items-center justify-center text-[10px] ${
              i === 0 ? 'bg-purple-500/20' : i === 1 ? 'bg-blue-500/20' : 'bg-pink-500/20'
            }`}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold truncate">{track.title}</span>
              <span className="text-[9px] opacity-50 truncate">{track.artist}</span>
            </div>
          </div>
        ))}
      </div>

      <audio ref={audioRef} src={currentTrack.url} onEnded={handleEnded} />
    </>
  );
}
