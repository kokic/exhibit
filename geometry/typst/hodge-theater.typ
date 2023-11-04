#import "@preview/cetz:0.1.2"

#set page(width: auto, height: auto, margin: .5cm)

#cetz.canvas(length: 3cm, {
  import cetz.draw: *

  content((0, 0.3), $bb(F)_ell^(times.r plus.minus) arrow.cw.half$)
  content((0, 0), $cal(D)^(⊚ plus.minus)=$) // circle.nested
  content((0, -0.3), $cal(B)\(underline(X)_K)^0$)

  // top
  content((-0.5, 1), $plus.minus$)
  content((0, 1), $arrow.long$)
  content((0.5, 1), $plus.minus$)

  // bottom
  content((-0.5, -1), $plus.minus$)
  content((0, -1), $arrow.l.long$)
  content((0.5, -1), $plus.minus$)

  // left
  content((-1, 0.5), $plus.minus$)
  content((-1, 0), $arrow.t$)
  content((-1, -0.5), $plus.minus$)

  // right
  content((1, 0.5), $plus.minus$)
  content((1, 0), $arrow.b$)
  content((1, -0.5), $plus.minus$)

  
  content((-0.75, 0.75), $arrow.tr$) // left-top
  content((-0.75, -0.75), $arrow.tl$) // left-bottom
  content((0.75, 0.75), $arrow.br$) // right-top
  content((0.75, -0.75), $arrow.bl$) // right-bottom

  content((0, -1.5), $"the combinatorial structure of a" cal(D)\-Theta^(plus.minus ell)\-"Hodge theater"$)
})
