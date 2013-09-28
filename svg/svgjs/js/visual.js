
describe('Create', function() {
  $.each(shapes, function(i, shape) {
    
    it(shape, function() {
      build[shape]()
    })
    
  })
})

describe('Move', function() {
  $.each(shapes, function(i, shape) {
    
    it(shape + ' to x:10 and y:10', function() {
      build[shape]().move(10, 10)
    })
    
  })
})

describe('Center', function() {
  $.each(shapes, function(i, shape) {
    
    it(shape + ' to x:80 and y:80', function() {
      build[shape]().center(80, 80)
    })
    
  })
})

describe('Clone', function() {
  $.each(shapes, function(i, shape) {
    
    it(shape, function() {
      var s = build[shape]()
      
      var clone = s.move(10,10).
        fill({ opacity: 0.5 }).
        stroke({ width: 2, color: '#71303F' }).
        clone()
      
      clone.center(90,90)
    })
    
  })
})

describe('Visualize bbox()', function() {
  $.each(shapes, function(i, shape) {
    
    it('for centered ' + shape, function() {
      var s = build[shape]().center(80, 80)
          b = s.bbox()
      
      s.parent.
        rect(b.width, b.height).
        move(b.x, b.y).
        fill({ opacity: 0 }).
        stroke({ color: '#f06' })
      
      s.parent.
        circle(8).
        move(b.cx - 4, b.cy - 4).
        fill({ opacity: 50, color: '#fff' }).
        stroke({ color: '#f06', width: 1 })
    })
    
  })
})

describe('Tranform rotation', function() {
  $.each(shapes, function(i, shape) {
    
    it('25º on ' + shape + ' and center', function() {
      build[shape]().center(80, 80).transform({ rotation: 25 })
    })
    
  })
})

describe('Tranform skewX', function() {
  $.each(shapes, function(i, shape) {
    
    it('-18º ' + shape + ' with x 40', function() {
      var s = build[shape]().move(40, 0).skew(-18)
    })
    
  })
})

describe('Tranform skewY', function() {
  $.each(shapes, function(i, shape) {
    
    it('-18º on ' + shape + ' with y 40', function() {
      var s = build[shape]().move(0, 40).skew(0, -18)
    })
    
  })
})

describe('Use fill() on ', function() {
  $.each(shapes, function(i, shape) {
    
    if (shape != 'image' && shape != 'line')
      it(shape + ' with #BAC3A9', function() {
        var s = build[shape]().center(80,80).fill('#BAC3A9').stroke({ width: 0 })
      })
    
  })
})

describe('Use stroke() on ', function() {
  $.each(shapes, function(i, shape) {
    
    if (shape != 'image')
      it(shape + ' with #71303F, no fill', function() {
        var s = build[shape]().center(80,80).fill('none').stroke({ color: '#71303F', width: 2 })
      })
    
  })
})

describe('Linear gradient', function() {
  $.each(shapes, function(i, shape) {
    
    if (shape != 'image') {
      it('with 3 stops on ' + shape, function() {
        var s = build[shape]().center(80, 80)

        var gradient = s.parent.gradient('linear', function(stop) {
          stop.at({ offset: 0, color: '#71303F', opacity: 1 })
          stop.at({ offset: 50, color: '#FDF3E5', opacity: 0.5 })
          stop.at({ offset: 100, color: '#BAC3A9', opacity: 1 })
        })

        s.attr(shape == 'line' || shape == 'polyline' ? 'stroke' : 'fill', gradient.fill())

      })
    }
    
  })
})

describe('Radial gradient', function() {
  $.each(shapes, function(i, shape) {
    
    if (shape != 'image') {
      it('with 4 stops on ' + shape, function() {
        var s = build[shape]().center(80, 80)

        var gradient = s.parent.gradient('radial', function(stop) {
          stop.at({ offset: 0, color: '#BAC3A9', opacity: 1 })
          stop.at({ offset: 33, color: '#FDF3E5', opacity: 0.5 })
          stop.at({ offset: 90, color: '#71303F', opacity: 1 })
          stop.at({ offset: 120, color: '#191919', opacity: 1 })
        })

        s.attr(shape == 'line' || shape == 'polyline' ? 'stroke' : 'fill', gradient.fill())

      })
    }
    
  })
})

