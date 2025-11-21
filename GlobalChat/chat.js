let messages = []

export default function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`)

  if (url.searchParams.has("send")) {
    const user = req.headers["user"]
    const message = req.headers["message"]
    const userImage = req.headers["userimage"]
    if (!user || !message || !userImage) return res.status(400).send("Missing header")

    messages.push({ User: user, Message: message, UserImage: userImage })
    if (messages.length > 50) messages.shift()
    return res.status(200).send("Message sent")
  }

  if (url.searchParams.has("receive")) {
    const limit = parseInt(url.searchParams.get("receive")) || 50
    return res.status(200).json(messages.slice(-limit))
  }

  return res.status(404).send("Invalid request")
}
