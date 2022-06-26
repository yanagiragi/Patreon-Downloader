// Runtime: Node.js

import fs from 'fs'
import path from 'path'
import sanitize from 'sanitize-filename'
import { load } from 'cheerio'

const user = sanitize('xxx') // root folder you want

const posts = JSON.parse(fs.readFileSync('data/posts.json')) // result from GetPost.js

async function ParsePostAttributeToImageUrls()
{
    const result = []
    const fetched = JSON.parse(fs.readFileSync('data/fetched.json')) // result from ParsePost.js
    for (let index = 0; index < fetched.length; index++) {
        const element = fetched[index];
        const data = element.data
        
        const matchFunc = included => {
            // image from static content (https://c10.patreonusercontent.com)
            if(included?.attributes?.image_urls != null){
                return {
                    file_name: included.attributes.file_name,
                    image_url: included.attributes.image_urls.original
                }
            }

            // image access by https://www.patreon.com/file?
            else if (included?.attributes?.url?.includes('file?'))
            {
                return {
                    file_name: included.attributes.name,
                    image_url: included.attributes.url
                }
            }
            return null
        }

        const postId = data.post.data.id
        const post = posts.filter(x => x.href == element.href)[0]
        const title = sanitize(`${postId} - ${post.title.trim()}`)
        
        let matched = data.post.included.map(matchFunc).filter(Boolean)
        matched.map(x => {
            x.root_folder_name = user
            x.folder_name = title
            if (x.file_name == 'Untitled') {
                x.file_name = `${x.file_name}.jpg`
            }
            x.file_name = path.join(user, title, x.file_name)
        })

        // some images are hided in post contents (html)
        const content = data.post.data.attributes.content
        const $ = load(content)
        const imgs = $('img')
        for (let i = 0; i < imgs.length; i++) {
            const img = $(imgs[i]);
            const file_name = img.attr('data-media-id') + '.jpg'
            const image_url = img.attr('src')
            matched.push({
                root_folder_name:  user,
                folder_name: title,
                file_name: path.join(user, title, file_name),
                image_url
            })
        }
        result.push(matched)
    }

    fs.writeFileSync('data/processed.json', JSON.stringify(result.flat(), null, 4))
}

ParsePostAttributeToImageUrls()