describe('On click', function() {
  $.each(shapes, function(i, shape) {
    
    if (shape != 'image') {
      it('paint ' + shape + ' red', function() {
        var s = build[shape]().center(80, 80)
        
        s.click(function() {
          this.attr(shape == 'line' || shape == 'polyline' ? 'stroke' : 'fill', '#f00')
        })
        
      })
    }
    
  })
})

describe('On mouse over', function() {
  $.each(shapes, function(i, shape) {
    
    it('hide ' + shape + ' for 2 sec.', function() {
      var s = build[shape]().center(80, 80)
      
      s.mouseover(function() {
        var self = this
        
        self.hide()
        
        setTimeout(function() {
          self.show()
        }, 2000)
      }); 
      
    })
    
  })
})

describe('Mask image', function() {
  
  it('with centered rect', function() {
    var image = build.image().size(160, 160),
        rect = image.parent.rect(140, 140).center(80, 80)
    
    image.maskWith(rect.fill({ color: '#fff' }))

  })
  
  it('with centered ellipse', function() {
    var image = build.image().size(160, 160),
        ellipse = image.parent.ellipse(150, 100).center(80, 80)
    
    image.maskWith(ellipse.fill({ color: '#fff' }))
  })
  
  it('with centered polygon', function() {
    var image = build.image().size(160, 160),
        polygon = image.parent.polygon(polyString).center(80, 80)
        
    image.maskWith(polygon.fill({ color: '#fff' }))

  })
  
  it('with centered path', function() {
    var image = build.image().size(160, 160),
        path = image.parent.path(pathString, true).center(80, 80)
    
    image.maskWith(path.fill({ color: '#fff' }))
  })
  
  it('with centered text', function() {
    var image = build.image().size(160, 160),
        text = image.parent.text('svg.js\nftw').font({ family: 'Source Sans Pro', size: 60 }).center(80, 80)

    image.maskWith(text.fill({ color: '#fff' }))

  })
  
  it('with multiple elements', function() {
    var image = build.image().size(160, 160),
        rect = image.parent.rect(50, 50).move(20, 20).fill({ color: '#fff' }),
        circle = image.parent.circle(80).move(30, 30).fill({ color: '#fff' }),
        text = image.parent.text('SVG.JS').move(40, 90).fill({ color: '#fff' }).font({ size: 36, family: 'Source Sans Pro' }),
        mask = image.parent.mask().add(rect).add(circle).add(text)
    
    image.maskWith(mask)

  })
  
})

