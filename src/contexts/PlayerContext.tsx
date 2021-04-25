import { createContext, ReactNode, useContext, useState } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData = {
  episodeList: Array<Episode>
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  play: (episode: Episode) => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  clearPlayerState: () => void;
  playList: (episodes: Array<Episode>, index: number) => void;
  setPlayingState: (state: boolean) => void;
}

type PlayerContextProviderProps = {
  children: ReactNode;
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const hasPrevious = currentEpisodeIndex > 0
  const hasNext = isShuffling || currentEpisodeIndex + 1 < episodeList.length

  function play(episode: Episode): void {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playNext(): void {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
      setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    } else if (!hasNext) {
      const nextEpisodeIndex = currentEpisodeIndex + 1
      setCurrentEpisodeIndex(nextEpisodeIndex)
    }
  }

  function playPrevious(): void {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }

  function playList(episodes: Array<Episode>, index: number): void {
    setEpisodeList(episodes);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay(): void {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop(): void {
    setIsLooping(!isLooping);
  }

  function toggleShuffle(): void {
    setIsShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean): void {
    setIsPlaying(state);
  }

  function clearPlayerState(): void {
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  return (
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      isPlaying,
      togglePlay,
      setPlayingState,
      playList,
      playNext,
      playPrevious,
      play,
      hasNext,
      hasPrevious,
      toggleLoop,
      isLooping,
      toggleShuffle,
      isShuffling,
      clearPlayerState
    }} >
      { children }
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}