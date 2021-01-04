import handler from 'serve-handler'
import http from 'http'
import fs from 'fs'
import path from 'path'

let port = 5000
const portFilePath = path.resolve(process.cwd(), '.port')

try {
    if (fs.existsSync(portFilePath)) {
        const portfile = fs.readFileSync(portFilePath, 'utf-8')
        if (!isNaN(Number(portfile))) {
            port = Number(portfile)
        }
    }
} catch (error) {
    // terrible
    console.log(error)
}


function _() {
    const server = http.createServer((request, response) => {
        return handler(request, response)
    })

    server.listen(port, () => {
        console.log(`DONE > Listening http://localhost:${port}`)
    })

    server.once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            port = (Number(port) + 1)
            return _()
        }
    })
}

_()