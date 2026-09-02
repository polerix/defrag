// ─── Drive presets ─────────────────────────────────────────────────────────
// Inspired by defrag98.com's drive selector (C/D/E/F). Each entry only
// changes the display chrome and the used/free ratio the grid seeds with —
// the grid itself stays a fixed 50x16 so every drive plays out at the same
// pace, but a near-full RAM disk *feels* very different from a mostly-empty
// backup volume.
export const DRIVES = [
  { key: 'C', label: 'Local Disk',  capacity: '2,048 MB', fs: 'FAT-32', usedFrac: 0.57 },
  { key: 'D', label: 'Data Disk',   capacity: '4,096 MB', fs: 'FAT-32', usedFrac: 0.75 },
  { key: 'E', label: 'Backup Vol',  capacity: '8,192 MB', fs: 'NTFS',   usedFrac: 0.32 },
  { key: 'F', label: 'RAM Disk',    capacity: '256 MB',   fs: 'FAT-16', usedFrac: 0.88 },
];
