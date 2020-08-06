const fs = require('fs')
const mkdirp = require('mkdirp')

const template = name => {
  let line = `#EXTM3U\n#EXT-X-VERSION:3\n`
  line += `#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360\n./../${name}_360/index.m3u8\n`
  line += `#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=842x480\n./../${name}_480/index.m3u8\n`
  line += `#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720\n./../${name}_720/index.m3u8\n`
  // line += `#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080\n./../../hls_1080p/${name}/index.m3u8`
  return line
}

module.exports = name => {
  return new Promise((resolve, reject) => {
    mkdirp(`${process.env.MEDIA_ROOT}/live`, dirErr => {
      if (dirErr) {
        reject(dirErr.message)
        return
      }
      const playlist = `${process.env.MEDIA_ROOT}/live/${name}/playlist.m3u8`
      console.log("playlist", playlist)
      fs.open(playlist, 'w', (err, fd) => {
        if (err) {
          reject(err.message)
        } else {
          fs.writeFile(fd, template(name), errWrite => {
            if (errWrite) {
              reject(errWrite.message)
              return
            } else {
              fs.close(fd, () => {
                resolve()
              })
            }
          })
        }
      })
    })
  })
}
