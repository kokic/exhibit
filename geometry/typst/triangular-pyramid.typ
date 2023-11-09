
#import "library/geometry.typ": *

#set page(width: auto, height: auto, margin: .1cm)

#cetz.canvas(length: 3cm, {
  line((0.3, -0.1), (0.5, 0.15), stroke: (thickness: 0.5pt))

  line((0.3, -0.1), (0.6, -0.2), stroke: (thickness: 0.5pt))

  // top bottom
  line((0.5, 0.15), (0.6, -0.2), stroke: (thickness: 0.5pt))

  line((0.6, -0.2), (0.7, 0), stroke: (thickness: 0.5pt))

  line((0.5, 0.15), (0.7, 0), stroke: (thickness: 0.5pt))

  line((0.3, -0.1), (0.7, 0), stroke: (thickness: 0.5pt, dash: "dashed"))
})
