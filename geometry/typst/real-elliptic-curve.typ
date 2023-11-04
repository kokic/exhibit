#import "@preview/cetz:0.1.2": canvas, plot, draw

#set page(width: auto, height: auto, margin: .5cm)

#canvas(length: 1cm, {
  
  plot.plot(size: (6, 6),
    axis-style: "school-book", 
    x-tick-step: 1,
    y-tick-step: 1,
    x-min: -3, x-max: 3,
    y-min: -3, y-max: 3,
    {
      plot.add(domain: (-1, 3), x => calc.sqrt(calc.pow(x, 3) + 1), style: (stroke: blue))
      plot.add(domain: (-1, 3), x => -calc.sqrt(calc.pow(x, 3) + 1), style: (stroke: blue))
    }
  )
    
  draw.content((5, 6.5), $E(RR):y^2=x^3+1$)
})

