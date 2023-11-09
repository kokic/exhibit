#import "@preview/cetz:0.1.2"

#set page(width: auto, height: auto, margin: .2cm)

#let triangular-pyramid = box(
  height: 10pt,
  baseline: 25%, 
  image("../gallery/triangular-pyramid.svg")
)

#cetz.canvas(length: 1cm, {
  import cetz.draw: *

  content((0, 0), [$chi(SS^2)=chi(#triangular-pyramid)=2$])

  bezier((-0.2, -2), (0.6, -0.5), (1, -1.5), stroke: (thickness: 0.4pt))

  line((0.6, -0.5), (0.55, -0.35), mark: (end: ">"), stroke: (thickness: 0.4pt))

  let text-offset = 0.6
  content(((-0.2 + text-offset, -2), 0.35, (0.6 + text-offset, -0.5)), angle: (0.6 + text-offset, -0.5), anchor: "top", text(6pt, $(eq.triple omega eq.triple)$))


  content((-1, -2), [#image("../gallery/triangular-pyramid.svg")])

  content((-1, -2.7), text(5pt, $"triangular pyramid"$))
})

