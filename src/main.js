import { Clerk } from '@clerk/clerk-js'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!publishableKey) {
  throw new Error("Add your VITE_CLERK_PUBLISHABLE_KEY to the .env file")
}

// 1. Load the Clerk UI bundle
const clerkDomain = atob(publishableKey.split('_')[2]).slice(0, -1)
await new Promise((resolve, reject) => {
  const script = document.createElement('script')
  script.src = `https://${clerkDomain}/npm/@clerk/ui@1/dist/ui.browser.js`
  script.async = true
  script.crossOrigin = 'anonymous'
  script.onload = resolve
  script.onerror = () => reject(new Error('Failed to load Clerk UI'))
  document.head.appendChild(script)
})

// 2. Initialize Clerk with the UI loader
const clerk = new Clerk(publishableKey)
await clerk.load({
  ui: { ClerkUI: window.__internal_ClerkUICtor },
})

// 3. Render the components
if (clerk.user) {
  document.getElementById('app').innerHTML = `<div id="user-button"></div>`
  clerk.mountUserButton(document.getElementById('user-button'))
} else {
  document.getElementById('app').innerHTML = `<div id="sign-in"></div>`
  clerk.mountSignIn(document.getElementById('sign-in'))
}