
#import "@preview/cetz:0.1.2"

#import cetz.draw: *



#let parallel(p1, p2, width) = {
  let (x1, y1) = p1
  let (x2, y2) = p2

  line(p1, p2)
  line(p1, (x1 + width, y1))
  line(p2, (x2 + width, y2))
  line((x1 + width, y1), (x2 + width, y2))
}



/* Torus */



#let torus_hole(position: (0, 0), scale: 1) = {
  let radius = (0.75 * scale, 0.5 * scale)
  let (x, y) = position
  let (rx, ry) = radius
  
  arc((x / 1.175, y - 0.35 * scale), start: 45deg, stop: 135deg, radius: (rx / 1.5, ry), anchor: "origin")
    
  arc((x / 1.175, y + 0.4 * scale), start: -45deg, stop: -135deg, radius: (rx / 1.25, ry), anchor: "origin")
}

#let torus_connect(position: (0, 0), scale: 1, start1: 30deg, stop1: 150deg, start2: -30deg, stop2: -150deg) = {
  let radius = (0.75 * scale, 0.5 * scale)
  let (x, y) = position
  
  arc((x / 1.175, y), start: start1, stop: stop1, radius: radius, anchor: "origin")
  
  arc((x / 1.175, y), start: start2, stop: stop2, radius: radius, anchor: "origin")
  
  torus_hole(position: position, scale: scale)
}


#let torus(position: (0, 0), scale: 1) = torus_connect(position: position, start1: 0deg, stop1: 180deg, start2: 0deg, stop2: -180deg, scale: scale)

#let torus_left(position: (0, 0), scale: 1) = torus_connect(position: position, stop1: 180deg, stop2: -180deg, scale: scale)

#let torus_right(position: (0, 0), scale: 1) = torus_connect(position: position, start1: 0deg, start2: 0deg, scale: scale)


#let riemann_surface(position: (0, 0), genus: 1, scale: 1) = {
  let radius = (0.75 * scale, 0.5 * scale)
  let (x, y) = position
  let (rx, ry) = radius

  let dx = rx * 2

  if genus == 1 { torus(position: position, scale: scale) }
  else if genus >= 2 {
    let last_index = genus - 1
    torus_left(position: (x, y), scale: scale)
    let index = 1
    while index < last_index {
      torus_connect(position: (dx * index, y), scale: scale)
      index += 1
    }
    torus_right(position: (dx * last_index, y), scale: scale)
  }
}


