
#import "library/geometry.typ": *

#set page(width: auto, height: auto, margin: .5cm)


#let bf(x) = $bold(upright(#x))$

#cetz.canvas(length: 2.5cm, {
  
  circle((0, 0), radius: (0.5, 0.5))
  arc((0, 0), start: 0deg, stop: -180deg, radius: (0.5, 0.15), anchor: "origin")
  arc((0, 0), start: 0deg, stop: 180deg, radius: (0.5, 0.15), stroke: (dash: "densely-dashed"), anchor: "origin")

  content((0, 0), text(6pt, $bf(P^1(C)) tilde.equiv SS^2$))
})