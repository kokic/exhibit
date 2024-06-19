// src/parsec/string-iterator.ts
class StringIterator {
  source;
  index;
  constructor(source, index) {
    this.source = source;
    this.index = index;
  }
  extract(pos) {
    const end = typeof pos == "number" ? pos : pos.index;
    return this.source.substring(this.index, end);
  }
  hasNext() {
    return this.index < this.source.length;
  }
  curr() {
    return this.source.charAt(this.index);
  }
  next() {
    return new StringIterator(this.source, this.index + 1);
  }
  forward(length) {
    return new StringIterator(this.source, this.index + length);
  }
}

// src/parsec/declare-global.ts
Number.prototype.boundedIn = function(a, b) {
  return a <= this && this <= b;
};
String.prototype.boundedIn = function(a, b) {
  const [code, start, end] = [this, a, b].map((s) => s.codePointAt(0));
  return code.boundedIn(start, end);
};
String.prototype.toIterator = function() {
  return new StringIterator(this, 0);
};

// src/parsec/parse.ts
var success = (pos, res) => ({ type: "success", pos, res });
var defaultMessage = (pos) => `mismatched: ${pos.extract(pos.index + 5)}...`;
var error = (pos, err) => ({ type: "error", pos, err: err ? err : defaultMessage(pos) });
var never = () => error({}, "never");
var pure = (a) => (it) => success(it, a);
var bind = (f, g) => (it) => ((x) => x.type == "success" ? g(x.res)(x.pos) : x.type == "error" ? error(x.pos, x.err) : never())(f(it));
var fail = (msg) => (it) => error(it, msg);
var Flat;
((Flat) => {
  Flat.orElse = (p, q) => (it) => ((x) => x.type == "success" ? x : x.type == "error" ? it == x.pos ? q(it) : x : never())(p(it));
  Flat.attempt = (p) => (it) => ((x) => x.type == "success" ? x : x.type == "error" ? error(it, x.err) : never())(p(it));
  Flat.pstring = (s) => (it, pos = it.forward(s.length), substr = it.extract(pos)) => substr == s ? success(pos, substr) : error(it, `expected: ${s}`);
  const unexpectedEndOfInput = "unexpected end of input";
  Flat.anyChar = (it) => it.hasNext() ? success(it.next(), it.curr()) : error(it, unexpectedEndOfInput);
  Flat.pchar = (c) => Flat.attempt(bind(Flat.anyChar, (u) => u == c ? pure(c) : fail(`expected: ${c}`)));
})(Flat ||= {});

// src/parsec/lazy.ts
var run = (val) => ("type" in val) && val.type == "lazy" ? val.run() : val;

// src/parsec/combinator.ts
class Parser {
  parse;
  constructor(parse2) {
    this.parse = parse2;
  }
  many() {
    return new Parser((it) => {
      const list = [];
      let result;
      let pos = it;
      while ((result = this.parse(pos)).type != "error") {
        list.push(result.res);
        pos = result.pos;
      }
      return success(result.pos, list);
    });
  }
  asterisk(f) {
    const items = this.many();
    return f ? items.map((xs) => xs.reduce((s, t) => f(s, t))) : items.map((xs) => xs.reduce((s, t) => s + t, ""));
  }
  some() {
    return new Parser((it) => {
      const list = [];
      let pos = it;
      let result = this.parse(pos);
      while ((result = this.parse(pos)).type != "error") {
        list.push(result.res);
        pos = result.pos;
      }
      return list.length >= 1 ? success(result.pos, list) : error(it, result.err);
    });
  }
  plus(f) {
    const items = this.some();
    return f ? items.map((xs) => xs.reduce((s, t) => f(s, t))) : items.map((xs) => xs.reduce((s, t) => s + t));
  }
  map(f) {
    return new Parser((it) => {
      const result = this.parse(it);
      return result.type != "error" ? success(result.pos, f(result.res)) : result;
    });
  }
  assume(predicate, err) {
    return new Parser((it) => {
      const result = this.parse(it);
      return result.type != "error" ? predicate(result.res) ? success(result.pos, result.res) : error(it, err || "assume fail") : result;
    });
  }
  or(p) {
    return new Parser((it) => Flat.orElse(this.parse, run(p).parse)(it));
  }
  follow(p) {
    return new Parser((it) => {
      const result = this.parse(it);
      if (result.type != "error") {
        const continued = run(p).parse(result.pos);
        return continued.type != "error" ? success(continued.pos, [result.res, continued.res]) : error(result.pos, continued.err);
      }
      return error(it, result.err);
    });
  }
  follow2(p, q) {
    return this.follow(p).follow(q);
  }
  skip(p) {
    return new Parser((it) => {
      const result = this.parse(it);
      if (result.type != "error") {
        const ignored = p.parse(result.pos);
        return ignored.type != "error" ? success(ignored.pos, result.res) : error(result.pos, ignored.err);
      }
      return error(it, result.err);
    });
  }
  move(p) {
    return new Parser((it) => {
      const ignored = this.parse(it);
      if (ignored.type != "error") {
        const result = run(p).parse(ignored.pos);
        return result.type != "error" ? success(result.pos, result.res) : error(ignored.pos, result.err);
      }
      return error(it, ignored.err);
    });
  }
}

