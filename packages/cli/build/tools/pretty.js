'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.theme =
  exports.highlight =
  exports.ir =
  exports.em =
  exports.link =
  exports.spinner =
  exports.clearSpinners =
  exports.stopLastSpinner =
  exports.stopSpinner =
  exports.startSpinner =
  exports.prettyPrompt =
  exports.format =
  exports.prettyJson =
  exports.icons =
  exports.prefix =
  exports.prettyprint =
  exports.hr =
  exports.cliHeader =
  exports.warning =
  exports.direction =
  exports.command =
  exports.heading =
  exports.p =
  exports.INDENT =
    void 0
var gluegun_1 = require('gluegun')
var _a = gluegun_1.print.colors,
  bgRed = _a.bgRed,
  bgWhite = _a.bgWhite,
  underline = _a.underline,
  gray = _a.gray,
  white = _a.white,
  bold = _a.bold,
  red = _a.red,
  yellow = _a.yellow,
  green = _a.green,
  blue = _a.blue
exports.INDENT = '   '
var p = function (m) {
  if (m === void 0) {
    m = ''
  }
  return gluegun_1.print.info(gray(exports.INDENT + m))
}
exports.p = p
var heading = function (m) {
  if (m === void 0) {
    m = ''
  }
  return (0, exports.p)(white(bold(m)))
}
exports.heading = heading
var command = function (m, second, examples) {
  if (m === void 0) {
    m = ''
  }
  if (second === void 0) {
    second = ''
  }
  if (examples === void 0) {
    examples = []
  }
  m = typeof m === 'string' ? m : m.m + ' '.repeat(m.width - m.m.length)
  ;(0, exports.p)(white(m) + '  ' + gray(second))
  var indent = m.length + 2
  if (examples) {
    examples.forEach(function (ex) {
      return (0, exports.p)(gray(' '.repeat(indent) + white(ex)))
    })
  }
}
exports.command = command
var direction = function (m) {
  if (m === void 0) {
    m = ''
  }
  return (0, exports.p)(red(m))
}
exports.direction = direction
var warning = function (m) {
  if (m === void 0) {
    m = ''
  }
  return (0, exports.p)(exports.icons.warning + ' ' + gray(m))
}
exports.warning = warning
var cliHeader = function () {
  return (0, exports.p)(
    blue(
      '· · · · · · · · · · · · · · · · · ·' +
        bold(' Minds Mobile CLI ') +
        '· · · · · · · · · · · · · · · · · ·'
    )
  )
}
exports.cliHeader = cliHeader
var hr = function () {
  return (0, exports.p)(
    ' \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500'
  )
}
exports.hr = hr
exports.prettyprint = {
  command: exports.command,
  direction: exports.direction,
  heading: exports.heading,
  hr: exports.hr,
  cliHeader: exports.cliHeader,
  p: exports.p,
  warning: exports.warning,
}
/**
 * enquirer style customization
 * @see https://github.dev/enquirer/enquirer/blob/36785f3399a41cd61e9d28d1eb9c2fcd73d69b4c/examples/select/option-elements.js#L19
 */
