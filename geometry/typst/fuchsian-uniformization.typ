
#import "library/geometry.typ": *

#set page(width: auto, height: auto, margin: .5cm)


#cetz.canvas(length: 1cm, {

  parallel((-6, -0.5), (-5, 0.5), 2)
  content((-5, -1), "Upper Half Plane")

  line((-2.5, 0), (-1.5, 0), mark: (end: ">"))

  riemann_surface(genus: 2)
  content((0.65, -1), "Riemann Surface")

  content((-2, -2), "The Fuchsian Uniformization")
})
