#import "library/geometry.typ": *

#set page(width: auto, height: auto, margin: .5cm)

#cetz.canvas(length: 2.5cm, {

  // band
  let radius = (0.8, 0.4)
  let half-gap-degree = 20deg
  let left-side-x = -0.8
  let right-side-x = -left-side-x
  let left-inside-x = -0.28
  let right-inside-x = -left-inside-x

  // top line
  arc((0, 0), radius: radius, start: -90deg + half-gap-degree, stop: 270deg - half-gap-degree, anchor: "origin")

  arc((0, -0.3), radius: radius, start: 22deg, stop: 158deg, anchor: "origin")

  line((left-side-x, 0), (left-side-x, -0.3))
  line((right-side-x, 0), (right-side-x, -0.3))
  line((left-inside-x, -0.37), (left-inside-x, -0.68))
  line((right-inside-x, -0.37), (right-inside-x, -0.68))

  bezier(
    (left-inside-x + 0.05, -0.375), 
    (right-inside-x - 0.05, -0.675), 
    (0, -0.4), 
    (0, -0.7), 
    stroke: (dash: "dashed"), 
  )

  // front-bottom lines
  arc((0, -0.3), radius: radius, start: 180deg, stop: 270deg - half-gap-degree, anchor: "origin")
  arc((0, -0.3), radius: radius, start: -90deg + half-gap-degree, stop: 0deg, anchor: "origin")


  // Möbius band
  let offset-y = -1.5

  arc((0, offset-y), radius: radius, start: -90deg + half-gap-degree, stop: 270deg - half-gap-degree, anchor: "origin")

  arc((0, offset-y - 0.3), radius: radius, start: 22deg, stop: 158deg, anchor: "origin")

  line((left-side-x, offset-y), (left-side-x, offset-y - 0.3))
  line((right-side-x, offset-y), (right-side-x, offset-y - 0.3))
  
  bezier(
    (left-inside-x, offset-y - 0.375), 
    (right-inside-x, offset-y - 0.675), 
    (0, offset-y - 0.4), 
    (0, offset-y - 0.7), 
  )

  // cross lines
  bezier(
    (right-inside-x, offset-y - 0.375), 
    (left-inside-x + 0.24, offset-y - 0.5), 
    (0, offset-y - 0.4), 
    (0, offset-y - 0.45), 
  )
  bezier(
    (left-inside-x + 0.33, offset-y - 0.6), 
    (left-inside-x, offset-y - 0.675), 
    (0, offset-y - 0.65), 
    (0, offset-y - 0.7), 
  )

  // front-bottom lines
  arc((0, offset-y - 0.3), radius: radius, start: 180deg, stop: 270deg - half-gap-degree, anchor: "origin")
  arc((0, offset-y - 0.3), radius: radius, start: -90deg + half-gap-degree, stop: 0deg, anchor: "origin")


  content((0, -2.7), "Möbius band")
})