describe('Mask image with gradient', function() {
  
  it('on centered rect', function() {
    var image = build.image().size(160, 160),
        rect = image.parent.rect(140, 140).center(80, 80)
    
    var gradient = image.parent.gradient('linear', function(stop) {
      stop.at({ offset: 0, color: '#000' })
      stop.at({ offset: 90, color: '#fff' })
    })

    image.maskWith(rect.fill({ color: gradient.fill() }))

  })
  
  it('on centered ellipse', function() {
    var image = build.image().size(160, 160),
        ellipse = image.parent.ellipse(150, 100).center(80, 80)
    
    var gradient = image.parent.gradient('linear', function(stop) {
      stop.at({ offset: 0, color: '#000' })
      stop.at({ offset: 90, color: '#fff' })
    })

    image.maskWith(ellipse.fill({ color: gradient.fill() }))

  })
  
  it('on centered polygon', function() {
    var image = build.image().size(160, 160),
        polygon = image.parent.polygon(polyString).center(80, 80)
    
    var gradient = image.parent.gradient('linear', function(stop) {
      stop.at({ offset: 0, color: '#000' })
      stop.at({ offset: 90, color: '#fff' })
    })

    image.maskWith(polygon.fill({ color: gradient.fill() }))

  })
  
  it('on centered path', function() {
    var image = build.image().size(160, 160),
        path = image.parent.path(pathString).center(80, 80)
    
    var gradient = image.parent.gradient('linear', function(stop) {
      stop.at({ offset: 0, color: '#000' })
      stop.at({ offset: 90, color: '#fff' })
    })

    image.maskWith(path.fill({ color: gradient.fill() }))

  })
  
  it('on centered text', function() {
    var image = build.image().size(160, 160),
        text = image.parent.text('svg.js\nftw').font({ family: 'Source Sans Pro', size: 60 }).center(80, 80)
    
    var gradient = image.parent.gradient('linear', function(stop) {
      stop.at({ offset: 0, color: '#000' })
      stop.at({ offset: 90, color: '#fff' })
    })

    image.maskWith(text.fill({ color: gradient.fill() }))

  })
  
  it('with multiple elements', function() {
    var image = build.image().size(160, 160),
        rect = image.parent.rect(50, 50).move(20, 20),
        circle = image.parent.circle(80).move(30, 30),
        text = image.parent.text('SVG.JS').move(40, 90).font({ size: 36, family: 'Source Sans Pro' }),
        mask = image.parent.mask()
    
    var gradient = image.parent.gradient('linear', function(stop) {
      stop.at({ offset: 0, color: '#000' })
      stop.at({ offset: 90, color: '#fff' })
    })
    
    mask.
      add(rect.fill({ color: gradient.fill() })).
      add(circle.fill({ color: gradient.fill() })).
      add(text.fill({ color: gradient.fill() }))
    
    image.maskWith(mask)

  })
  
})

describe('Animate move, size, rotate and skew', function() {
  $.each(shapes, function(i, shape) {
    
    if (shape != 'circle') {
      it('with ' + shape, function() {
        var s = build[shape]().move(0,0).stroke({ width: 0, color: '#000' })

        var fxin, fxout;

        fxin = function() {
          s.animate().attr({ fill: '#f03', 'stroke-width': 3, 'fill-opacity': 0.5 }).move(150,120).size(50, 50).rotate(135).skew(0,45).after(fxout)
        }

        fxout = function() {
          s.animate().attr({ fill: '#000', 'stroke-width': 0, 'fill-opacity': 1 }).move(0, 0).size(100, 100).rotate(0).skew(0,0).after(fxin)
        }

        fxin()
      })
    }
    
  })
})

describe('Easing test with svg.easing.js plug-in', function() {
  $.each(shapes, function(i, shape) {
    
    if (('text circle').split(' ').indexOf(shape) == -1) {
      it(shape, function() {
        var drop, raise,
            s = build[shape]().move(10, 10).size(50,50)

        drop = function() {
          setTimeout(function() {
            s.animate(1000, SVG.easing.bounce).move(10, 110).after(raise)
          }, 500)
        }

        raise = function() {
          setTimeout(function() {
            s.animate(1500, SVG.easing.backOut).move(10, 10).after(drop)
          }, 500)
          
        }

        drop()

      })
    }
  })
  
  it('text', function() {
    var drop, raise,
        s = build['text']().text('SVG.JS').move(10, 10).attr('font-size', 50)

    drop = function() {
      setTimeout(function() {
        s.animate(1000, SVG.easing.bounce).move(10, 110).after(raise)
      }, 500)
    }

    raise = function() {
      setTimeout(function() {
        s.animate(1500, SVG.easing.backOut).move(10, 10).after(drop)
      }, 500)
      
    }

    drop()

  })
})

describe('Make draggable with svg.draggable.js plug-in', function() {
  $.each(shapes, function(i, shape) {
    
    it(shape, function() {
      var s = build[shape]().move(0, 0).draggable()
    })
    
  })
})








