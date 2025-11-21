let messages = []

export default async function handler(req, res) {

    if (req.method === "POST" && req.url.includes("send=true")) {
        try {
            const body = await req.json()
            const user = body.User
            const message = body.Message
            const userImage = body.UserImage
            if (!user || !message || !userImage) 
                return res.status(400).send("Missing fields")
            messages.push({ User: user, Message: message, UserImage: userImage })
            if (messages.length > 50) messages.shift()
            return res.status(200).send("Message sent")
        } catch {
            return res.status(400).send("Invalid JSON")
        }
    }

    if (req.method === "GET" && req.url.includes("receive")) {
        const urlParams = new URL(req.url, `http://${req.headers.host}`)
        const limit = parseInt(urlParams.searchParams.get("receive")) || 50
        return res.status(200).json(messages.slice(-limit))
    }

    return res.status(404).send("Invalid request")
}
