const GRID_SIZE = 21;
const FINDER_SIZE = 7;

function fnv1aHash(value: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function isInFinderZone(row: number, col: number): boolean {
  const zones = [
    [0, 0],
    [0, GRID_SIZE - FINDER_SIZE],
    [GRID_SIZE - FINDER_SIZE, 0],
  ];
  return zones.some(([zr, zc]) => row >= zr && row < zr + FINDER_SIZE && col >= zc && col < zc + FINDER_SIZE);
}

function buildGrid(value: string): boolean[][] {
  const rand = mulberry32(fnv1aHash(value || "talkrx"));
  const grid: boolean[][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      row.push(isInFinderZone(r, c) ? false : rand() > 0.56);
    }
    grid.push(row);
  }
  return grid;
}

function FinderPattern({ top, left }: { top: number; left: number }) {
  return (
    <div
      className="absolute border-[3px] border-black"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        width: `${(FINDER_SIZE / GRID_SIZE) * 100}%`,
        height: `${(FINDER_SIZE / GRID_SIZE) * 100}%`,
      }}
    >
      <div className="absolute inset-[22%] bg-black" />
    </div>
  );
}

export function PseudoQr({ value, size = 128, caption = true }: { value: string; size?: number; caption?: boolean }) {
  const grid = buildGrid(value);
  const cell = 100 / GRID_SIZE;

  return (
    <div className="inline-flex flex-col items-center gap-1.5">
      <div
        className="relative rounded-lg bg-white p-2 shadow-sm border border-black/10"
        style={{ width: size, height: size }}
      >
        <div className="relative h-full w-full">
          {grid.map((row, r) =>
            row.map((on, c) =>
              on ? (
                <div
                  key={`${r}-${c}`}
                  className="absolute bg-black"
                  style={{
                    top: `${r * cell}%`,
                    left: `${c * cell}%`,
                    width: `${cell}%`,
                    height: `${cell}%`,
                  }}
                />
              ) : null
            )
          )}
          <FinderPattern top={0} left={0} />
          <FinderPattern top={0} left={(1 - FINDER_SIZE / GRID_SIZE) * 100} />
          <FinderPattern top={(1 - FINDER_SIZE / GRID_SIZE) * 100} left={0} />
        </div>
      </div>
      {caption && (
        <span className="text-[9px] uppercase tracking-wider text-neutral-400 text-center" style={{ fontFamily: "var(--do-font-label)" }}>
          Demo identity code &bull; not camera-scannable
        </span>
      )}
    </div>
  );
}
