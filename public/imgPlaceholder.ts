const shimmer = (w: number, h: number) => 
`<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="rgba(35, 12, 57, 0.4)" offset="20%" />
      <stop stop-color="rgba(21, 9, 41, 0.4)" offset="50%" />
      <stop stop-color="rgba(21, 14, 35, 0.4)" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="rgba(21, 14, 35, 0.4)" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="2s" repeatCount="indefinite"  />
</svg>`

const toBase64 = (str: string) =>
typeof window === 'undefined'
  ? Buffer.from(str).toString('base64')
  : window.btoa(str)

export const blurData = `data:image/svg+xml;base64,${toBase64(shimmer(700, 700))}`;