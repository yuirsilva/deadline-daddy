import webPush from "web-push"

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
const vapidSubject = process.env.VAPID_SUBJECT

if (vapidPublicKey && vapidPrivateKey && vapidSubject) {
  webPush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey)
}

export async function sendPushNotification(
  subscription: string,
  title: string,
  body: string,
  url?: string
) {
  if (!vapidPublicKey || !vapidPrivateKey) {
    console.warn("VAPID keys not configured")
    return
  }

  const parsedSubscription = JSON.parse(subscription)

  const payload = JSON.stringify({
    title,
    body,
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    url: url || "/dashboard",
  })

  await webPush.sendNotification(parsedSubscription, payload)
}
