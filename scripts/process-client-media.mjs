import { createServer } from 'node:http'
import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { chromium } from 'playwright-core'

const rawRoot = join(process.cwd(), 'public/assets/client/raw')
const outputRoot = join(process.cwd(), 'public/assets/client/projects')
const files = (await readdir(rawRoot)).filter(file => /\.(jpe?g|mp4)$/i.test(file)).sort((a,b) => a.localeCompare(b, undefined, { numeric: true }))

const photoGroups = {
  fence: [1,6,8,11,15,19,24,25,27,28,29,30,32,33,34,35,41,42,48,49,50],
  commercial: [2,9,13,16,17,18,22,26],
  exterior: [3,5,43,51,52,55,56,61,82],
  interior: [20,21,53,54,72,73,74,79,80,81],
  outdoor: [12,23],
  brand: [31],
}

const videoGroups = {
  fence: [113],
  exterior: [114,116,117],
  outdoor: [115],
}

const server = createServer(async (request,response) => {
  try {
    const index = Number(new URL(request.url, 'http://127.0.0.1:4194').searchParams.get('index')) - 1
    const file = files[index]
    if (!file) throw new Error('Unknown asset')
    response.writeHead(200, {'Content-Type': extname(file).toLowerCase() === '.mp4' ? 'video/mp4' : 'image/jpeg', 'Access-Control-Allow-Origin': '*'})
    response.end(await readFile(join(rawRoot,file)))
  } catch {
    response.writeHead(404)
    response.end('Not found')
  }
})

await new Promise(resolve => server.listen(4194,'127.0.0.1',resolve))
const browser = await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'})
const page = await browser.newPage()

async function imageData(index, video = false) {
  return page.evaluate(async ({index,video}) => {
    const media = document.createElement(video ? 'video' : 'img')
    media.crossOrigin = 'anonymous'
    if (video) {
      media.muted = true
      media.preload = 'auto'
      media.src = `http://127.0.0.1:4194/?index=${index}`
      await new Promise((resolve,reject) => {
        media.onloadeddata = resolve
        media.onerror = reject
      })
      media.currentTime = Math.min(.35, media.duration || .35)
      await new Promise(resolve => { media.onseeked = resolve; setTimeout(resolve,800) })
    } else {
      media.src = `http://127.0.0.1:4194/?index=${index}`
      await media.decode()
    }
    const width = video ? media.videoWidth : media.naturalWidth
    const height = video ? media.videoHeight : media.naturalHeight
    const scale = Math.min(1,1600/width,1200/height)
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1,Math.round(width*scale))
    canvas.height = Math.max(1,Math.round(height*scale))
    canvas.getContext('2d').drawImage(media,0,0,canvas.width,canvas.height)
    return canvas.toDataURL('image/webp',.82).split(',')[1]
  }, {index,video})
}

for (const [category,indexes] of Object.entries(photoGroups)) {
  const directory = join(outputRoot,category)
  await mkdir(directory,{recursive:true})
  for (const [position,index] of indexes.entries()) {
    const output = join(directory,`${category}-${String(position+1).padStart(2,'0')}.webp`)
    await writeFile(output,Buffer.from(await imageData(index),'base64'))
  }
}

for (const [category,indexes] of Object.entries(videoGroups)) {
  const directory = join(outputRoot,category)
  await mkdir(directory,{recursive:true})
  for (const [position,index] of indexes.entries()) {
    const stem = `${category}-video-${String(position+1).padStart(2,'0')}`
    await copyFile(join(rawRoot,files[index-1]),join(directory,`${stem}.mp4`))
    await writeFile(join(directory,`${stem}-poster.webp`),Buffer.from(await imageData(index,true),'base64'))
  }
}

await browser.close()
await new Promise(resolve => server.close(resolve))
console.log('Processed 51 unique photos and 5 unique videos.')