// src/parsec/collection.ts
var token = (predicate, err) => new Parser((it, c = it.curr()) => c && predicate(c) ? success(it.next(), c) : error(it, err || "token mismatch"));
var character = (c) => new Parser(Flat.pchar(c));
var space = character(" ");
var spaceAster = space.asterisk();
var spacePlus = space.plus();
var digit = token((c) => c.boundedIn("0", "9"));
var digits = digit.plus();
var letter = token((c) => c.boundedIn("a", "z") || c.boundedIn("A", "Z"));
var letters = letter.plus();

// src/formatter.ts
var anyChar = new Parser(Flat.anyChar).map((s) => ({ type: "ANY", data: s }));
var CJK = "\u2E80-\u2EFF\u2F00-\u2FDF\u3040-\u309F\u30A0-\u30FA\u30FC-\u30FF\u3100-\u312F\u3200-\u32FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF";
var REG_CJK = new RegExp(`[${CJK}]`);
var letterCJK = token((c) => REG_CJK.test(c));
var lettersCJK = letterCJK.plus().map((s) => ({ type: "CJK", data: s }));
var spaceL = token((c) => ["\uFF08", "("].includes(c)).map((s) => ({ type: "CJK_L", data: s }));
var spaceR = token((c) => ["\uFF09", "\uFF01", "\uFF1B", "\uFF1A", "\uFF0C", "\u3002", "\uFF1F", ")", "!", ";", ":", ",", ".", "?"].includes(c)).map((s) => ({ type: "CJK_R", data: s }));
var ANS = "A-Za-z\u0370-\u03FF0-9~\\$%\\^&\\*\\+\\\\=\\|/\xA1-\xFF\u2150-\u218F\u2700\u2014\u27BF";
var lettersANS = token((c) => new RegExp(`[${ANS}]`).test(c)).plus().map((s) => ({ type: "ANS", data: s }));
var tokenizer = lettersCJK.or(lettersANS).or(spaceL).or(spaceR).or(anyChar).many();
var replaceCJK = (s) => s.replace(/～/g, "~").replace(/！/g, "!").replace(/；/g, ";").replace(/：/g, ":").replace(/，/g, ",").replace(/。/g, ".").replace("\uFF1F", "?").replace(/（/g, "(").replace(/）/g, ")");
var mergeTokens = (tokens) => {
  let result = "";
  for (let i = 0;i < tokens.length; i++) {
    const prev = tokens[i - 1] || { type: "ERR" };
    const curr = tokens[i];
    let data = curr.data;
    (curr.type == "CJK_L" || curr.type == "CJK_R") && (data = replaceCJK(data));
    prev.type == "CJK" && curr.type == "CJK_L" && (data = ` ${data}`);
    prev.type == "CJK_R" && curr.type == "CJK" && (data = ` ${data}`);
    prev.type == "ANS" && ["CJK", "CJK_L"].includes(curr.type) && (data = ` ${data}`);
    ["CJK", "CJK_R"].includes(prev.type) && curr.type == "ANS" && (data = ` ${data}`);
    result += data;
  }
  return result;
};
var formatter = (s) => {
  const result = tokenizer.parse(s.toIterator());
  return result.type == "success" ? mergeTokens(result.res) : s;
};

export {
  formatter
};
