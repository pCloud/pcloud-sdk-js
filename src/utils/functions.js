/* @flow */

import type { DownloadData } from "../api/types";

export function isEmail(email: string): boolean {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(\	".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export function fileext(filename: string): string {
  return filename.split(".").pop();
}

export function formatSize(sizebytes: number, prec: number): string {
  if (prec === undefined) {
    prec = 1;
  }

  sizebytes = parseInt(sizebytes, 10);

  if (sizebytes >= 1099511627776) {
    return (sizebytes / 1099511627776).toFixed(prec) + " Tb";
  } else if (sizebytes >= 1073741824) {
    return (sizebytes / 1073741824).toFixed(prec) + " Gb";
  } else if (sizebytes >= 1048576) {
    return (sizebytes / 1048576).toFixed(prec) + " Mb";
  } else if (sizebytes >= 1024) {
    return (sizebytes / 1024).toFixed(prec) + " Kb";
  } else {
    return sizebytes.toFixed(prec) + " B";
  }
}

let start = 0;
export function uniqueNumber(): number {
  return ++start;
}

export function randomNumber(chars: number = 10) {
  return Math.random() * (10 << chars);
}

export function methodStringify(method: string, params: Object): string {
  return JSON.stringify({ method: method, params: params });
}

export function pCloudUrl(data: DownloadData) {
  return "https://" + data.hosts[0] + data.path;
}
