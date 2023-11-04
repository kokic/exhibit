#import "library/geometry.typ": *

#set page(width: auto, height: auto, margin: .5cm)

#cetz.canvas(length: 2.5cm, {
  
  riemann_surface(genus: 1)

  circle((0, 0.03), radius: (0.6, 0.33), stroke: (dash: "densely-dashed"))
  arc((0, -0.3), start: 90deg, stop: 270deg, radius: (0.12, 0.2), anchor: "origin")
  arc((0, -0.3), start: 90deg, stop: -90deg, stroke: (dash: "densely-dashed"), radius: (0.12, 0.2), anchor: "origin")

  content((0, -0.7), $CC\/(ZZ omega_1 plus.circle ZZ omega_2)$)
})
