# Patreon Downloader

Half automated patreon contents (Mostly images) downloader

## Procedures

1. GetPost (Browser, suggest save path: `bin/data/posts.json`)
2. ParsePost (Browser, suggest save path: `bin/data/fetched.json`)
3. ParsePostAttributeToImageUrls (Node.js)
4. DownloadImage (Node.js)