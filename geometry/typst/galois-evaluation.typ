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
  draw.circle(position, radius: 0.2 * scale, stroke: (thickness: 0.5pt), name: "ball-1")
  draw.content("ball-1", text(
    size: 0.55em * scale, 
    ${log #tex_cal("O")_(underline(v))^times}_underline(v)$
    )
  )
}

#cetz.canvas(length: 3cm, {
  
  draw.content((0, indeterminacies_y), text(size: 1.25em, font: "New Computer Modern", style: "italic", weight: "bold", "Indeterminacies"))

  draw.content((0, indeterminacies_y - 0.4), align(center, $"(Ind 1), (Ind 2)," \ "(Ind 3)"$))
  
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

  draw.content((ell_cusp_x, ell_cusp_y), $plus.minus$)
  
  draw.line((0, -0.5), (0.55, -0.35), mark: (end: ">"), stroke: (thickness: 2pt))


  draw.content((- ell_cusp_x, ell_cusp_y), $plus.minus$)

  // content((0, -1.5), $"the combinatorial structure of a" cal(D)\-Theta^(plus.minus ell)\-"Hodge theater"$)
})
