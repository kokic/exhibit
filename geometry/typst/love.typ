#import "library/geometry.typ": *

#import cetz.plot

#set page(width: auto, height: auto, margin: .5cm)

#cetz.canvas(length: 1cm, {
  
  // torus_hole()
  
  // bezier((1, 1), (-1, 1), (0.5, 1.5), (-0.5, 0.5))
  
  // bezier((1, -1), (-1, -1), (0.5, -0.5), (-0.5, -1.5))
  
  plot.plot(size: (6, 6),
    axis-style: "school-book", 
    x-tick-step: none,
    y-tick-step: none,
    {
      // plot.add(domain: (-1, 3), x => calc.sqrt(calc.pow(x, 3) + 1), style: (stroke: blue))
      // plot.add(domain: (-1, 3), x => -calc.sqrt(calc.pow(x, 3) + 1), style: (stroke: blue))
      
      plot.add((t) => (calc.abs(calc.pi / 2 - t) * calc.cos(t * 1rad), calc.abs(calc.pi / 2 - t) * calc.sin(t * 1rad)), domain: (-1/2 * calc.pi, 3/2 * calc.pi))
    }
  )
 
   
       
})