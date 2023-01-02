
const proxy = f => function (...xs) {
  return f(this, ...xs)
}

// Array.prototype.or = proxy(x => x.reduce((x, y) => x || y))
// Array.prototype.and = proxy(x => x.reduce((x, y) => x && y))
// Array.prototype.flator = proxy(x => x.flat().or() ? x : undefined)
// Array.prototype.flatand = proxy(x => x.flat().and() ? x : undefined)

Number.prototype.boundedIn = proxy((x, a, b) => a <= x && x <= b)
String.prototype.code = proxy(x => x.codePointAt(0))
String.prototype.boundedIn = proxy((x, a, b) => x.code().boundedIn(a.code(), b.code()))

const Parser = function (parse) {
  this.parse = parse
}


Parser.prototype.many = function () {
  return new Parser(source => {
    let [list, residue, tuple] = [[], source]
    while (tuple = this.parse(residue)) {
      list.push(tuple[0])
      residue = tuple[1]
    }
    return [list, residue]
  })
}


Parser.prototype.some = function () {
  return new Parser(source => {
    let tuple = this.many().parse(source)
    return tuple[0].length >= 1 ? tuple : undefined
  })
}

Parser.prototype.asterisk = function () {
  return new Parser(source => {
    let [buffer, residue, tuple] = ['', source,]
    while (tuple = this.parse(residue)) {
      buffer += tuple[0]
      residue = tuple[1]
    }
    return [buffer, residue]
  })
}

Parser.prototype.plus = function () {
  return new Parser(source => {
    let tuple = this.asterisk().parse(source)
    return tuple[0].length >= 1 ? tuple : undefined
  })
}

Parser.prototype.map = function (morph) {
  return new Parser(source => {
    if (!(tuple = this.parse(source)))
      return undefined
    let [a, residue] = tuple
    return [morph(a), residue]
  })
}

Parser.prototype.first = proxy(x => x.map(tuple => tuple[0]))
Parser.prototype.second = proxy(x => x.map(tuple => tuple[1]))

Parser.prototype.follow = function (next) {
  return new Parser(source => {
    if (!(tuple1 = this.parse(source)))
      return undefined
    let [a, phase1] = tuple1
    typeof next == 'function' && (next = next())
    if (!(tuple2 = next.parse(phase1)))
      return undefined
    let [b, phase2] = tuple2
    return [[a, b], phase2]
  })
}

Parser.prototype.skip = function (next) {
  return new Parser(source => {
    if (!(tuple1 = this.parse(source)))
      return undefined
    let [a, phase1] = tuple1
    if (!(tuple2 = next.parse(phase1)))
      return undefined
    let [, phase2] = tuple2
    return [a, phase2]
  })
}

Parser.prototype.or = function (next) {
  return new Parser(source => {
    if (tuple = this.parse(source))
      return tuple
    typeof next == 'function' && (next = next())
    return next.parse(source)
  })
}

const token = predicate => new Parser(
  source => source.length > 0
    ? predicate(char = source.charAt())
      ? [char, source.substring(1)]
      : undefined
    : undefined
)
const character = char => token(x => x == char)

const digit = token(x => x.boundedIn('1', '9'))
const digits = digit.plus()

const letter = token(x => x.boundedIn('a', 'z') || x.boundedIn('A', 'Z'))
const letters = letter.plus()

const values = digit.or(letter).plus()
  .or(() => braces(values))

const backslash = character('\\')

const lbrace = character('{')
const rbrace = character('}')
const braces = x => lbrace.follow(x).skip(rbrace).second()

const macrohead = backslash.follow(letters).second()
const monoargue = macrohead.follow(values).map(xs => monocase(xs))


const chars = function (a, b) {
  let [code1, code2] = [a.code(), b.code()]
  let length = code2 - code1 + 1
  let codes = Array.from({ length: length }, (_, x) => x + code1)
  return String.fromCodePoint(...codes)
}

const alphabets = function () {
  let map = new Object()
  Array.from(chars('A', 'Z')).forEach((x, i) => map[x] = arguments[i])
  Array.from(chars('a', 'z')).forEach((x, i) => map[x] = arguments[26 + i])
  return map
}

const Unicode = {
  mathbb: alphabets(
    ...'𝔸𝔹ℂ', ...chars('𝔻', '𝔾'), 'ℍ', ...chars('𝕀', '𝕄'),
    ...'ℕ𝕆ℙℚℝ', ...chars('𝕊', '𝕐'), 'ℤ', ...chars('𝕒', '𝕫')
  )
  // {
  //   upper: '𝔸𝔹ℂ' +
  //     chars('𝔻', '𝔾') + 'ℍ' +
  //     chars('𝕀', '𝕄') + 'ℕ𝕆ℙℚℝ' +
  //     chars('𝕊', '𝕐') + 'ℤ',
  //   lower: chars('𝕒', '𝕫')
  // }
}

const Mono = new Object()
Mono.text = s => s
Mono.mathbb = s => Array.from(s).map(x => Unicode.mathbb[x] || x).join('')

const monocase = function (xs) {
  let [macro, value] = xs
  if (!(handler = Mono[macro]))
    return `\\${macro}{${value}}`
  return handler(value)
}

const text = token(x => x != '\\').plus()
  .or(monoargue)
  .plus()

const source = String.raw`
Hello, this is integers denoted by \mathbb{Z}, 
I will use \text{Gal}(\mathbb{K}), \mathbb{Q} and \mathbb{A} ...
`
console.log(text.parse(source))



