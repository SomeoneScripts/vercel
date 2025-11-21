let messages = []

export default async function handler(req, res) {

    const url = new URL(req.url, `http://${req.headers.host}`)

    if (url.searchParams.has("send") && req.method === "POST") {
        try {
            const body = await req.json()
            const user = body.User
            const message = body.Message
            const userImage = body.UserImage

            if (!user || !message || !userImage) 
                return res.status(400).send("Missing fields")

            messages.push({ User: user, Message: message, UserImage: userImage })

            if (messages.length > 50) 
                messages.shift()

            return res.status(200).send("Message sent")

        } catch {
            return res.status(400).send("Invalid JSON")
        }
    }

    if (url.searchParams.has("receive")) {
        const limit = parseInt(url.searchParams.get("receive")) ||
