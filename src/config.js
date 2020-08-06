module.exports = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: false,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: 8000,
    allow_origin: '*',
    mediaroot: process.env.MEDIA_ROOT || '/app/media',
  },
  fission: {
    ffmpeg: process.env.FFMPEG_PATH || '/usr/bin/ffmpeg',
    tasks: [
      {
        rule: "live/*",
        model: [
          {
            ab: "128k",
            vb: "1500k",
            vs: "1280x720",
            vf: "30",
          },
          {
            ab: "64k",
            vb: "1000k",
            vs: "854x480",
            vf: "24",
          },
          {
            ab: "32k",
            vb: "600k",
            vs: "640x360",
            vf: "20",
          },
        ]
      },
    ]
  },
  // trans: {
  //   ffmpeg: process.env.FFMPEG_PATH || '/usr/bin/ffmpeg',
  //   tasks: [
  //     {
  //       app: 'live',
  //       hls: true,
  //       ac: "aac",
  //       hlsFlags: '[hls_time=10:hls_list_size=0:hls_flags=delete_segments]',
  //     }
  //   ]
  // }
  // relay: {
  //   ffmpeg: process.env.FFMPEG_PATH || '/usr/bin/ffmpeg',
  //   tasks: [
  //     {
  //       app: 'stream',
  //       mode: 'push',
  //       edge: 'rtmp://127.0.0.1/hls_720p',
  //     },
  //     {
  //       app: 'stream',
  //       mode: 'push',
  //       edge: 'rtmp://127.0.0.1/hls_480p',
  //     },
  //     {
  //       app: 'stream',
  //       mode: 'push',
  //       edge: 'rtmp://127.0.0.1/hls_360p',
  //     },
  //   ],
  // },
  // trans: {
  //   ffmpeg: '/usr/bin/ffmpeg',
  //   tasks: [
  //     {
  //       app: 'hls_720p',
  //       hls: true,
  //       ac: 'aac',
  //       acParam: ['-b:a', '128k', '-ar', 48000],
  //       vcParams: [
  //         '-vf',
  //         "'scale=1280:-1'",
  //         '-b:v',
  //         '2800k',
  //         '-preset',
  //         'fast',
  //         '-profile:v',
  //         'baseline',
  //         '-bufsize',
  //         '4200k'
  //       ],
  //       hlsFlags: '[hls_time=10:hls_list_size=0:hls_flags=delete_segments]',
  //       dash: true,
  //       dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
  //     },
  //     {
  //       app: 'hls_480p',
  //       hls: true,
  //       ac: 'aac',
  //       acParam: ['-b:a', '128k', '-ar', 48000],
  //       vcParams: [
  //         '-vf',
  //         "'scale=854:-1'",
  //         "-tune",
  //         "zerolatency",
  //         '-b:v',
  //         '1400k',
  //         '-preset',
  //         'veryfast',
  //         '-profile:v',
  //         'baseline',
  //         '-bufsize',
  //         '2100k'
  //       ],
  //       hlsFlags: '[hls_time=10:hls_list_size=0:hls_flags=delete_segments]',
  //     },
  //     {
  //       app: 'hls_360p',
  //       hls: true,
  //       ac: 'aac',
  //       acParam: ['-b:a', '96k', '-ar', 48000],
  //       vcParams: [
  //         '-vf',
  //         "'scale=480:-1'",
  //         '-b:v',
  //         '800k',
  //         '-preset',
  //         'fast',
  //         '-profile:v',
  //         'baseline',
  //         '-bufsize',
  //         '1200k'
  //       ],
  //       hlsFlags: '[hls_time=10:hls_list_size=0:hls_flags=delete_segments]',
  //     },
  //   ],
  // },
}