var prefix = function (state) {
  return {
    pending: '📝',
    submitted: green('✔'),
    cancelled: red('✘'),
  }[state.status]
}
exports.prefix = prefix
exports.icons = {
  done: green('✔'),
  failed: red('✘'),
  warning: yellow(bold('⚠')),
}
var formatValue = function (value, indentLevel) {
  if (typeof value === 'object' && value !== null) {
    return formatObject(value, indentLevel + 1)
  }
  return white(value)
}
var formatObject = function (obj, indentLevel) {
  var currentIndent = exports.INDENT.repeat(indentLevel)
  var nextIndent = exports.INDENT.repeat(indentLevel + 1)
  return (
    gray(currentIndent + '{\n') +
    Object.entries(obj)
      .map(function (_a) {
        var key = _a[0],
          value = _a[1]
        return gray(nextIndent + key + ': ') + formatValue(value, indentLevel)
      })
      .join(',\n') +
    gray('\n' + currentIndent + '}')
  )
}
var prettyJson = function (json) {
  return formatObject(json, 1)
}
exports.prettyJson = prettyJson
/** Format displayed messages for prompts */
exports.format = {
  /** Format boolean values for human on prompts  */
  boolean: function (value) {
    return value ? 'Yes' : 'No'
  },
}
exports.prettyPrompt = {
  format: exports.format,
}
var spinners = {}
var startSpinner = function (m) {
  if (m === void 0) {
    m = ''
  }
  var spinner = spinners[m]
  if (!spinner) {
    spinner = gluegun_1.print.spin({
      prefixText: exports.INDENT,
      text: gray(m),
    })
    spinners[m] = spinner
  }
  return spinner
}
exports.startSpinner = startSpinner
var stopSpinner = function (m, symbol) {
  var spinner = spinners[m]
  if (spinner) {
    spinner.stopAndPersist({ symbol: symbol, text: white(m) })
    delete spinners[m]
  }
}
exports.stopSpinner = stopSpinner
var stopLastSpinner = function (symbol) {
  var lastKey = Object.keys(spinners).pop()
  if (lastKey) {
    var lastSpinner = spinners[lastKey]
    lastSpinner.stopAndPersist({ symbol: symbol })
    delete spinners[lastKey]
  }
}
exports.stopLastSpinner = stopLastSpinner
var clearSpinners = function () {
  Object.keys(spinners).forEach(function (m) {
    spinners[m].stop()
    delete spinners[m]
  })
}
exports.clearSpinners = clearSpinners
exports.spinner = {
  start: exports.startSpinner,
  stop: exports.stopSpinner,
  stopLast: exports.stopLastSpinner,
  clear: exports.clearSpinners,
}
var link = function (m) {
  if (m === void 0) {
    m = ''
  }
  return underline(white(m))
}
exports.link = link
var em = function (m) {
  if (m === void 0) {
    m = ''
  }
  return bold(white(m))
}
exports.em = em
var ir = function (m) {
  if (m === void 0) {
    m = ''
  }
  return bgRed(bold(white(m)))
}
exports.ir = ir
var highlight = function (m) {
  if (m === void 0) {
    m = ''
  }
  return bold(bgWhite(red(m)))
}
exports.highlight = highlight
exports.theme = {
  em: exports.em,
  highlight: exports.highlight,
  link: exports.link,
  ir: exports.ir,
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJldHR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Rvb2xzL3ByZXR0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBK0I7QUFFekIsSUFBQSxLQVdGLGVBQUssQ0FBQyxNQUFNLEVBVmQsS0FBSyxXQUFBLEVBQ0wsT0FBTyxhQUFBLEVBQ1AsU0FBUyxlQUFBLEVBQ1QsSUFBSSxVQUFBLEVBQ0osS0FBSyxXQUFBLEVBQ0wsSUFBSSxVQUFBLEVBQ0osR0FBRyxTQUFBLEVBQ0gsTUFBTSxZQUFBLEVBQ04sS0FBSyxXQUFBLEVBQ0wsSUFBSSxVQUNVLENBQUE7QUFFSCxRQUFBLE1BQU0sR0FBRyxLQUFLLENBQUE7QUFFcEIsSUFBTSxDQUFDLEdBQUcsVUFBQyxDQUFNO0lBQU4sa0JBQUEsRUFBQSxNQUFNO0lBQUssT0FBQSxlQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFBNUIsQ0FBNEIsQ0FBQTtBQUE1QyxRQUFBLENBQUMsS0FBMkM7QUFFbEQsSUFBTSxPQUFPLEdBQUcsVUFBQyxDQUFNO0lBQU4sa0JBQUEsRUFBQSxNQUFNO0lBQUssT0FBQSxJQUFBLFNBQUMsRUFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFBakIsQ0FBaUIsQ0FBQTtBQUF2QyxRQUFBLE9BQU8sV0FBZ0M7QUFFN0MsSUFBTSxPQUFPLEdBQUcsVUFDckIsQ0FBNkMsRUFDN0MsTUFBVyxFQUNYLFFBQXVCO0lBRnZCLGtCQUFBLEVBQUEsTUFBNkM7SUFDN0MsdUJBQUEsRUFBQSxXQUFXO0lBQ1gseUJBQUEsRUFBQSxhQUF1QjtJQUV2QixDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FB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
