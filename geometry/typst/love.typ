#import "library/geometry.typ": *

#import cetz.plot

#set page(width: auto, height: auto, margin: .5cm)

#cetz.canvas(length: 1cm, {
  plot.plot(size: (6, 6),
    x-tick-step: none,
    y-tick-step: none,
    // x-ticks: ((-calc.pi / 2, $-pi/2$), (0, $0$), (calc.pi / 2, $pi/2$)), 
    y-ticks: ((0, $0$), (-calc.pi, $-pi$)), 
    
    {
      plot.add((t) => (calc.abs(calc.pi / 2 - t) * calc.cos(t * 1rad), calc.abs(calc.pi / 2 - t) * calc.sin(t * 1rad)), domain: (-1/2 * calc.pi, 3/2 * calc.pi))
    }
  )

  content((3, 3.5), $r=|theta - pi/2|$)
  content((3, 2.5), text(size: 8pt, fill: gray, $-pi/2 lt.slant theta lt.slant (3pi)/2$))     
})
