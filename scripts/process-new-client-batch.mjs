import { createServer } from 'node:http'
import { createHash } from 'node:crypto'
import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { extname, join, resolve } from 'node:path'
import { chromium } from 'playwright-core'

const inputRoot=resolve(process.env.SPP_NEW_BATCH_INPUT||'.tmp/new-image-batch/New folder')
const outputRoot=resolve('public/assets/client/projects/new-batch')
const files=(await readdir(inputRoot)).filter(file=>/\.(?:jpe?g|mp4)$/i.test(file)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}))
await mkdir(outputRoot,{recursive:true})

const hashes=new Set()
const unique=[]
for(const [position,file] of files.entries()){
  const buffer=await readFile(join(inputRoot,file))
  const hash=createHash('sha256').update(buffer).digest('hex')
  if(hashes.has(hash))continue
  hashes.add(hash)
  unique.push({index:position+1,file,buffer,isVideo:/\.mp4$/i.test(file)})
}

const server=createServer((request,response)=>{
  const index=Number(new URL(request.url,'http://127.0.0.1:4198').searchParams.get('i'))
  const item=unique[index]
  if(!item){response.writeHead(404);response.end();return}
  response.writeHead(200,{'Content-Type':item.isVideo?'video/mp4':'image/jpeg','Access-Control-Allow-Origin':'*'})
  response.end(item.buffer)
})
await new Promise(resolveListen=>server.listen(4198,'127.0.0.1',resolveListen))
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'})
const page=await browser.newPage()

async function webp(itemPosition,isVideo=false){
  return page.evaluate(async({itemPosition,isVideo})=>{
    const media=document.createElement(isVideo?'video':'img')
    media.crossOrigin='anonymous'
    media.src=`http://127.0.0.1:4198/?i=${itemPosition}`
    if(isVideo){
      media.muted=true
      media.preload='auto'
      await new Promise((resolveLoaded,reject)=>{media.onloadeddata=resolveLoaded;media.onerror=reject})
      media.currentTime=Math.min(.6,Math.max(0,(media.duration||1)/3))
      await new Promise(resolveSeek=>{media.onseeked=resolveSeek;setTimeout(resolveSeek,1000)})
    }else{
      await media.decode()
    }
    const width=isVideo?media.videoWidth:media.naturalWidth
    const height=isVideo?media.videoHeight:media.naturalHeight
    const scale=Math.min(1,1600/width,1600/height)
    const canvas=document.createElement('canvas')
    canvas.width=Math.max(1,Math.round(width*scale))
    canvas.height=Math.max(1,Math.round(height*scale))
    canvas.getContext('2d').drawImage(media,0,0,canvas.width,canvas.height)
    return {
      data:canvas.toDataURL('image/webp',.76).split(',')[1],
      width:canvas.width,
      height:canvas.height,
    }
  },{itemPosition,isVideo})
}

const manifest=[]
let outputBytes=0
for(const [itemPosition,item] of unique.entries()){
  const stem=`batch-${String(item.index).padStart(3,'0')}`
  if(item.isVideo){
    const videoName=`${stem}.mp4`
    const posterName=`${stem}-poster.webp`
    await copyFile(join(inputRoot,item.file),join(outputRoot,videoName))
    const poster=await webp(itemPosition,true)
    const posterBuffer=Buffer.from(poster.data,'base64')
    await writeFile(join(outputRoot,posterName),posterBuffer)
    outputBytes+=item.buffer.length+posterBuffer.length
    manifest.push({index:item.index,type:'video',src:videoName,poster:posterName,width:poster.width,height:poster.height,source:item.file})
  }else{
    const imageName=`${stem}.webp`
    const image=await webp(itemPosition)
    const imageBuffer=Buffer.from(image.data,'base64')
    await writeFile(join(outputRoot,imageName),imageBuffer)
    outputBytes+=imageBuffer.length
    manifest.push({index:item.index,type:'image',src:imageName,width:image.width,height:image.height,source:item.file})
  }
}
await writeFile(join(outputRoot,'manifest.json'),JSON.stringify(manifest,null,2))
await browser.close()
await new Promise(resolveClose=>server.close(resolveClose))

console.log(JSON.stringify({
  sourceFiles:files.length,
  uniqueFiles:unique.length,
  exactDuplicatesSkipped:files.length-unique.length,
  inputBytes:unique.reduce((sum,item)=>sum+item.buffer.length,0),
  outputBytes,
  reductionPercent:Math.round((1-outputBytes/unique.reduce((sum,item)=>sum+item.buffer.length,0))*1000)/10,
},null,2))
