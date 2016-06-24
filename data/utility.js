'use strict'

NGN.DATA = NGN.DATA || {}
NGN.DATA.util = {}

Object.defineProperties(NGN.DATA.util, {
  // CRC table for checksum (cached)
  crcTable: NGN.private(null),

  /**
   * @method makeCRCTable
   * Generate the CRC table for checksums. This is a fairly complex
   * operation that should only be executed once and cached for
   * repeat use.
   * @private
   */
  makeCRCTable: NGN.privateconst(function () {
    let c
    let crcTable = []
    for (let n = 0; n < 256; n++) {
      c = n
      for (let k = 0; k < 8; k++) {
        c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1))
      }
      crcTable[n] = c
    }
    return crcTable
  }),

  /**
   * @method checksum
   * Create the checksum of the specified string.
   * @param  {string} content
   * The content to generate a checksum for.
   * @return {string}
   * Generates a checksum value.
   */
  checksum: NGN.const(function (str) {
    let crcTable = this.crcTable || (this.crcTable = this.makeCRCTable())
    let crc = 0 ^ (-1)

    for (let i = 0; i < str.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF]
    }

    return (crc ^ (-1)) >>> 0
  }),

  /**
   * @method GUID
   * Generate  a globally unique identifier.
   *
   * This is a "fast" GUID generator, designed to work in the browser.
   * The likelihood of an ID collision is 1:3.26x10^15 (1 in 3.26 Quadrillion),
   * and it will generate the ID between approximately 105ms (Desktop) and 726ms
   * (Android) as of May 2016. This code came from StackOverflow, courtesy of
   * an answer from Jeff Ward.
   * @return {string}
   * Returns a V4 GUID.
   */
  GUID: NGN.const(function () {
    let lut = []
    for (var i = 0; i < 256; i++) {
      lut[i] = (i < 16 ? '0' : '') + (i).toString(16)
    }

    const d0 = Math.random() * 0xffffffff | 0
    const d1 = Math.random() * 0xffffffff | 0
    const d2 = Math.random() * 0xffffffff | 0
    const d3 = Math.random() * 0xffffffff | 0

    return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] +
      '-' + lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] +
      lut[d1 >> 24 & 0xff] + '-' + lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' +
      lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] + lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] +
      lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff]
  })
})
