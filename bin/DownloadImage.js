// Runtime: Node.js

import fs from 'fs'
import fetch from 'node-fetch'
import path from 'path'
import util from 'util'
import { pipeline } from 'stream'
import open from 'open'

const streamPipeline = util.promisify(pipeline)

async function DownloadImage()
{
    const fetched = JSON.parse(fs.readFileSync('data/processed.json')) // result from ParsePostAttributeToImageUrls.js

    const totalCount = fetched.reduce((acc, ele) => acc + (ele.image_urls?.length ?? 1), 0)
    for (let index = 0; index < fetched.length; index++) {
        const element = fetched[index];
        
        if(!fs.existsSync(element.root_folder_name)) {
            fs.mkdirSync(element.root_folder_name)
        }

        const folder_name = path.join(element.root_folder_name, element.folder_name)
        if(!fs.existsSync(folder_name)) {
            fs.mkdirSync(folder_name)
        }

        const url = element.image_url

        if (fs.existsSync(element.file_name))
            continue

        if (url.includes('file?')) {
            console.log(`${element.file_name} must manually download!`)
            open(element.image_url)
        }

        console.log(`Downloading ${index + 1}/${totalCount}: ${url} -> ${element.file_name}`)
        const resp = await fetch(url)
        await streamPipeline(resp.body, fs.createWriteStream(element.file_name))
        console.log(`Done ${index + 1}/${totalCount}: ${url}`)
    }
}

DownloadImage()