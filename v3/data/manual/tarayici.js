'use strict';

(function (root) {
  root.PUSULLA_MANUAL = root.PUSULLA_MANUAL || {};
  root.PUSULLA_MANUAL["tarayici"] = {
  "verifiedBy": "agy-hydrogen-f4-c",
  "expectNote": "Onayli tarayici aliaslari, Opera GX ve WorldWideWeb yili",
  "drop": [],
  "add": [
    {
      "label": "Opera GX",
      "aliases": [],
      "year": 2019,
      "approx": false,
      "note": "genel bilgi - Vikipedi Opera GX ile dogrulanacak"
    }
  ],
  "alias": {
    "Google Chrome": [
      "Chrome",
      "Krom"
    ],
    "Internet Explorer": [
      "IE",
      "MSIE"
    ],
    "Microsoft Edge": [
      "Edge"
    ],
    "Mozilla Firefox": [
      "Firefox"
    ]
  },
  "year": {
    "WorldWideWeb": {
      "year": 1990,
      "approx": false,
      "note": "Tim Berners-Lee, CERN, genel bilgi - Vikipedi WorldWideWeb ile dogrulanacak"
    }
  }
};
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.PUSULLA_MANUAL;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
