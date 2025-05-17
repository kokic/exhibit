/**
 * Token types:
 * - "cjk": CJK characters
 * - "ascii": ASCII letters/numbers
 * - "space": whitespace (space, tab, newline)
 * - "punctuation": punctuation marks
 * - "math": TeX formulas (both inline $...$ and block $$...$$)
 */
const tokenize = (text) => {
  const is_cjk = (char) => {
    const code = char.charCodeAt(0);
    return (
      (code >= 0x4E00 && code <= 0x9FFF) ||
      (code >= 0x3400 && code <= 0x4DBF) ||
      (code >= 0x20000 && code <= 0x2A6DF) ||
      (code >= 0x2A700 && code <= 0x2B73F) ||
      (code >= 0x2B740 && code <= 0x2B81F) ||
      (code >= 0x2B820 && code <= 0x2CEAF) ||
      (code >= 0xF900 && code <= 0xFAFF) ||
      (code >= 0x3300 && code <= 0x33FF) ||
      (code >= 0xFE30 && code <= 0xFE4F) ||
      (code >= 0x2F800 && code <= 0x2FA1F)
    );
  };

  const is_space = (char) => /[\s\u3000]/.test(char); // Includes full-width space
  
  // ignored: 「」『』（）［］｛｝《》【】…—()\[\]{}<>\/|\-_=+*&^%$#@~`\'"
  const is_punctuation = (char) => /[。，、；：？！]/.test(char);
  const is_left_punctuation = (char) => /[「『（［｛《【(\[{<]/.test(char);
  const is_right_punctuation = (char) => /[」』）］｝》】)\]}>.,;:?!]/.test(char);
  
  const is_math_delimiter = (char, nextChar) => {
    if (char === '$') {
      if (nextChar === '$') return 2; // Block math delimiter
      return 1; // Inline math delimiter
    }
    return 0;
  };

  const create_token = (value, type) => ({ value, type });

  const process_character = (acc, char, nextChar) => {
    // Handle TeX formulas first
    const math_delim_length = is_math_delimiter(char, nextChar);
    if (math_delim_length > 0) {
      if (acc.in_math) {
        // Check if we're ending the same type of math delimiter
        const is_block_math = acc.math_delim_length === 2;
        const current_is_block = math_delim_length === 2;
        
        if (is_block_math === current_is_block) {
          // End of math
          const end_index = acc.index + math_delim_length;
          const math_content = text.slice(acc.math_start, end_index);
          const new_tokens = [...acc.tokens, create_token(math_content, 'math')];
          return {
            ...acc,
            tokens: new_tokens,
            in_math: false,
            current: null,
            index: end_index - 1 // Skip next character if it's part of $$
          };
        }
      } else {
        // Start of math
        const new_tokens = acc.current
          ? [...acc.tokens, create_token(acc.current.value, acc.current.type)]
          : acc.tokens;
        return {
          ...acc,
          tokens: new_tokens,
          in_math: true,
          math_start: acc.index,
          math_delim_length: math_delim_length,
          current: null,
          index: acc.index + (math_delim_length === 2 ? 1 : 0) // Skip next $ if $$
        };
      }
    }

    if (acc.in_math) {
      return acc; // Skip processing inside math
    }

    // Determine character type
    let char_type;
    if (is_space(char)) {
      char_type = 'space';
    } else if (is_punctuation(char)) {
      char_type = 'punctuation';
    } else if (is_left_punctuation(char)) {
      char_type = 'punctuation.left';
    } else if (is_right_punctuation(char)) {
      char_type = 'punctuation.right';
    } else if (is_cjk(char)) {
      char_type = 'cjk';
    } else {
      char_type = 'ascii';
    }

    // If no current token, start a new one
    if (!acc.current) {
      return { ...acc, current: create_token(char, char_type) };
    }

    // Check if we should break the token
    const should_break = (
      char_type !== acc.current.type || // Different type
      char_type === 'space' ||          // Spaces are always separate
      char_type.startsWith('punctuation')       // Punctuation is always separate
    );

    if (should_break) {
      const new_tokens = [...acc.tokens, acc.current];
      return { ...acc, tokens: new_tokens, current: create_token(char, char_type) };
    }

    // Continue building current token
    return {
      ...acc,
      current: create_token(acc.current.value + char, acc.current.type)
    };
  };

  const initial_acc = {
    tokens: [],
    current: null,
    in_math: false,
    math_start: -1,
    math_delim_length: 0,
    index: 0
  };

  // Process each character with its next character for lookahead
  let final_acc = initial_acc;
  for (let i = 0; i < text.length; i++) {
    const nextChar = i < text.length - 1 ? text[i + 1] : '';
    final_acc = process_character({ ...final_acc, index: i }, text[i], nextChar);
    
    // Skip next character if we're in a block math delimiter
    if (final_acc.index > i) {
      i = final_acc.index;
    }
  }

  // Add any remaining tokens
  const tokens = [
    ...final_acc.tokens,
    ...(final_acc.current ? [final_acc.current] : []),
    ...(final_acc.in_math ? [create_token(text.slice(final_acc.math_start), 'math')] : [])
  ];

  return tokens;
};

