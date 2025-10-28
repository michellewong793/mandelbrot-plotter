const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const width = 500
const height = 500
// 125 pixels in between is 1 tick from -2 to 2
// scale factor is what we use to turn the coordinates into -2 to 2 in the imaginary and real axis
const scaleFactor = 1 / 125

canvas.addEventListener('click', (event) => {
  const x = event.offsetX
  const y = event.offsetY
  console.log('x', x, 'y', y)
  // cr + ci = c's real and imaginary parts
  const [cr, ci] = screenToWorld(x, y)
  console.log('cr', cr, 'ci', ci)
})

function plotPoint(x, y, radius = 5) {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fill()
}

function screenToWorld(x, y) {
  const r = (x - width / 2) * scaleFactor
  const i = -(y - height / 2) * scaleFactor
  return [r, i]
}

function worldToScreen(r, i) {
  const x = r / scaleFactor + width / 2
  const y = -i / scaleFactor + height / 2
  return [x, y]
}

// test function
function isBounded(cr, ci, maxIter = 100) {
  let zr = 0
  let zi = 0
  for (let k = 0; k < maxIter; k++) {
    // z^2 + c = (x^2 - y^2) + 2*x*y*i, and then add ci + cr
    // real
    const zr2 = zr * zr - zi * zi + cr
    // imaginary
    const zi2 = 2 * zr * zi + ci
    zr = zr2
    zi = zi2

    // from mathematics, if |z|^2 > 2
    // then the equation will grow unbounded, which is the same as asking |z|^2 > 4
    // optimization from having to do the square root of zr^2 + zi^2
    if (zr * zr + zi * zi > 4) {
      return false
    }
  }
  return true
}

function draw() {
  const step = 2 // pixel step, adjust for detail/speed
  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < height; y += step) {
      const [cr, ci] = screenToWorld(x, y)
      const bounded = isBounded(cr, ci)
      ctx.fillStyle = bounded ? '#dddddd' : '#000000'
      ctx.fillRect(x, y, step, step)
    }
  }
}

draw()
