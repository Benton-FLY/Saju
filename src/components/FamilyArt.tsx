/** Original vector illustration drawn for this service. */
export function FamilyArt({ compact = false }: { compact?: boolean }) {
  return (
    <svg
      className={`family-art ${compact ? 'compact' : ''}`}
      viewBox="0 0 380 310"
      fill="none"
      role="img"
      aria-label="작은 꽃을 함께 들고 마주 보는 부모와 아이의 일러스트"
    >
      <circle cx="189" cy="142" r="118" fill="#eee8d9" />
      <circle cx="285" cy="57" r="22" fill="#d8b775" opacity=".72" />
      <path d="M42 237c56-16 97-15 143-4 62-17 112-9 152 5" stroke="#d2cbbb" strokeWidth="1" />
      <path d="M51 247c71-14 132-7 174-4m-119 17c68-7 112-6 175-2" stroke="#dbd5c6" />
      <path d="M90 236c-4-15-11-22-21-27m20 26c1-18 8-32 13-38" stroke="#7b8769" strokeWidth="2" />
      <path
        d="M70 209c-11-12-16-8-11 1 3 6 11 5 17 7m20-8c17-7 22-1 12 4-5 3-11 1-14 0"
        fill="#7b8769"
      />
      <path
        d="M105 229c1-42 10-73 24-83 14-13 45-16 59 10 13 20 14 49 9 76-30 8-68 9-92-3Z"
        fill="#355848"
      />
      <path d="M127 224c6-17 8-39 8-58m32 9 13 50" stroke="#597160" strokeWidth="1.3" />
      <path
        d="M131 129c-18-9-27-25-20-49 5-21 23-34 44-29 28 6 40 45 27 69l-12 17-39-8Z"
        fill="#303d32"
      />
      <path
        d="M134 79c-5 18-6 29-1 42 6 17 24 26 40 10 8-8 10-16 8-32-17 0-24-12-30-26-3 7-10 9-17 6Z"
        fill="#e9c7a8"
      />
      <path d="M153 142v9c8 7 16 6 20-1l-5-14" fill="#e9c7a8" />
      <path d="M168 109h1m-20-4h1" stroke="#303d32" strokeWidth="3" strokeLinecap="round" />
      <path d="M155 119c3 3 6 3 9 0" stroke="#9b6655" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="173" cy="118" rx="5" ry="3" fill="#d69a7e" opacity=".6" />
      <path d="M113 81c-17 9-17 25-5 29 9 3 15-2 15-10" fill="#303d32" />
      <path d="M167 173c8 12 22 20 40 15" stroke="#355848" strokeWidth="23" strokeLinecap="round" />
      <path d="M200 188c8-2 13-7 15-6 5 3-2 11-11 11" fill="#e9c7a8" />
      <path
        d="M220 233c-7-31-5-52 10-63 16-10 35-4 45 13 5 12 6 31 3 50-18 7-39 6-58 0Z"
        fill="#bb7656"
      />
      <path d="m232 191-3 37m32-42 5 45" stroke="#d69b7c" strokeWidth="1.2" />
      <path d="M222 146c-8-18-2-42 17-47 23-6 44 8 44 29 0 15-8 28-19 33l-42-15Z" fill="#303d32" />
      <path
        d="M226 129c-3 11-3 23 5 31 14 13 32 6 36-8 3-9 2-17-1-24-12 4-22 0-29-8-3 6-7 9-11 9Z"
        fill="#edcdae"
      />
      <path d="m242 163-1 10c7 5 14 4 18-1l-4-10" fill="#edcdae" />
      <path d="M232 141h1m17 1h1" stroke="#303d32" strokeWidth="3" strokeLinecap="round" />
      <path d="M238 152c3 3 6 3 9-1" stroke="#9b6655" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="229" cy="150" rx="4" ry="2.5" fill="#d69a7e" opacity=".6" />
      <path d="M235 184c-9 7-15 12-22 9" stroke="#bb7656" strokeWidth="17" strokeLinecap="round" />
      <path d="M216 192c-6-4-9-6-12-3-2 4 4 7 9 8" fill="#edcdae" />
      <path
        d="m207 188-4-27m1 12c-9-7-15-5-11 0 3 4 7 4 11 3m0 2c8-8 15-6 11-1-3 4-7 4-11 4"
        stroke="#7a8a62"
        strokeWidth="2"
        fill="#7a8a62"
      />
      <path
        d="M203 160c-17 3-19-9-8-10-6-13 6-18 11-7 9-10 17-2 9 5 13 7 4 17-6 10 0 11-12 12-6 2Z"
        fill="#c09350"
      />
      <circle cx="205" cy="151" r="3" fill="#f5e9cb" />
      <path
        d="M78 95v12m-6-6h12m222 73v10m-5-5h10M203 51v8m-4-4h8"
        stroke="#b59b6b"
        strokeWidth="1.2"
      />
      <path
        d="M78 150c8-9 11-8 14-4-5 0-10 1-14 4Zm13-7c-2-10 2-13 6-10 3 3 0 7-6 10Z"
        fill="#9b9e7e"
      />
      <path
        d="M143 246c6 3 18 4 27 1m71-1c7 2 14 3 22 0"
        stroke="#8d7964"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M150 274c29 9 64 10 89 1"
        stroke="#b6ab92"
        strokeDasharray="2 5"
        strokeLinecap="round"
      />
    </svg>
  );
}