const EMPTY = { value: '', type: 'empty' };
const SPACE = { value: ' ', type: 'space' };

const DEFAULT_CONFIG = {
  /**
   * Enable to remove all '\n'
   */
  compact_line: false,

  /**
   * Enable to reduce multiple consecutive spaces ' ' to a single one (default: true)
   */
  compact_space: true,

  /**
   * Enable to replace Chinese punctuation with English equivalents (default: true)
   */
  en_punctuation: true,
};

const en_punctuation_map = {
  '。': '.',
  '，': ',',
  '；': ';',
  '：': ':',
  '！': '!',
  '？': '?',
  '（': '(', 
  '）': ')', 
  '【': '[', 
  '】': ']', 
};

const is_ascii = (token) => token?.type === 'ascii';
const is_cjk = (token) => token?.type === 'cjk';
const is_math = (token) => token?.type === 'math';
const is_space = (token) => token?.type === 'space';
const is_punctuation = (token) => token?.type === 'punctuation';
const is_left_punctuation = (token) => token?.type === 'punctuation.left';
const is_right_punctuation = (token) => token?.type === 'punctuation.right';
const is_any_punctuation = (token) => token?.type.startsWith('punctuation');

const is_text = (token) => is_ascii(token) || is_cjk(token);

const all = (arr, f) => arr.map(f).reduce((s, t) => s && t);
const just = (token_a, token_b, f, g) => f(token_a) && g(token_b);
const vice_versa = (token_a, token_b, f, g) =>
  just(token_a, token_b, f, g) || just(token_a, token_b, g, f);

const format_tokens = (tokens, config = DEFAULT_CONFIG) => {
  const { compact_line, compact_space, en_punctuation } = config;

  tokens = tokens.reduce((store, token) => {
    const prev_token = store.at(-1) || EMPTY;

    if (is_space(prev_token) && is_space(token)) {
      return store;
    }

    store.push(token);
    return store;
  }, []);

  const formatted_tokens = tokens.map((token, index) => {
    const prev = tokens[index - 1];
    const peek = tokens[index + 1];

    if (token.type === 'space') {
      token = compact_space ? SPACE : token;
    }

    if (en_punctuation && is_any_punctuation(token)) {
      token.value = en_punctuation_map[token.value] || token.value;
    }

    if (just(prev, token, is_cjk, is_left_punctuation)) {
      return { ...token, value: ' ' + token.value };
    }

    if (
      vice_versa(token, peek, is_ascii, is_cjk)
      || just(token, peek, is_punctuation, is_text)
      || just(token, peek, is_punctuation, is_math)
      || vice_versa(token, peek, is_math, is_text)
      || just(token, peek, is_right_punctuation, is_cjk)
    ) {
      return { ...token, value: token.value + ' ' };
    }

    if (
         (all([prev, peek], x => is_cjk(x) && x.value.length === 1) && is_space(token))
      || (is_text(prev) && is_space(token) && is_punctuation(peek))
    ) {
      return EMPTY;
    }

    return token;
  });

  if (compact_line) {
    return formatted_tokens.filter(token => token.value !== '\n')
      .map(t => t.value).join('');
  }

  return formatted_tokens.map(t => t.value).join('');
};

const format = (source, config = DEFAULT_CONFIG) => format_tokens(tokenize(source), config);
