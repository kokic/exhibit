#import "@preview/cetz:0.1.2"
#import cetz.draw

#set page(width: auto, height: auto, margin: .5cm)


#let action = rotate(180deg, text(size: 3em, $arrow.cw$))
#let pointer = rotate(100deg, text(size: 3em, $arrow.r.hook$))
#let dots = rotate(10deg, text(size: 3em, $fence.dotted$))

#let tex_cal(content) = text(font: "KaTeX_Caligraphic", content)

// #let indeterminacies_x = 4
#let indeterminacies_y = 2


#let ball(position, scale: 1) = {
  draw.circle(
    position,
    radius: 0.2 * scale,
    stroke: (thickness: 0.5pt),
    name: "ball-1",
  )
  draw.content("ball-1", text(
    size: 0.55em * scale,
    ${log #tex_cal("O")_(underline(v))^times}_underline(v)$,
  ))
}


#let arc_arrow(position, arrow_position: (0, 0), start: 0deg, stop: 30deg) = {
  draw.arc(
    position,
    start: start,
    stop: stop,
    radius: 1.2,
    stroke: (thickness: 2pt),
  )
  let (x, y) = position
   
  let (ax, ay) = arrow_position
  draw.line(
    (x - 0.01 + ax, y + ax),
    (x - 0.01 + ax, y - 0.05 + ax),
    mark: (fill: black, end: ">"),
    stroke: (thickness: 0.2pt),
  )
}

#let belyi_cusp(position) = {
  let (x, y) = position

  draw.content((x, y + 0.5), $"Belyi cuspidalization"$)

  draw.content((x, y + 0.1), text(size: 1em, $+1$))
  draw.content((x, y - 0.4), text(size: 1em, $-1$))
  draw.content((x - 0.42, y - 0.16), text(size: 1em, $0$))
  draw.content((x + 0.44, y - 0.15), text(size: 1em, $infinity$))

  draw.content((x, y), text(size: 1.5em, $bullet$))
  draw.content((x, y - 0.3), text(size: 1.5em, $bullet$))
  draw.content((x - 0.32, y - 0.15), text(size: 1.5em, $bullet$))
  draw.content((x + 0.32, y - 0.15), text(size: 1.5em, $bullet$))
   
  draw.line(
    (x, y - 0.01),
    (x - 0.32, y - 0.16),
    stroke: (thickness: 2pt, dash: "dotted"),
  )
  draw.line(
    (x, y - 0.01),
    (x + 0.32, y - 0.16),
    stroke: (thickness: 2pt, dash: "dotted"),
  )
  draw.line(
    (x + 0.32, y - 0.17),
    (x, y - 0.32),
    stroke: (thickness: 2pt, dash: "dotted"),
  )
  draw.line(
    (x - 0.32, y - 0.17),
    (x, y - 0.32),
    stroke: (thickness: 2pt, dash: "dotted"),
  )
}


#cetz.canvas(
  length: 3cm,
  {
    draw.content((0, indeterminacies_y), text(
      size: 1.25em,
      font: "New Computer Modern",
      style: "italic",
      weight: "bold",
      "Indeterminacies",
    ))
     
    draw.content(
      (0, indeterminacies_y - 0.4),
      align(center, $"(Ind 1), (Ind 2)," \ "(Ind 3)"$),
    )
     
    draw.content((0.05, indeterminacies_y - 0.85), action)
     
    let ball_base_x = 0
    let ball_base_y = indeterminacies_y - 1.2
     
    ball((ball_base_x, ball_base_y))
    draw.content((ball_base_x - 0.05, ball_base_y - 0.45), pointer)
     
    ball((ball_base_x - 0.45, ball_base_y - 0.8), scale: 1.2)
    ball((ball_base_x + 0.25, ball_base_y - 0.8), scale: 1.2)
     
    draw.content((ball_base_x - 0.18, ball_base_y - 1.15), pointer)
     
    ball((ball_base_x - 0.95, ball_base_y - 1.7), scale: 1.4)
    ball((ball_base_x - 0.25, ball_base_y - 1.7), scale: 1.4)
    ball((ball_base_x + 0.45, ball_base_y - 1.7), scale: 1.4)
     
    draw.content((ball_base_x - 0.35, ball_base_y - 2.25), pointer)
     
    draw.content((ball_base_x - 0.45, ball_base_y - 2.6), dots)
     
    // elliptic cusp
     
    let ell_cusp_x = -2
    let ell_cusp_y = -2
     
    // arc_arrow((-2, -1))
    draw.content((-2, -2), text(size: 1.5em, $plus.minus$))
     
    // arc_arrow((1, -1))
    draw.content((-ell_cusp_x, ell_cusp_y), text(size: 1.5em, $plus.minus$))
     
    // belyi_cusp((1.5, 0.5))
    // content((0, -1.5), $"the combinatorial structure of a" cal(D)\-Theta^(plus.minus ell)\-"Hodge theater"$)
  },
)
