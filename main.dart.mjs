// Compiles a dart2wasm-generated main module from `source` which can then
// be instantiated via the `instantiate` method.
//
// `source` needs to be a `Response` object (or promise thereof) e.g. created
// via the `fetch()` JS API.
export async function compileStreaming(source) {
  const builtins = {builtins: ['js-string']};
  return new CompiledApp(
      await WebAssembly.compileStreaming(source, builtins), builtins);
}

// Compiles a dart2wasm-generated wasm module from `bytes` which is then
// instantiable via the `instantiate` method.
export async function compile(bytes) {
  const builtins = {builtins: ['js-string']};
  return new CompiledApp(await WebAssembly.compile(bytes, builtins), builtins);
}

class CompiledApp {
  constructor(module, builtins) {
    this.module = module;
    this.builtins = builtins;
  }

  // The second argument is an options object containing:
  // `loadDeferredModules` is a JS function that takes an array of module names
  //   matching wasm files produced by the dart2wasm compiler. It also takes a
  //   callback that should be invoked for each loaded module with 2 arguments:
  //   (1) the module name, (2) the loaded module in a format supported by
  //   `WebAssembly.compile` or `WebAssembly.compileStreaming`. The callback
  //   returns a Promise that resolves when the module is instantiated.
  //   loadDeferredModules should return a Promise that resolves when all the
  //   modules have been loaded and the callback promises have resolved.
  // `loadDeferredId` is a JS function that takes load ID produced by the
  //   compiler when the `use-load-ids` option is passed. Each load ID maps to
  //   one or more wasm files as specified in the emitted JSON file. It also
  //   takes a callback that should be invoked for each loaded module with 2
  //   arguments: (1) the module name, (2) the loaded module in a format
  //   supported by `WebAssembly.compile` or `WebAssembly.compileStreaming`.
  //   The callback returns a Promise that resolves when the module is
  //   instantiated.
  //   loadDeferredId should return a Promise that resolves when all the
  //   modules have been loaded and the callback promises have resolved.
  async instantiate(additionalImports, {loadDeferredModules, loadDeferredId} = {}) {
    let dartInstance;

    // Prints to the console
    function printToConsole(value) {
      if (typeof dartPrint == "function") {
        dartPrint(value);
        return;
      }
      if (typeof console == "object" && typeof console.log != "undefined") {
        console.log(value);
        return;
      }
      if (typeof print == "function") {
        print(value);
        return;
      }

      throw "Unable to print message: " + value;
    }

    // A special symbol attached to functions that wrap Dart functions.
    const jsWrappedDartFunctionSymbol = Symbol("JSWrappedDartFunction");

    function finalizeWrapper(dartFunction, wrapped) {
      wrapped.dartFunction = dartFunction;
      wrapped[jsWrappedDartFunctionSymbol] = true;
      return wrapped;
    }

    // Imports
    const dart2wasm = {
            AB: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      AC: Function.prototype.call.bind(DataView.prototype.setUint16),
      AD: o => {
        if (o === null || o === undefined) return 0;
        if (typeof(o) === 'string') return 1;
        return 2;
      },
      AE: x0 => globalThis.parseFloat(x0),
      AF: x0 => x0.identifier,
      AG: (x0,x1) => new Intl.v8BreakIterator(x0,x1),
      AH: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
      AI: (x0,x1) => { x0.min = x1 },
      AJ: x0 => new Blob(x0),
      AK: (x0,x1) => { x0.width = x1 },
      AL: (x0,x1) => { x0.volume = x1 },
      AM: x0 => x0.accuracy,
      B: s => printToConsole(s),
      BB: b => !!b,
      BC: Function.prototype.call.bind(DataView.prototype.setUint8),
      BD: x0 => x0.tabIndex,
      BE: (x0,x1) => x0.getComputedStyle(x1),
      BF: x0 => x0.touches,
      BG: x0 => x0.v8BreakIterator,
      BH: (x0,x1) => { x0.value = x1 },
      BI: (x0,x1) => { x0.max = x1 },
      BJ: (x0,x1,x2,x3,x4) => ({type: x0,data: x1,premultiplyAlpha: x2,colorSpaceConversion: x3,preferAnimation: x4}),
      BK: (x0,x1) => x0.toDataURL(x1),
      BL: (x0,x1) => x0.createElement(x1),
      BM: x0 => x0.altitudeAccuracy,
      C: Function.prototype.call.bind(Number.prototype.toString),
      CB: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      CC: Function.prototype.call.bind(DataView.prototype.setInt8),
      CD: (x0,x1) => x0.contains(x1),
      CE: x0 => x0.documentElement,
      CF: x0 => x0.pressure,
      CG: () => globalThis.Intl,
      CH: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
      CI: (x0,x1) => { x0.disabled = x1 },
      CJ: x0 => new window.ImageDecoder(x0),
      CK: (x0,x1,x2,x3) => x0.drawImage(x1,x2,x3),
      CL: () => globalThis.document,
      CM: x0 => x0.altitude,
      D: Function.prototype.call.bind(String.prototype.indexOf),
      DB: (x0,x1) => x0.focus(x1),
      DC: Function.prototype.call.bind(DataView.prototype.getInt8),
      DD: x0 => x0.activeElement,
      DE: x0 => x0.computedStyleMap(),
      DF: x0 => x0.tiltY,
      DG: (x0,x1) => x0.segment(x1),
      DH: (x0,x1) => { x0.value = x1 },
      DI: (x0,x1) => { x0.scrollLeft = x1 },
      DJ: x0 => x0.name,
      DK: (x0,x1) => x0.getContext(x1),
      DL: (x0,x1) => x0.querySelector(x1),
      DM: x0 => x0.timestamp,
      E: o => o,
      EB: () => ({}),
      EC: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Int8Array) return 1;
        return 2;
      },
      ED: x0 => x0.parentNode,
      EE: (x0,x1) => x0.get(x1),
      EF: x0 => x0.tiltX,
      EG: x0 => x0.index,
      EH: s => {
        if (/[[\]{}()*+?.\\^$|]/.test(s)) {
            s = s.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');
        }
        return s;
      },
      EI: (x0,x1) => { x0.spellcheck = x1 },
      EJ: x0 => x0.repetitionCount,
      EK: x0 => x0.format,
      EL: (x0,x1) => x0.append(x1),
      EM: x0 => x0.longitude,
      F: s => JSON.stringify(s),
      FB: (o, p, v) => o[p] = v,
      FC: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
      FD: x0 => x0.tagName,
      FE: (o, p) => p in o,
      FF: x0 => x0.pointerType,
      FG: x0 => x0.next(),
      FH: x0 => x0.value,
      FI: (x0,x1) => { x0.disabled = x1 },
      FJ: x0 => x0.frameCount,
      FK: x0 => x0.canvasKitMaximumSurfaces,
      FL: x0 => x0.body,
      FM: x0 => x0.latitude,
      G: o => {
        if (o === undefined || o === null) return 0;
        if (typeof o === 'number') return 1;
        return 2;
      },
      GB: () => [],
      GC: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
      GD: x0 => x0.target,
      GE: (x0,x1) => { x0.textContent = x1 },
      GF: x0 => x0.pointerId,
      GG: x0 => x0.value,
      GH: x0 => x0.selectionDirection,
      GI: (a, i) => a.splice(i, 1),
      GJ: x0 => x0.selectedTrack,
      GK: x0 => x0.hostElement,
      GL: (x0,x1) => { x0.id = x1 },
      GM: x0 => x0.coords,
      H: x0 => x0.index,
      HB: (a, i) => a.push(i),
      HC: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
      HD: x0 => x0.clientY,
      HE: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      HF: x0 => x0.getCoalescedEvents(),
      HG: x0 => x0.done,
      HH: x0 => x0.selectionStart,
      HI: a => a.pop(),
      HJ: x0 => x0.completed,
      HK: x0 => x0.location,
      HL: x0 => globalThis.URL.revokeObjectURL(x0),
      HM: x0 => x0.permissions,
      I: (exn) => {
        let stackString = exn.toString();
        let frames = stackString.split('\n');
        let drop = 4;
        if (frames[0].startsWith('Error')) {
            drop += 1;
        }
        return frames.slice(drop).join('\n');
      },
      IB: x0 => new Int8Array(x0),
      IC: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
      ID: x0 => x0.clientX,
      IE: x0 => x0.matches,
      IF: (x0,x1) => x0.getModifierState(x1),
      IG: (o, m, a) => o[m].apply(o, a),
      IH: x0 => x0.selectionEnd,
      II: (map, o, v) => map.set(o, v),
      IJ: x0 => x0.ready,
      IK: (x0,x1) => x0.getModifierState(x1),
      IL: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      IM: x0 => x0.geolocation,
      J: () => new Error().stack,
      JB: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI8ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      JC: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
      JD: (x0,x1,x2) => x0.setAttribute(x1,x2),
      JE: (x0,x1) => x0.matchMedia(x1),
      JF: s => s.trimLeft(),
      JG: x0 => x0.iterator,
      JH: x0 => x0.value,
      JI: (map, o) => map.get(o),
      JJ: x0 => x0.tracks,
      JK: x0 => x0.metaKey,
      JL: (x0,x1,x2,x3) => x0.toBlob(x1,x2,x3),
      JM: x0 => globalThis.Intl.supportedValuesOf(x0),
      K: o => String(o),
      KB: x0 => new Uint8Array(x0),
      KC: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
      KD: x0 => x0.getBoundingClientRect(),
      KE: x0 => x0.matches,
      KF: s => s.toUpperCase(),
      KG: () => globalThis.Symbol,
      KH: x0 => x0.selectionDirection,
      KI: () => new WeakMap(),
      KJ: x0 => x0.close(),
      KK: x0 => x0.altKey,
      KL: x0 => globalThis.URL.createObjectURL(x0),
      KM: () => globalThis.Intl.DateTimeFormat(),
      L: o => o === undefined,
      LB: x0 => new Uint8ClampedArray(x0),
      LC: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
      LD: (ms, c) =>
      setTimeout(() => dartInstance.exports.$invokeCallback(c),ms),
      LE: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
      LF: x0 => x0.length,
      LG: (x0,x1) => new Intl.Segmenter(x0,x1),
      LH: x0 => x0.selectionStart,
      LI: x0 => globalThis.sabilInset(x0),
      LJ: (x0,x1) => ({frameIndex: x0,completeFramesOnly: x1}),
      LK: x0 => x0.ctrlKey,
      LL: x0 => x0.size,
      LM: x0 => x0.resolvedOptions(),
      M: (x0,x1) => x0.exec(x1),
      MB: x0 => new Int16Array(x0),
      MC: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
      MD: s => new Date(s * 1000).getTimezoneOffset() * 60,
      ME: f => f.dartFunction,
      MF: x0 => x0.pop(),
      MG: x0 => x0.Segmenter,
      MH: x0 => x0.selectionEnd,
      MI: x0 => new WeakRef(x0),
      MJ: (x0,x1) => x0.decode(x1),
      MK: x0 => x0.isComposing,
      ML: (x0,x1,x2,x3) => x0.drawImage(x1,x2,x3),
      MM: x0 => x0.timeZone,
      N: (x0,x1) => { x0.lastIndex = x1 },
      NB: x0 => new Uint16Array(x0),
      NC: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
      ND: Date.now,
      NE: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      NF: x0 => x0.flags,
      NG: x0 => x0.buffer,
      NH: x0 => x0.keyCode,
      NI: x0 => x0.deref(),
      NJ: x0 => x0.displayHeight,
      NK: x0 => x0.code,
      NL: (x0,x1,x2,x3,x4,x5) => x0.drawImage(x1,x2,x3,x4,x5),
      NM: x0 => x0.length,
      O: o => o,
      OB: x0 => new Int32Array(x0),
      OC: (x0,x1) => x0.querySelector(x1),
      OD: (handle) => clearTimeout(handle),
      OE: (wasmFunction,f) => finalizeWrapper(f, function(x0,x1) { return wasmFunction(f,arguments.length,x0,x1) }),
      OF: (a, s) => a.join(s),
      OG: x0 => x0.wasmMemory,
      OH: (x0,x1) => x0.scrollIntoView(x1),
      OI: () => globalThis.WeakRef,
      OJ: x0 => x0.displayWidth,
      OK: x0 => x0.repeat,
      OL: x0 => x0.height,
      OM: x0 => x0.getReader(),
      P: (s, m) => {
        try {
          return new RegExp(s, m);
        } catch (e) {
          return String(e);
        }
      },
      PB: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      PC: (x0,x1) => x0.item(x1),
      PD: (x0,x1) => x0.closest(x1),
      PE: (p, s, f) => p.then(s, (e) => f(e, e === undefined)),
      PF: (x0,x1) => x0.error(x1),
      PG: () => globalThis.window._flutter_skwasmInstance,
      PH: x0 => x0.multiViewEnabled,
      PI: (o, offsetInBytes, lengthInBytes) => {
        var dst = new ArrayBuffer(lengthInBytes);
        new Uint8Array(dst).set(new Uint8Array(o, offsetInBytes, lengthInBytes));
        return new DataView(dst);
      },
      PJ: x0 => x0.duration,
      PK: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      PL: x0 => x0.width,
      PM: x0 => x0.value,
      Q: o => o instanceof RegExp,
      QB: x0 => new Uint32Array(x0),
      QC: x0 => x0.length,
      QD: x0 => x0.bottom,
      QE: (o, i) => o[i],
      QF: () => globalThis.console,
      QG: () => new TextDecoder(),
      QH: (x0,x1) => x0.replaceWith(x1),
      QI: (a, s, e) => a.slice(s, e),
      QJ: x0 => x0.image,
      QK: x0 => x0.userAgent,
      QL: (x0,x1) => x0.getContext(x1),
      QM: x0 => x0.done,
      R: (string, times) => string.repeat(times),
      RB: x0 => new Float32Array(x0),
      RC: (x0,x1) => x0.querySelectorAll(x1),
      RD: x0 => x0.top,
      RE: o => o.length,
      RF: s => s.trimRight(),
      RG: (d, digits) => d.toFixed(digits),
      RH: (x0,x1) => { x0.type = x1 },
      RI: () => new AbortController(),
      RJ: () => globalThis.window.ImageDecoder,
      RK: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
      RL: (x0,x1) => { x0.height = x1 },
      RM: x0 => x0.read(),
      S: (s, p, i) => s.lastIndexOf(p, i),
      SB: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      SC: (x0,x1) => x0.getAttribute(x1),
      SD: x0 => x0.right,
      SE: o => {
        if (o === undefined) return 1;
        var type = typeof o;
        if (type === 'boolean') return 2;
        if (type === 'number') return 3;
        if (type === 'string') return 4;
        if (o instanceof Array) return 5;
        if (ArrayBuffer.isView(o)) {
          if (o instanceof Int8Array) return 6;
          if (o instanceof Uint8Array) return 7;
          if (o instanceof Uint8ClampedArray) return 8;
          if (o instanceof Int16Array) return 9;
          if (o instanceof Uint16Array) return 10;
          if (o instanceof Int32Array) return 11;
          if (o instanceof Uint32Array) return 12;
          if (o instanceof Float32Array) return 13;
          if (o instanceof Float64Array) return 14;
          if (o instanceof DataView) return 15;
        }
        if (o instanceof ArrayBuffer) return 16;
        // Feature check for `SharedArrayBuffer` before doing a type-check.
        if (globalThis.SharedArrayBuffer !== undefined &&
            o instanceof SharedArrayBuffer) {
            return 17;
        }
        if (o instanceof Promise) return 18;
        return 19;
      },
      SF: x0 => x0.blur(),
      SG: x0 => x0.maxHeight,
      SH: (x0,x1) => { x0.className = x1 },
      SI: (x0,x1,x2,x3,x4,x5) => ({method: x0,headers: x1,body: x2,credentials: x3,redirect: x4,signal: x5}),
      SJ: () => new FileReader(),
      SK: (x0,x1) => x0.getItem(x1),
      SL: (x0,x1) => { x0.width = x1 },
      SM: x0 => x0.body,
      T: o => o,
      TB: x0 => new Float64Array(x0),
      TC: x0 => x0.remove(),
      TD: x0 => x0.left,
      TE: x0 => x0.language,
      TF: x0 => x0.button,
      TG: x0 => x0.maxWidth,
      TH: (x0,x1) => { x0.tabIndex = x1 },
      TI: (x0,x1) => globalThis.fetch(x0,x1),
      TJ: (x0,x1) => x0.readAsArrayBuffer(x1),
      TK: x0 => x0.localStorage,
      TL: x0 => x0.height,
      TM: x0 => x0.assetBase,
      U: o => {
        if (o === undefined || o === null) return 0;
        if (typeof o === 'boolean') return 1;
        return 2;
      },
      UB: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF64ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      UC: (x0,x1) => x0.appendChild(x1),
      UD: x0 => x0.clientY,
      UE: (x0,x1,x2,x3) => x0.register(x1,x2,x3),
      UF: x0 => x0.innerHeight,
      UG: x0 => x0.minHeight,
      UH: (x0,x1) => { x0.name = x1 },
      UI: (x0,x1) => x0.get(x1),
      UJ: x0 => x0.result,
      UK: (x0,x1) => x0.key(x1),
      UL: x0 => x0.width,
      UM: x0 => x0.loader,
      V: x0 => x0.dotAll,
      VB: x0 => new ArrayBuffer(x0),
      VC: (x0,x1) => x0.append(x1),
      VD: x0 => x0.clientX,
      VE: () => globalThis.window.FinalizationRegistry,
      VF: x0 => x0.innerWidth,
      VG: x0 => x0.minWidth,
      VH: (x0,x1) => { x0.placeholder = x1 },
      VI: (wasmFunction,f) => finalizeWrapper(f, function(x0,x1,x2) { return wasmFunction(f,arguments.length,x0,x1,x2) }),
      VJ: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      VK: x0 => x0.length,
      VL: x0 => x0.remove(),
      VM: () => globalThis._flutter,
      W: x0 => x0.unicode,
      WB: (x0,x1,x2) => new Uint8Array(x0,x1,x2),
      WC: (x0,x1,x2,x3) => x0.setProperty(x1,x2,x3),
      WD: x0 => x0.changedTouches,
      WE: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      WF: x0 => x0.height,
      WG: x0 => x0.debugSkipFontRetryDelay,
      WH: (x0,x1) => { x0.autocomplete = x1 },
      WI: (x0,x1) => x0.forEach(x1),
      WJ: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      WK: (x0,x1) => x0.removeItem(x1),
      WL: (x0,x1) => { x0.src = x1 },
      X: x0 => x0.ignoreCase,
      XB: (x0,x1,x2) => new DataView(x0,x1,x2),
      XC: x0 => x0.style,
      XD: x0 => x0.offsetY,
      XE: x0 => new window.FinalizationRegistry(x0),
      XF: x0 => x0.width,
      XG: x0 => x0.status,
      XH: (x0,x1) => { x0.name = x1 },
      XI: x0 => x0.name,
      XJ: (x0,x1,x2,x3) => x0.removeEventListener(x1,x2,x3),
      XK: (x0,x1,x2) => x0.setItem(x1,x2),
      XL: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      Y: x0 => x0.multiline,
      YB: (o, p) => o[p],
      YC: x0 => x0.debugShowSemanticsNodes,
      YD: x0 => x0.offsetX,
      YE: (x0,x1) => x0.unregister(x1),
      YF: x0 => x0.clientHeight,
      YG: (x0,x1,x2) => x0.set(x1,x2),
      YH: (x0,x1) => { x0.placeholder = x1 },
      YI: x0 => x0.statusText,
      YJ: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      YK: x0 => x0.load(),
      YL: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      Z: Function.prototype.call.bind(Number.prototype.toString),
      ZB: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
      ZC: (x0,x1) => x0.warn(x1),
      ZD: x0 => x0.type,
      ZE: (x0,x1) => x0.contains(x1),
      ZF: x0 => x0.clientWidth,
      ZG: x0 => x0.arrayBuffer(),
      ZH: (x0,x1) => { x0.action = x1 },
      ZI: x0 => x0.url,
      ZJ: () => new XMLHttpRequest(),
      ZK: (x0,x1) => x0.removeAttribute(x1),
      ZL: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      a: Function.prototype.call.bind(BigInt.prototype.toString),
      aB: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
      aC: x0 => x0.console,
      aD: x0 => x0.maxTouchPoints,
      aE: (s) => +s,
      aF: (x0,x1) => { x0.content = x1 },
      aG: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof ArrayBuffer) return 1;
        if (globalThis.SharedArrayBuffer !== undefined &&
            o instanceof SharedArrayBuffer) {
          return 2;
        }
        return 3;
      },
      aH: (x0,x1) => { x0.method = x1 },
      aI: x0 => x0.status,
      aJ: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
      aK: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      aL: (x0,x1) => { x0.onerror = x1 },
      b: (exn) => {
        if (exn instanceof Error) {
          return exn.stack;
        } else {
          return null;
        }
      },
      bB: o => o.byteOffset,
      bC: () => globalThis.window,
      bD: x0 => x0.platform,
      bE: s => {
        if (!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(s)) {
          return NaN;
        }
        return parseFloat(s);
      },
      bF: (x0,x1) => { x0.name = x1 },
      bG: (x0,x1) => x0.fetch(x1),
      bH: (x0,x1) => { x0.noValidate = x1 },
      bI: x0 => x0.getReader(),
      bJ: x0 => x0.send(),
      bK: (x0,x1,x2) => x0.addEventListener(x1,x2),
      bL: (x0,x1) => { x0.oncancel = x1 },
      c: (c) =>
      queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
      cB: o => o.buffer,
      cC: (o, c) => o instanceof c,
      cD: x0 => x0.body,
      cE: s => s.trim(),
      cF: x0 => x0.head,
      cG: x0 => x0.fontFallbackBaseUrl,
      cH: (x0,x1) => x0.removeAttribute(x1),
      cI: x0 => x0.read(),
      cJ: x0 => x0.type,
      cK: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      cL: (x0,x1) => { x0.onchange = x1 },
      d: (x0,x1) => x0.didCreateEngineInitializer(x1),
      dB: Function.prototype.call.bind(DataView.prototype.getUint8),
      dC: (string, token) => string.split(token),
      dD: () => globalThis.document,
      dE: x0 => x0.classList,
      dF: (x0,x1) => x0.removeChild(x1),
      dG: (handle) => clearInterval(handle),
      dH: x0 => x0.isConnected,
      dI: x0 => x0.value,
      dJ: x0 => x0.response,
      dK: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      dL: x0 => x0.type,
      e: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      eB: (b, o) => new DataView(b, o),
      eC: o => o instanceof Array,
      eD: (x0,x1,x2) => x0.addEventListener(x1,x2),
      eE: x0 => x0.preventDefault(),
      eF: x0 => x0.firstChild,
      eG: (ms, c) =>
      setInterval(() => dartInstance.exports.$invokeCallback(c), ms),
      eH: x0 => x0.click(),
      eI: x0 => x0.done,
      eJ: (x0,x1) => { x0.responseType = x1 },
      eK: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      eL: x0 => x0.lastModified,
      f: (wasmFunction,f) => finalizeWrapper(f, function() { return wasmFunction(f,arguments.length) }),
      fB: (b, o, l) => new DataView(b, o, l),
      fC: (a, i) => a[i],
      fD: x0 => x0.hasFocus(),
      fE: x0 => x0.parent,
      fF: x0 => x0.viewConstraints,
      fG: () => Date.now(),
      fH: (x0,x1) => x0.getElementsByClassName(x1),
      fI: x0 => x0.cancel(),
      fJ: x0 => x0.vendor,
      fK: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      fL: x0 => x0.name,
      g: (x0,x1) => ({initializeEngine: x0,autoStart: x1}),
      gB: Function.prototype.call.bind(DataView.prototype.getFloat64),
      gC: a => a.length,
      gD: x0 => x0.relatedTarget,
      gE: x0 => x0.timeStamp,
      gF: x0 => x0.hostElement,
      gG: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      gH: (x0,x1) => x0.dispatchEvent(x1),
      gI: x0 => x0.body,
      gJ: x0 => x0.navigator,
      gK: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      gL: (x0,x1) => x0.item(x1),
      h: (wasmFunction,f) => finalizeWrapper(f, function(x0,x1) { return wasmFunction(f,arguments.length,x0,x1) }),
      hB: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Float64Array) return 1;
        return 2;
      },
      hC: (x0,x1) => x0.test(x1),
      hD: x0 => x0.shiftKey,
      hE: (x0,x1) => x0.hasAttribute(x1),
      hF: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      hG: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF64ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      hH: (x0,x1) => x0.createEvent(x1),
      hI: x0 => x0.headers,
      hJ: () => globalThis.window,
      hK: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      hL: x0 => x0.length,
      i: x0 => new Promise(x0),
      iB: Function.prototype.call.bind(DataView.prototype.setFloat64),
      iC: x0 => x0.userAgent,
      iD: (decoder, codeUnits) => decoder.decode(codeUnits),
      iE: x0 => x0.buttons,
      iF: x0 => ({runApp: x0}),
      iG: (x0,x1,x2,x3) => x0.pushState(x1,x2,x3),
      iH: (x0,x1,x2,x3) => x0.initEvent(x1,x2,x3),
      iI: x0 => x0.signal,
      iJ: o => o.byteLength,
      iK: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      iL: x0 => x0.files,
      j: (x0,x1,x2) => x0.call(x1,x2),
      jB: (t, s) => t.set(s),
      jC: x0 => x0.navigator,
      jD: () => new TextDecoder("utf-8", {fatal: true}),
      jE: x0 => x0.ctrlKey,
      jF: Function.prototype.call.bind(DataView.prototype.getBigInt64),
      jG: x0 => x0.history,
      jH: x0 => x0.readText(),
      jI: () => {
        return typeof process != "undefined" &&
               Object.prototype.toString.call(process) == "[object process]" &&
               process.platform == "win32"
      },
      jJ: (x0,x1,x2,x3) => x0.putImageData(x1,x2,x3),
      jK: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      jL: x0 => x0.target,
      k: (constructor, args) => {
        const factoryFunction = constructor.bind.apply(
            constructor, [null, ...args]);
        return new factoryFunction();
      },
      kB: Function.prototype.call.bind(DataView.prototype.setFloat32),
      kC: Function.prototype.call.bind(String.prototype.toLowerCase),
      kD: () => new TextDecoder("utf-8", {fatal: false}),
      kE: x0 => x0.y,
      kF: Function.prototype.call.bind(DataView.prototype.setBigInt64),
      kG: x0 => x0.search,
      kH: x0 => x0.clipboard,
      kI: () => {
        // On browsers return `globalThis.location.href`
        if (globalThis.location != null) {
          return globalThis.location.href;
        }
        return null;
      },
      kJ: x0 => x0.arrayBuffer(),
      kK: (x0,x1) => { x0.playbackRate = x1 },
      kL: (x0,x1) => x0.replaceChildren(x1),
      l: x0 => new Array(x0),
      lB: Function.prototype.call.bind(DataView.prototype.getFloat32),
      lC: Object.is,
      lD: (a, i, v) => a[i] = v,
      lE: x0 => x0.x,
      lF: (o, start, length) => new BigInt64Array(o.buffer, o.byteOffset + start, length),
      lG: x0 => x0.location,
      lH: (x0,x1) => x0.writeText(x1),
      lI: x0 => x0.abort(),
      lJ: (x0,x1) => x0.transferFromImageBitmap(x1),
      lK: x0 => x0.currentTime,
      lL: x0 => x0.click(),
      m: o => [o],
      mB: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Float32Array) return 1;
        return 2;
      },
      mC: x0 => x0.vendor,
      mD: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI8ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      mE: x0 => x0.scrollTop,
      mF: () => typeof dartUseDateNowForTicks !== "undefined",
      mG: x0 => x0.pathname,
      mH: x0 => x0.unlock(),
      mI: (a, i) => a.splice(i, 1)[0],
      mJ: x0 => x0.height,
      mK: x0 => x0.message,
      mL: (x0,x1,x2) => x0.setAttribute(x1,x2),
      n: (o0, o1) => [o0, o1],
      nB: Function.prototype.call.bind(DataView.prototype.getUint32),
      nC: (x0,x1) => x0.createTextNode(x1),
      nD: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      nE: x0 => x0.offsetTop,
      nF: () => Date.now(),
      nG: (x0,x1,x2,x3) => x0.replaceState(x1,x2,x3),
      nH: (x0,x1) => x0.lock(x1),
      nI: (x0,x1) => x0.getRandomValues(x1),
      nJ: x0 => x0.width,
      nK: x0 => x0.code,
      nL: (x0,x1) => { x0.accept = x1 },
      o: (o0, o1, o2) => [o0, o1, o2],
      oB: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Uint32Array) return 1;
        return 2;
      },
      oC: (x0,x1) => { x0.id = x1 },
      oD: x0 => x0.visibilityState,
      oE: x0 => x0.scrollLeft,
      oF: () => 1000 * performance.now(),
      oG: o => {
        const proto = Object.getPrototypeOf(o);
        return proto === Object.prototype || proto === null;
      },
      oH: x0 => x0.orientation,
      oI: () => globalThis.crypto,
      oJ: x0 => x0.rasterEndMilliseconds,
      oK: x0 => x0.error,
      oL: (x0,x1) => { x0.multiple = x1 },
      p: (o0, o1, o2, o3) => [o0, o1, o2, o3],
      pB: Function.prototype.call.bind(DataView.prototype.getInt32),
      pC: (x0,x1) => { x0.nonce = x1 },
      pD: (x0,x1,x2) => x0.removeEventListener(x1,x2),
      pE: x0 => x0.offsetLeft,
      pF: (x0,x1) => x0.requestAnimationFrame(x1),
      pG: o => Object.keys(o),
      pH: (x0,x1) => x0.querySelector(x1),
      pI: l => new DataView(new ArrayBuffer(l)),
      pJ: x0 => x0.rasterStartMilliseconds,
      pK: (x0,x1) => { x0.currentTime = x1 },
      pL: (x0,x1) => { x0.type = x1 },
      q: (x0,x1,x2) => { x0[x1] = x2 },
      qB: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Int32Array) return 1;
        return 2;
      },
      qC: x0 => x0.nonce,
      qD: x0 => x0.disconnect(),
      qE: x0 => x0.offsetParent,
      qF: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      qG: x0 => x0.state,
      qH: (x0,x1) => { x0.title = x1 },
      qI: (x0,x1) => x0.revokeObjectURL(x1),
      qJ: x0 => x0.imageBitmaps,
      qK: x0 => x0.play(),
      qL: (x0,x1) => x0.query(x1),
      r: (o, p) => o[p],
      rB: o => o instanceof Uint16Array,
      rC: () => globalThis.window.flutterConfiguration,
      rD: x0 => new Intl.Locale(x0),
      rE: (x0,x1) => x0[x1],
      rF: x0 => x0.now(),
      rG: x0 => x0.hash,
      rH: (x0,x1) => x0.vibrate(x1),
      rI: (x0,x1) => { x0.src = x1 },
      rJ: (x0,x1) => { x0.height = x1 },
      rK: x0 => x0.duration,
      rL: x0 => x0.state,
      s: () => globalThis,
      sB: Function.prototype.call.bind(DataView.prototype.getUint16),
      sC: (x0,x1) => x0.attachShadow(x1),
      sD: x0 => x0.region,
      sE: (o, p, r) => o.replace(p, () => r),
      sF: x0 => x0.performance,
      sG: x0 => x0.state,
      sH: x0 => x0.content,
      sI: (x0,x1,x2,x3,x4) => globalThis.createImageBitmap(x0,x1,x2,x3,x4),
      sJ: (x0,x1) => { x0.width = x1 },
      sK: (x0,x1) => { x0.preload = x1 },
      sL: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      t: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      tB: o => o instanceof Int16Array,
      tC: (x0,x1) => x0.createElement(x1),
      tD: x0 => x0.script,
      tE: (o, p, r) => o.replaceAll(p, () => r),
      tF: x0 => new Uint8Array(x0),
      tG: (x0,x1) => x0.go(x1),
      tH: x0 => x0.document,
      tI: x0 => x0.naturalHeight,
      tJ: x0 => x0.convertToBlob(),
      tK: (x0,x1) => { x0.src = x1 },
      tL: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      u: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      uB: Function.prototype.call.bind(DataView.prototype.getInt16),
      uC: x0 => x0.scale,
      uD: x0 => x0.language,
      uE: x0 => x0.deltaMode,
      uF: (x0,x1,x2) => x0.slice(x1,x2),
      uG: x0 => x0.parentElement,
      uH: (x0,x1,x2) => x0.insertBefore(x1,x2),
      uI: x0 => x0.naturalWidth,
      uJ: (x0,x1,x2) => new ImageData(x0,x1,x2),
      uK: x0 => x0.src,
      uL: (x0,x1,x2) => ({enableHighAccuracy: x0,timeout: x1,maximumAge: x2}),
      v: (x0,x1) => ({addView: x0,removeView: x1}),
      vB: o => o instanceof Uint8ClampedArray,
      vC: x0 => x0.visualViewport,
      vD: x0 => x0.languages,
      vE: x0 => x0.deltaY,
      vF: (x0,x1) => x0.decode(x1),
      vG: (x0,x1) => x0.querySelectorAll(x1),
      vH: x0 => x0.id,
      vI: x0 => x0.decode(),
      vJ: (x0,x1) => x0.getContext(x1),
      vK: (x0,x1) => x0.end(x1),
      vL: (x0,x1,x2,x3) => x0.getCurrentPosition(x1,x2,x3),
      w: (l, r) => l === r,
      wB: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Uint8Array) return 1;
        return 2;
      },
      wC: x0 => x0.devicePixelRatio,
      wD: (x0,x1) => x0.observe(x1),
      wE: x0 => x0.deltaX,
      wF: (x0,x1) => x0.adoptText(x1),
      wG: (x0,x1) => x0.removeProperty(x1),
      wH: x0 => x0.offsetHeight,
      wI: (x0,x1) => { x0.decoding = x1 },
      wJ: (x0,x1) => new OffscreenCanvas(x0,x1),
      wK: x0 => x0.length,
      wL: x0 => x0.message,
      x: x0 => x0.random(),
      xB: Function.prototype.call.bind(DataView.prototype.setInt32),
      xC: x0 => x0.height,
      xD: (wasmFunction,f) => finalizeWrapper(f, function(x0,x1) { return wasmFunction(f,arguments.length,x0,x1) }),
      xE: x0 => x0.wheelDeltaY,
      xF: x0 => x0.first(),
      xG: (x0,x1) => x0.add(x1),
      xH: x0 => x0.offsetWidth,
      xI: (x0,x1) => { x0.crossOrigin = x1 },
      xJ: x0 => x0.allocationSize(),
      xK: x0 => x0.buffered,
      xL: x0 => x0.code,
      y: () => globalThis.Math,
      yB: Function.prototype.call.bind(DataView.prototype.setUint32),
      yC: x0 => x0.width,
      yD: x0 => new ResizeObserver(x0),
      yE: x0 => x0.wheelDeltaX,
      yF: x0 => x0.next(),
      yG: x0 => x0.data,
      yH: x0 => x0.stopPropagation(),
      yI: (x0,x1) => x0.createObjectURL(x1),
      yJ: (x0,x1) => x0.copyTo(x1),
      yK: x0 => x0.pause(),
      yL: x0 => x0.speed,
      z: (x0,x1) => x0.prepend(x1),
      zB: Function.prototype.call.bind(DataView.prototype.setInt16),
      zC: x0 => x0.screen,
      zD: (x0,x1) => x0.getPropertyValue(x1),
      zE: x0 => x0.key,
      zF: x0 => x0.current(),
      zG: (x0,x1) => { x0.scrollTop = x1 },
      zH: x0 => x0.disabled,
      zI: x0 => x0.URL,
      zJ: (x0,x1) => { x0.height = x1 },
      zK: (x0,x1) => x0.setSinkId(x1),
      zL: x0 => x0.heading,

    };

    const baseImports = {
      _: dart2wasm,
      Math: Math,
      Date: Date,
      Object: Object,
      Array: Array,
      Reflect: Reflect,
      WebAssembly: {
        JSTag: WebAssembly.JSTag,
      },
      "": new Proxy({}, { get(_, prop) { return prop; } }),

    };

    const jsStringPolyfill = {
      "charCodeAt": (s, i) => s.charCodeAt(i),
      "compare": (s1, s2) => {
        if (s1 < s2) return -1;
        if (s1 > s2) return 1;
        return 0;
      },
      "concat": (s1, s2) => s1 + s2,
      "equals": (s1, s2) => s1 === s2,
      "fromCharCode": (i) => String.fromCharCode(i),
      "length": (s) => s.length,
      "substring": (s, a, b) => s.substring(a, b),
      "fromCharCodeArray": (a, start, end) => {
        if (end <= start) return '';

        const read = dartInstance.exports.$wasmI16ArrayGet;
        let result = '';
        let index = start;
        const chunkLength = Math.min(end - index, 500);
        let array = new Array(chunkLength);
        while (index < end) {
          const newChunkLength = Math.min(end - index, 500);
          for (let i = 0; i < newChunkLength; i++) {
            array[i] = read(a, index++);
          }
          if (newChunkLength < chunkLength) {
            array = array.slice(0, newChunkLength);
          }
          result += String.fromCharCode(...array);
        }
        return result;
      },
      "intoCharCodeArray": (s, a, start) => {
        if (s === '') return 0;

        const write = dartInstance.exports.$wasmI16ArraySet;
        for (var i = 0; i < s.length; ++i) {
          write(a, start++, s.charCodeAt(i));
        }
        return s.length;
      },
      "test": (s) => typeof s == "string",
    };


    

    dartInstance = await WebAssembly.instantiate(this.module, {
      ...baseImports,
      ...additionalImports,
      
      "wasm:js-string": jsStringPolyfill,
    });

    return new InstantiatedApp(this, dartInstance);
  }
}

class InstantiatedApp {
  constructor(compiledApp, instantiatedModule) {
    this.compiledApp = compiledApp;
    this.instantiatedModule = instantiatedModule;
  }

  // Call the main function with the given arguments.
  invokeMain(...args) {
    this.instantiatedModule.exports.$invokeMain(args);
  }
}
