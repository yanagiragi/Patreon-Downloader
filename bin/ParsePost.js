// Runtime: Browser

const posts = [] // replace this line to contents from GetPost.js

async function FetchData()
{
    const container = []
    for (let index = 0; index < posts.length; index++) {
        const post = posts[index];
        
        if (post.href.includes('join')) {
            console.log(`Skip ${index}: ${post.href}`)
            continue;
        }
        else {
            console.log(`Process ${index}: ${post.href}`)
        }
        
        const resp = await fetch(post.href, {
            "credentials": "include",
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:101.0) Gecko/20100101 Firefox/101.0",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": "zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3",
                "Upgrade-Insecure-Requests": "1",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "none",
                "Sec-Fetch-User": "?1",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache"
            },
            "method": "GET",
            "mode": "cors"
        });
        const text = await resp.text()

        let match = text.substring(
            text.indexOf('Object.assign(window.patreon.bootstrap, ') + 'Object.assign(window.patreon.bootstrap, '.length, 
            text.indexOf('Object.assign(window.patreon.campaignFeatures')
        ).trim()
        match = match.substring(0, match.length - 2)

        const data = JSON.parse(match)

        container.push({ href: post.href, data : data })
    }

    console.log(JSON.stringify(container))
}

FetchData()