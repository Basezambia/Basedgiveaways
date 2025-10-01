const ROOT_URL = process.env.NEXT_PUBLIC_ROOT_URL || 'https://www.basedgiveaways.xyz'

export const minikitConfig = {
  accountAssociation: {
    "header": "eyJmaWQiOjEyMTg1OTksInR5cGUiOm51bGwsImtleSI6IjB4ZDgxMDM3RDNCZGU0ZDE4NjE3NDgzNzllZGI0QTVFNjhENmQ4NzRmQiJ9",
    "payload": "eyJkb21haW4iOiJ3d3cuYmFzZWRnaXZlYXdheXMueHl6In0",
    "signature": "MHgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDIwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwNDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAyMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwYzAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMTIwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxNzAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDFmNGRhYzczNzI0MmUwZjA2OGYyNzA3MTkzMmU0M2RlZmU2ZjZiNmQwODk3MTg0ODI3NDY0YTBiZjFmZGRiZTJhNzNiOTcwY2NmOTFlNDNlMGZmZjE2ZmVmYWZiMWQ2OWRkZWU2NmQ4MDAwYTgyOWE2ODkxY2VhNGRiZjlmZWU1MzAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMjVmMTk4MDg2YjJkYjE3MjU2NzMxYmM0NTY2NzNiOTZiY2VmMjNmNTFkMWZiYWNkZDdjNDM3OWVmNjU0NjU1NzJmMDUwMDAwMDJlOTAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwOGE3YjIyNzQ3OTcwNjUyMjNhMjI3NzY1NjI2MTc1NzQ2ODZlMmU2NzY1NzQyMjJjMjI2MzY4NjE2YzZjNjU2ZTY3NjUyMjNhMjI2ZDJkNmY0NDRiNTYzMjQ2NTIzNTZhNDQ3YTVmNjM3YTQ4NjQzNzY1NGE2NTRiNDg0ZTMxMzgzNTRjNTE0ZjZkNTM0ZjM4MzU1YTQyNzE2OTZmNTQ3NzIyMmMyMjZmNzI2OTY3Njk2ZTIyM2EyMjY4NzQ3NDcwNzMzYTJmMmY2YjY1Nzk3MzJlNjM2ZjY5NmU2MjYxNzM2NTJlNjM2ZjZkMjIyYzIyNjM3MjZmNzM3MzRmNzI2OTY3Njk2ZTIyM2E2NjYxNmM3MzY1N2QwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMA"
  },
  miniapp: {
    version: "1",
    name: "Base Giveaway",
    subtitle: "Win exclusive prizes on Base",
    description: "Participate in exclusive giveaways and win amazing prizes on the Base network",
    screenshotUrls: [`${ROOT_URL}/app-images/app-image-1284x2778.png`],
    iconUrl: `${ROOT_URL}/app-images/app-image-200x200.png`,
    splashImageUrl: `${ROOT_URL}/app-images/app-image-1024x1024.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social",
    tags: ["giveaway", "prizes", "base", "crypto", "social"],
    heroImageUrl: `${ROOT_URL}/app-images/app-image-1200x630.png`,
    tagline: "Win on Base",
    ogTitle: "Base Giveaway - Win Exclusive Prizes",
    ogDescription: "Participate in exclusive giveaways and win amazing prizes on the Base network",
    ogImageUrl: `${ROOT_URL}/app-images/app-image-1200x630.png`,
    noindex: false
  },
  baseBuilder: {
    allowedAddresses: ["0xd81037D3Bde4d1861748379edb4A5E68D6d874fB"]
  },
} as const