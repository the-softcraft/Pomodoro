import { create } from "zustand";

interface TimerState {
  workMin: number;
  breakMin: number;
  longBreakMin: number;
  sessionsBeforeLong: number;
  mode: "work" | "break" | "longBreak";
  secondsLeft: number;
  running: boolean;
  completed: number;
  setDurations: (w: number, b: number, l: number, n: number) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
  skip: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  workMin: 25,
  breakMin: 5,
  longBreakMin: 15,
  sessionsBeforeLong: 4,
  mode: "work",
  secondsLeft: 25 * 60,
  running: false,
  completed: 0,

  setDurations: (w, b, l, n) =>
    set((s) => ({
      workMin: w,
      breakMin: b,
      longBreakMin: l,
      sessionsBeforeLong: n,
      secondsLeft: s.mode === "work" ? w * 60 : s.mode === "break" ? b * 60 : l * 60,
      running: false,
    })),

  start: () => set({ running: true }),
  pause: () => set({ running: false }),
  reset: () => {
    const s = get();
    const mins = s.mode === "work" ? s.workMin : s.mode === "break" ? s.breakMin : s.longBreakMin;
    set({ secondsLeft: mins * 60, running: false });
  },
  tick: () => {
    const s = get();
    if (!s.running) return;
    if (s.secondsLeft <= 1) {
      // session ended
      if (s.mode === "work") {
        const completed = s.completed + 1;
        const long = completed % s.sessionsBeforeLong === 0;
        set({
          completed,
          mode: long ? "longBreak" : "break",
          secondsLeft: (long ? s.longBreakMin : s.breakMin) * 60,
          running: false,
        });
      } else {
        set({
          mode: "work",
          secondsLeft: s.workMin * 60,
          running: false,
        });
      }
    } else {
      set({ secondsLeft: s.secondsLeft - 1 });
    }
  },
  skip: () => {
    const s = get();
    if (s.mode === "work") {
      const completed = s.completed + 1;
      const long = completed % s.sessionsBeforeLong === 0;
      set({ completed, mode: long ? "longBreak" : "break", secondsLeft: (long ? s.longBreakMin : s.breakMin) * 60, running: false });
    } else {
      set({ mode: "work", secondsLeft: s.workMin * 60, running: false });
    }
  },
}));
