#!/usr/bin/env node
/**
 * Placeholder image generator
 * ===========================
 * Creates clean, illustrated WebP placeholders at every path the website uses
 * (see README → "Images"). They keep the site looking finished until the owner
 * replaces them with real shop photos.
 *
 *   npm run images          → create only MISSING images (never overwrites real photos)
 *   npm run images -- --force → regenerate every placeholder (overwrites!)
 *
 * To use a real photo: save it with the SAME file name in the same folder
 * (e.g. public/images/categories/dona.webp) and it will be used automatically.
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'images');
const FORCE = process.argv.includes('--force');

/* ------------------------------------------------------------------ */
/*  Palette & shared SVG defs                                          */
/* ------------------------------------------------------------------ */
const C = {
  red: '#C62828',
  redDark: '#8E1B1B',
  marigold: '#F9A825',
  marigoldDeep: '#EF7F1A',
  green: '#2E7D32',
  cream: '#FFFBF5',
  creamAlt: '#FFF4E6',
  line: '#F0E6DA',
  ink: '#1F1F1F',
};
const LATIN_FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const HINDI_FONT = "'Kohinoor Devanagari', 'Devanagari Sangam MN', 'Noto Sans Devanagari', sans-serif";

const n = (v) => Number(v).toFixed(1);

const DEFS = `
<defs>
  <linearGradient id="silver" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#FBFCFD"/><stop offset=".42" stop-color="#D3D7DD"/>
    <stop offset=".68" stop-color="#F2F4F6"/><stop offset="1" stop-color="#B9BFC7"/>
  </linearGradient>
  <radialGradient id="silverDish" cx=".45" cy=".4" r=".7">
    <stop offset="0" stop-color="#F1F3F5"/><stop offset=".75" stop-color="#CDD2D8"/><stop offset="1" stop-color="#AEB5BD"/>
  </radialGradient>
  <radialGradient id="silverDeep" cx=".5" cy=".55" r=".6">
    <stop offset="0" stop-color="#9EA5AE"/><stop offset=".7" stop-color="#C9CED4"/><stop offset="1" stop-color="#E9ECEF"/>
  </radialGradient>
  <linearGradient id="leaf" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#8DBA52"/><stop offset=".55" stop-color="#6A9A38"/><stop offset="1" stop-color="#4F7E2A"/>
  </linearGradient>
  <radialGradient id="leafDeep" cx=".5" cy=".55" r=".6">
    <stop offset="0" stop-color="#4A7526"/><stop offset=".75" stop-color="#6C9C3A"/><stop offset="1" stop-color="#8CB956"/>
  </radialGradient>
  <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#EFE9E0"/>
  </linearGradient>
  <radialGradient id="paperDeep" cx=".5" cy=".55" r=".6">
    <stop offset="0" stop-color="#E4DDD2"/><stop offset="1" stop-color="#FFFFFF"/>
  </radialGradient>
  <linearGradient id="foil" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#F4F6F8"/><stop offset=".35" stop-color="#C4CAD1"/>
    <stop offset=".55" stop-color="#EEF1F3"/><stop offset="1" stop-color="#A9B0B8"/>
  </linearGradient>
  <linearGradient id="wood" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#E2B57A"/><stop offset="1" stop-color="#B98247"/>
  </linearGradient>
  <linearGradient id="brass" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#FFE08A"/><stop offset=".5" stop-color="#E0A93A"/><stop offset="1" stop-color="#B9802A"/>
  </linearGradient>
  <linearGradient id="glassFill" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#E6F1F7" stop-opacity=".75"/><stop offset=".5" stop-color="#FFFFFF" stop-opacity=".35"/>
    <stop offset="1" stop-color="#D6E6EF" stop-opacity=".8"/>
  </linearGradient>
  <filter id="shadow" x="-40%" y="-40%" width="180%" height="180%">
    <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#5A3B1A" flood-opacity=".16"/>
  </filter>
  <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
    <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#5A3B1A" flood-opacity=".14"/>
  </filter>
</defs>`;

const doc = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${DEFS}${body}</svg>`;

/** Soft studio background with a gentle floor shadow. */
const studio = (w, h, from = '#FFFFFF', to = C.creamAlt) => `
  <linearGradient id="bg${w}${h}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
  </linearGradient>
  <rect width="${w}" height="${h}" fill="url(#bg${w}${h})"/>
  <ellipse cx="${n(w / 2)}" cy="${n(h * 0.86)}" rx="${n(w * 0.42)}" ry="${n(h * 0.06)}" fill="#E9DCC8" opacity=".45"/>`;

/* ------------------------------------------------------------------ */
/*  Product motifs (all sizes in pixels)                               */
/* ------------------------------------------------------------------ */

/** Round plate seen from above: kind = silver | paper | leaf | brass */
function plateTop(cx, cy, r, kind = 'silver') {
  if (kind === 'leaf') {
    const leaves = Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * Math.PI * 2;
      const x = cx + Math.cos(a) * r * 0.74;
      const y = cy + Math.sin(a) * r * 0.74;
      return `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(r * 0.3)}" ry="${n(r * 0.15)}" transform="rotate(${n((a * 180) / Math.PI + 90)} ${n(x)} ${n(y)})" fill="#5E8F33" opacity=".55"/>`;
    }).join('');
    const veins = Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * Math.PI * 2;
      return `<line x1="${n(cx)}" y1="${n(cy)}" x2="${n(cx + Math.cos(a) * r * 0.92)}" y2="${n(cy + Math.sin(a) * r * 0.92)}" stroke="#3F6B22" stroke-opacity=".28" stroke-width="${n(r * 0.012)}"/>`;
    }).join('');
    return `<g filter="url(#shadow)"><circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="url(#leaf)"/></g>${leaves}${veins}
      <circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r * 0.5)}" fill="#7FAE47" opacity=".55"/>`;
  }
  if (kind === 'paper') {
    return `<g filter="url(#shadow)"><circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="url(#paper)"/></g>
      <circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r * 0.88)}" fill="none" stroke="#E4DBCD" stroke-width="${n(r * 0.16)}" stroke-dasharray="${n(r * 0.035)} ${n(r * 0.035)}"/>
      <circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r * 0.7)}" fill="#FCFAF6" stroke="#EAE2D6" stroke-width="${n(r * 0.02)}"/>`;
  }
  if (kind === 'brass') {
    return `<g filter="url(#shadow)"><circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="url(#brass)"/></g>
      <circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r * 0.82)}" fill="none" stroke="#FFF1C2" stroke-opacity=".6" stroke-width="${n(r * 0.03)}"/>`;
  }
  return `<g filter="url(#shadow)"><circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="url(#silver)"/></g>
    <circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r * 0.74)}" fill="url(#silverDish)"/>
    <circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r * 0.74)}" fill="none" stroke="#FFFFFF" stroke-opacity=".75" stroke-width="${n(r * 0.025)}"/>
    <path d="M ${n(cx - r * 0.62)} ${n(cy - r * 0.42)} A ${n(r * 0.75)} ${n(r * 0.75)} 0 0 1 ${n(cx + r * 0.1)} ${n(cy - r * 0.74)}" fill="none" stroke="#FFFFFF" stroke-opacity=".9" stroke-width="${n(r * 0.05)}" stroke-linecap="round"/>`;
}

/** Stack of plates seen from the side (perspective discs). */
function plateStack(cx, baseY, rx, count, kind = 'silver') {
  const ry = rx * 0.26;
  const gap = rx * 0.055;
  const edge = { silver: '#AEB5BD', paper: '#DDD4C6', leaf: '#4F7E2A' }[kind];
  const top = { silver: 'url(#silver)', paper: 'url(#paper)', leaf: 'url(#leaf)' }[kind];
  const dish = { silver: 'url(#silverDish)', paper: '#FBF8F3', leaf: '#7FAE47' }[kind];
  let s = `<ellipse cx="${n(cx)}" cy="${n(baseY + ry * 0.35)}" rx="${n(rx * 1.05)}" ry="${n(ry * 0.9)}" fill="#5A3B1A" opacity=".10"/>`;
  for (let i = 0; i < count; i++) {
    const y = baseY - i * gap;
    s += `<ellipse cx="${n(cx)}" cy="${n(y)}" rx="${n(rx)}" ry="${n(ry)}" fill="${edge}"/>`;
    s += `<ellipse cx="${n(cx)}" cy="${n(y - gap * 0.45)}" rx="${n(rx)}" ry="${n(ry)}" fill="${top}"/>`;
  }
  const ty = baseY - (count - 1) * gap - gap * 0.45;
  s += `<ellipse cx="${n(cx)}" cy="${n(ty)}" rx="${n(rx * 0.72)}" ry="${n(ry * 0.68)}" fill="${dish}" opacity=".95"/>`;
  return s;
}

/** Dona (deep bowl) seen from above. */
function donaTop(cx, cy, r, kind = 'silver') {
  const rim = { silver: 'url(#silver)', leaf: 'url(#leaf)', paper: 'url(#paper)' }[kind];
  const deep = { silver: 'url(#silverDeep)', leaf: 'url(#leafDeep)', paper: 'url(#paperDeep)' }[kind];
  const pleats = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return `<line x1="${n(cx + Math.cos(a) * r * 0.5)}" y1="${n(cy + Math.sin(a) * r * 0.5)}" x2="${n(cx + Math.cos(a) * r * 0.95)}" y2="${n(cy + Math.sin(a) * r * 0.95)}" stroke="#000" stroke-opacity=".07" stroke-width="${n(r * 0.03)}"/>`;
  }).join('');
  return `<g filter="url(#shadow)"><circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="${rim}"/></g>
    ${pleats}<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r * 0.62)}" fill="${deep}"/>`;
}

/** Dona stack seen from the side. */
function donaStack(cx, baseY, w, count, kind = 'silver') {
  const h = w * 0.34;
  const fill = { silver: 'url(#silver)', leaf: 'url(#leaf)', paper: 'url(#paper)' }[kind];
  const edge = { silver: '#A3AAB3', leaf: '#4A7526', paper: '#D8CFC0' }[kind];
  let s = `<ellipse cx="${n(cx)}" cy="${n(baseY + 4)}" rx="${n(w * 0.42)}" ry="${n(w * 0.08)}" fill="#5A3B1A" opacity=".1"/>`;
  s += `<path d="M ${n(cx - w / 2)} ${n(baseY - h)} L ${n(cx + w / 2)} ${n(baseY - h)} L ${n(cx + w * 0.32)} ${n(baseY)} L ${n(cx - w * 0.32)} ${n(baseY)} Z" fill="${fill}"/>`;
  for (let i = 0; i < count; i++) {
    const y = baseY - h - i * (w * 0.05);
    s += `<ellipse cx="${n(cx)}" cy="${n(y)}" rx="${n(w / 2)}" ry="${n(w * 0.12)}" fill="${edge}"/>`;
    s += `<ellipse cx="${n(cx)}" cy="${n(y - w * 0.02)}" rx="${n(w / 2)}" ry="${n(w * 0.12)}" fill="${fill}"/>`;
  }
  const ty = baseY - h - (count - 1) * (w * 0.05) - w * 0.02;
  s += `<ellipse cx="${n(cx)}" cy="${n(ty)}" rx="${n(w * 0.36)}" ry="${n(w * 0.08)}" fill="#000" opacity=".12"/>`;
  return s;
}

/** Compartment thali (bhojan thal) seen from above. */
function thaliTop(cx, cy, w, h, rot = 0, tone = 'white', comps = 5) {
  const base = tone === 'grey' ? '#E6E8EB' : '#FFFFFF';
  const well = tone === 'grey' ? '#D7DADF' : '#F3EFE9';
  const x = cx - w / 2;
  const y = cy - h / 2;
  const pad = w * 0.05;
  const top = comps - 1;
  const topH = h * 0.34;
  const cw = (w - pad * (top + 1)) / top;
  let wells = '';
  for (let i = 0; i < top; i++) {
    wells += `<rect x="${n(x + pad + i * (cw + pad))}" y="${n(y + pad)}" width="${n(cw)}" height="${n(topH)}" rx="${n(cw * 0.22)}" fill="${well}" stroke="#000" stroke-opacity=".05"/>`;
  }
  wells += `<rect x="${n(x + pad)}" y="${n(y + pad * 2 + topH)}" width="${n(w - pad * 2)}" height="${n(h - topH - pad * 3)}" rx="${n(h * 0.1)}" fill="${well}" stroke="#000" stroke-opacity=".05"/>`;
  return `<g transform="rotate(${rot} ${n(cx)} ${n(cy)})">
    <g filter="url(#shadow)"><rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${n(h * 0.14)}" fill="${base}"/></g>
    <rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${n(h * 0.14)}" fill="none" stroke="#E2DBD0"/>
    ${wells}</g>`;
}

/** Paper cup / tea cup (side view). pattern = stripes | dots | plain */
function cup(cx, baseY, h, color = C.red, pattern = 'stripes') {
  const tw = h * 0.78;
  const bw = h * 0.56;
  const body = `M ${n(cx - tw / 2)} ${n(baseY - h)} L ${n(cx + tw / 2)} ${n(baseY - h)} L ${n(cx + bw / 2)} ${n(baseY)} L ${n(cx - bw / 2)} ${n(baseY)} Z`;
  const id = `clip${Math.round(cx)}${Math.round(baseY)}${Math.round(h)}`;
  let deco = '';
  if (pattern === 'stripes') {
    for (let i = -4; i < 8; i++) {
      deco += `<rect x="${n(cx - tw / 2 + i * h * 0.18)}" y="${n(baseY - h)}" width="${n(h * 0.07)}" height="${n(h * 1.2)}" fill="${color}" transform="rotate(18 ${n(cx)} ${n(baseY - h / 2)})"/>`;
    }
  } else if (pattern === 'dots') {
    for (let r = 0; r < 5; r++)
      for (let c = -3; c < 4; c++)
        deco += `<circle cx="${n(cx + c * h * 0.16 + (r % 2) * h * 0.08)}" cy="${n(baseY - h * 0.85 + r * h * 0.18)}" r="${n(h * 0.035)}" fill="${color}"/>`;
  } else {
    deco = `<rect x="${n(cx - tw / 2)}" y="${n(baseY - h * 0.62)}" width="${n(tw)}" height="${n(h * 0.26)}" fill="${color}"/>`;
  }
  return `<clipPath id="${id}"><path d="${body}"/></clipPath>
    <ellipse cx="${n(cx)}" cy="${n(baseY + 2)}" rx="${n(bw * 0.7)}" ry="${n(h * 0.06)}" fill="#5A3B1A" opacity=".12"/>
    <path d="${body}" fill="#FFFFFF"/><g clip-path="url(#${id})">${deco}
      <rect x="${n(cx + tw * 0.18)}" y="${n(baseY - h)}" width="${n(tw * 0.32)}" height="${n(h)}" fill="#000" opacity=".06"/></g>
    <ellipse cx="${n(cx)}" cy="${n(baseY - h)}" rx="${n(tw / 2)}" ry="${n(h * 0.07)}" fill="#F4EFE8" stroke="#E0D7CA" stroke-width="${n(h * 0.02)}"/>`;
}

/** Clear plastic glass (side view). */
function glass(cx, baseY, h) {
  const tw = h * 0.72;
  const bw = h * 0.5;
  return `<ellipse cx="${n(cx)}" cy="${n(baseY + 2)}" rx="${n(bw * 0.7)}" ry="${n(h * 0.05)}" fill="#5A3B1A" opacity=".08"/>
    <path d="M ${n(cx - tw / 2)} ${n(baseY - h)} L ${n(cx + tw / 2)} ${n(baseY - h)} L ${n(cx + bw / 2)} ${n(baseY)} L ${n(cx - bw / 2)} ${n(baseY)} Z" fill="url(#glassFill)" stroke="#AFC3CF" stroke-opacity=".8" stroke-width="${n(h * 0.012)}"/>
    <line x1="${n(cx - tw * 0.32)}" y1="${n(baseY - h * 0.9)}" x2="${n(cx - bw * 0.3)}" y2="${n(baseY - h * 0.12)}" stroke="#FFFFFF" stroke-width="${n(h * 0.03)}" stroke-linecap="round" opacity=".9"/>
    <ellipse cx="${n(cx)}" cy="${n(baseY - h)}" rx="${n(tw / 2)}" ry="${n(h * 0.06)}" fill="#FFFFFF" fill-opacity=".5" stroke="#AFC3CF" stroke-width="${n(h * 0.012)}"/>`;
}

/** Aluminium foil roll lying horizontally. */
function foilRoll(cx, cy, len, r) {
  return `<g filter="url(#shadow)"><rect x="${n(cx - len / 2)}" y="${n(cy - r)}" width="${n(len)}" height="${n(r * 2)}" fill="url(#foil)"/>
    <ellipse cx="${n(cx + len / 2)}" cy="${n(cy)}" rx="${n(r * 0.35)}" ry="${n(r)}" fill="#E2E6EA"/></g>
    <ellipse cx="${n(cx + len / 2)}" cy="${n(cy)}" rx="${n(r * 0.14)}" ry="${n(r * 0.4)}" fill="#C79A5B"/>
    <ellipse cx="${n(cx - len / 2)}" cy="${n(cy)}" rx="${n(r * 0.35)}" ry="${n(r)}" fill="#C4CAD1"/>
    <path d="M ${n(cx - len * 0.45)} ${n(cy + r)} L ${n(cx - len * 0.5)} ${n(cy + r * 1.9)} L ${n(cx + len * 0.4)} ${n(cy + r * 1.9)} L ${n(cx + len * 0.45)} ${n(cy + r)} Z" fill="url(#silver)" opacity=".9"/>`;
}

/** Foil container seen from above, optionally with its lid leaning on it. */
function foilContainer(cx, cy, w, h, withLid = false) {
  const x = cx - w / 2;
  const y = cy - h / 2;
  let lines = '';
  for (let i = 1; i < 7; i++) {
    lines += `<line x1="${n(x + w * 0.12)}" y1="${n(y + (h * i) / 7)}" x2="${n(x + w * 0.88)}" y2="${n(y + (h * i) / 7)}" stroke="#FFFFFF" stroke-opacity=".5" stroke-width="${n(h * 0.01)}"/>`;
  }
  const lid = withLid
    ? `<g transform="rotate(-12 ${n(cx + w * 0.35)} ${n(cy - h * 0.35)})" filter="url(#softShadow)">
        <rect x="${n(x + w * 0.25)}" y="${n(y - h * 0.45)}" width="${n(w * 0.95)}" height="${n(h * 0.85)}" rx="${n(h * 0.08)}" fill="#FAFAFA" stroke="#D9D9D9"/>
        <rect x="${n(x + w * 0.31)}" y="${n(y - h * 0.38)}" width="${n(w * 0.83)}" height="${n(h * 0.71)}" rx="${n(h * 0.05)}" fill="none" stroke="#C9CDD2" stroke-dasharray="4 3"/></g>`
    : '';
  return `<g filter="url(#shadow)"><rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${n(h * 0.12)}" fill="url(#silver)"/></g>
    <rect x="${n(x + w * 0.08)}" y="${n(y + h * 0.1)}" width="${n(w * 0.84)}" height="${n(h * 0.8)}" rx="${n(h * 0.08)}" fill="url(#silverDish)"/>${lines}${lid}`;
}

/** Bowl / katori seen from the side. */
function bowl(cx, baseY, w, color = '#FFFFFF', inner = '#EDE6DA') {
  const h = w * 0.42;
  return `<ellipse cx="${n(cx)}" cy="${n(baseY + 3)}" rx="${n(w * 0.38)}" ry="${n(w * 0.06)}" fill="#5A3B1A" opacity=".12"/>
    <path d="M ${n(cx - w / 2)} ${n(baseY - h)} Q ${n(cx - w * 0.46)} ${n(baseY)} ${n(cx - w * 0.18)} ${n(baseY)} L ${n(cx + w * 0.18)} ${n(baseY)} Q ${n(cx + w * 0.46)} ${n(baseY)} ${n(cx + w / 2)} ${n(baseY - h)} Z" fill="${color}" stroke="#E2DACD" stroke-width="1.5"/>
    <path d="M ${n(cx + w * 0.2)} ${n(baseY - h * 0.9)} Q ${n(cx + w * 0.4)} ${n(baseY - h * 0.3)} ${n(cx + w * 0.16)} ${n(baseY - 2)}" fill="none" stroke="#000" stroke-opacity=".06" stroke-width="${n(w * 0.08)}"/>
    <ellipse cx="${n(cx)}" cy="${n(baseY - h)}" rx="${n(w / 2)}" ry="${n(w * 0.11)}" fill="${inner}" stroke="#E2DACD" stroke-width="1.5"/>`;
}

/** Spoon. kind = plastic | wood | steel */
function spoon(cx, cy, len, angle, kind = 'plastic') {
  const fill = { plastic: '#FFFFFF', wood: 'url(#wood)', steel: 'url(#silver)' }[kind];
  return `<g transform="rotate(${angle} ${n(cx)} ${n(cy)})" filter="url(#softShadow)">
    <rect x="${n(cx - len * 0.03)}" y="${n(cy - len * 0.25)}" width="${n(len * 0.06)}" height="${n(len * 0.72)}" rx="${n(len * 0.03)}" fill="${fill}" stroke="#E2DACD" stroke-width="1"/>
    <ellipse cx="${n(cx)}" cy="${n(cy - len * 0.36)}" rx="${n(len * 0.12)}" ry="${n(len * 0.16)}" fill="${fill}" stroke="#E2DACD" stroke-width="1"/>
    <ellipse cx="${n(cx)}" cy="${n(cy - len * 0.36)}" rx="${n(len * 0.08)}" ry="${n(len * 0.11)}" fill="#000" opacity=".05"/></g>`;
}

/** Marigold garland hanging in a curve. */
function garland(x1, x2, y, sag, r) {
  let s = '';
  const steps = Math.round((x2 - x1) / (r * 1.5));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = x1 + (x2 - x1) * t;
    const yy = y + Math.sin(t * Math.PI) * sag;
    s += `<circle cx="${n(x)}" cy="${n(yy)}" r="${n(r)}" fill="${i % 3 === 0 ? C.marigoldDeep : C.marigold}"/>`;
  }
  return s;
}

function diya(cx, cy, w) {
  return `<path d="M ${n(cx - w / 2)} ${n(cy)} Q ${n(cx)} ${n(cy + w * 0.6)} ${n(cx + w / 2)} ${n(cy)} Z" fill="#C0622B"/>
    <path d="M ${n(cx)} ${n(cy - w * 0.55)} Q ${n(cx + w * 0.14)} ${n(cy - w * 0.15)} ${n(cx)} ${n(cy)} Q ${n(cx - w * 0.14)} ${n(cy - w * 0.15)} ${n(cx)} ${n(cy - w * 0.55)} Z" fill="${C.marigold}"/>
    <circle cx="${n(cx)}" cy="${n(cy - w * 0.25)}" r="${n(w * 0.5)}" fill="${C.marigold}" opacity=".15"/>`;
}

function balloon(cx, cy, r, color) {
  return `<path d="M ${n(cx)} ${n(cy + r * 1.2)} q ${n(r * 0.3)} ${n(r)} ${n(-r * 0.1)} ${n(r * 2.2)}" stroke="#9A8A78" fill="none" stroke-width="1.5"/>
    <ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(r)}" ry="${n(r * 1.2)}" fill="${color}"/>
    <ellipse cx="${n(cx - r * 0.35)}" cy="${n(cy - r * 0.45)}" rx="${n(r * 0.18)}" ry="${n(r * 0.3)}" fill="#FFFFFF" opacity=".45"/>`;
}

/* ------------------------------------------------------------------ */
/*  Scenes                                                             */
/* ------------------------------------------------------------------ */

/** Category / product scenes. `v` (0..n) adds variation between products of one category. */
const categoryScenes = {
  dona: (w, h, v = 0) => {
    const s = Math.min(w, h);
    const kinds = [['silver', 'leaf'], ['leaf', 'paper'], ['paper', 'silver']][v % 3];
    return studio(w, h) +
      donaStack(w * 0.34, h * 0.56, s * 0.36, 7, kinds[0]) +
      donaTop(w * 0.64, h * 0.6, s * 0.2, kinds[1]) +
      donaTop(w * 0.42, h * 0.74, s * 0.15, kinds[0]);
  },
  pattal: (w, h, v = 0) => {
    const s = Math.min(w, h);
    const kinds = [['silver', 'leaf'], ['leaf', 'paper'], ['paper', 'silver']][v % 3];
    return studio(w, h) +
      plateStack(w * 0.36, h * 0.6, s * 0.26, 12, kinds[0]) +
      plateStack(w * 0.68, h * 0.72, s * 0.22, 8, kinds[1]) +
      plateTop(w * 0.3, h * 0.8, s * 0.12, kinds[1]);
  },
  thali: (w, h, v = 0) => {
    const s = Math.min(w, h);
    const comps = [5, 4, 6][v % 3];
    return studio(w, h) +
      thaliTop(w * 0.56, h * 0.42, s * 0.62, s * 0.44, 7, 'white', comps) +
      thaliTop(w * 0.46, h * 0.6, s * 0.66, s * 0.47, -6, v % 2 ? 'white' : 'grey', comps);
  },
  glasses: (w, h, v = 0) => {
    const s = Math.min(w, h);
    const colors = [[C.red, C.marigold, C.green], [C.marigold, '#1E88E5', C.red], [C.green, C.red, '#8E24AA']][v % 3];
    return studio(w, h) +
      glass(w * 0.22, h * 0.7, s * 0.34) +
      cup(w * 0.4, h * 0.74, s * 0.3, colors[0], 'stripes') +
      cup(w * 0.6, h * 0.72, s * 0.32, colors[1], 'dots') +
      cup(w * 0.78, h * 0.76, s * 0.26, colors[2], 'plain') +
      glass(w * 0.5, h * 0.86, s * 0.22);
  },
  foil: (w, h, v = 0) => {
    const s = Math.min(w, h);
    return studio(w, h) +
      foilRoll(w * 0.42, h * 0.34, s * 0.52, s * 0.08) +
      foilContainer(w * 0.36, h * 0.68, s * 0.34, s * 0.24, v % 2 === 0) +
      foilContainer(w * 0.7, h * 0.66, s * 0.26, s * 0.2, v % 2 === 1);
  },
  bowls: (w, h, v = 0) => {
    const s = Math.min(w, h);
    const tint = ['#FFFFFF', '#FFF7E8', '#F5F5F5'][v % 3];
    return studio(w, h) +
      bowl(w * 0.34, h * 0.56, s * 0.34, tint) +
      bowl(w * 0.66, h * 0.6, s * 0.3, tint) +
      bowl(w * 0.5, h * 0.8, s * 0.36, tint) +
      bowl(w * 0.2, h * 0.82, s * 0.18, '#FFFFFF');
  },
  spoons: (w, h, v = 0) => {
    const s = Math.min(w, h);
    const order = [['plastic', 'wood'], ['wood', 'plastic'], ['plastic', 'steel']][v % 3];
    let out = studio(w, h);
    [-40, -24, -8, 8, 24, 40].forEach((a, i) => {
      out += spoon(w * 0.5, h * 0.68, s * 0.62, a, order[i % 2]);
    });
    return out;
  },
  combo: (w, h, v = 0) => {
    const s = Math.min(w, h);
    const plate = ['silver', 'leaf', 'paper'][v % 3];
    return studio(w, h) +
      plateTop(w * 0.42, h * 0.52, s * 0.3, plate) +
      donaTop(w * 0.5, h * 0.44, s * 0.11, plate === 'leaf' ? 'leaf' : 'silver') +
      spoon(w * 0.3, h * 0.6, s * 0.3, -30, 'plastic') +
      cup(w * 0.8, h * 0.6, s * 0.24, C.red, 'stripes') +
      glass(w * 0.76, h * 0.84, s * 0.2);
  },
};

const occasionScenes = {
  wedding: (w, h) => {
    const s = Math.min(w, h);
    return `<rect width="${w}" height="${h}" fill="${C.redDark}"/>
      <circle cx="${n(w * 0.5)}" cy="${n(h * 0.6)}" r="${n(s * 0.55)}" fill="${C.red}" opacity=".55"/>
      ${garland(0, w * 0.5, h * 0.02, h * 0.18, s * 0.022)}${garland(w * 0.5, w, h * 0.02, h * 0.18, s * 0.022)}
      ${thaliTop(w * 0.44, h * 0.66, s * 0.5, s * 0.36, -5)}
      ${glass(w * 0.78, h * 0.82, s * 0.26)}${cup(w * 0.88, h * 0.76, s * 0.2, C.marigold, 'dots')}`;
  },
  namkaran: (w, h) => {
    const s = Math.min(w, h);
    let rangoli = '';
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      rangoli += `<circle cx="${n(w * 0.5 + Math.cos(a) * s * 0.34)}" cy="${n(h * 0.55 + Math.sin(a) * s * 0.34)}" r="${n(s * 0.05)}" fill="${i % 2 ? '#F48FB1' : C.marigold}" opacity=".6"/>`;
    }
    let sweets = '';
    [[-0.06, -0.03], [0.05, -0.04], [0, 0.04], [-0.07, 0.06], [0.07, 0.05]].forEach(([dx, dy]) => {
      sweets += `<circle cx="${n(w * 0.5 + dx * s)}" cy="${n(h * 0.55 + dy * s)}" r="${n(s * 0.035)}" fill="${C.marigoldDeep}"/>`;
    });
    return `<rect width="${w}" height="${h}" fill="#FDE9EF"/>${rangoli}
      ${plateTop(w * 0.5, h * 0.55, s * 0.24, 'silver')}${sweets}
      ${donaTop(w * 0.2, h * 0.75, s * 0.1, 'leaf')}${donaTop(w * 0.8, h * 0.3, s * 0.09, 'silver')}`;
  },
  bhandara: (w, h) => {
    const s = Math.min(w, h);
    let out = `<rect width="${w}" height="${h}" fill="#F6C66B"/><rect y="${n(h * 0.35)}" width="${w}" height="${n(h * 0.65)}" fill="#C9A26A"/>`;
    [0.48, 0.82].forEach((row, ri) => {
      for (let i = 0; i < 4; i++) {
        const cx = w * (0.14 + i * 0.24) + (ri ? w * 0.06 : 0);
        out += plateTop(cx, h * row, s * (ri ? 0.15 : 0.12), 'leaf');
        out += donaTop(cx + s * 0.08, h * row - s * 0.05, s * (ri ? 0.05 : 0.04), 'leaf');
      }
    });
    return out + garland(0, w, h * 0.02, h * 0.1, s * 0.02);
  },
  birthday: (w, h) => {
    const s = Math.min(w, h);
    return `<rect width="${w}" height="${h}" fill="#E3F2FD"/>
      ${balloon(w * 0.14, h * 0.2, s * 0.07, '#EF5350')}${balloon(w * 0.26, h * 0.14, s * 0.06, C.marigold)}${balloon(w * 0.86, h * 0.18, s * 0.07, '#42A5F5')}
      ${plateTop(w * 0.42, h * 0.62, s * 0.22, 'paper')}
      <path d="M ${n(w * 0.38)} ${n(h * 0.58)} L ${n(w * 0.5)} ${n(h * 0.54)} L ${n(w * 0.47)} ${n(h * 0.68)} Z" fill="#F8BBD0"/>
      ${cup(w * 0.7, h * 0.78, s * 0.24, '#EF5350', 'dots')}${cup(w * 0.84, h * 0.82, s * 0.2, '#42A5F5', 'stripes')}`;
  },
  puja: (w, h) => {
    const s = Math.min(w, h);
    let petals = '';
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      petals += `<circle cx="${n(w * 0.5 + Math.cos(a) * s * 0.33)}" cy="${n(h * 0.55 + Math.sin(a) * s * 0.33)}" r="${n(s * 0.03)}" fill="${i % 2 ? C.marigoldDeep : C.marigold}"/>`;
    }
    // Puja thali: diya at the centre, roli/rice/flower bowls placed around it.
    const bowls = [
      [0.13, -0.11, '#D32F2F'],
      [0.15, 0.1, '#FFF8E1'],
      [-0.15, 0.1, C.marigoldDeep],
    ]
      .map(
        ([dx, dy, fill]) =>
          `<circle cx="${n(w * 0.5 + dx * s)}" cy="${n(h * 0.55 + dy * s)}" r="${n(s * 0.055)}" fill="url(#brass)" stroke="#B9802A"/>
           <circle cx="${n(w * 0.5 + dx * s)}" cy="${n(h * 0.55 + dy * s)}" r="${n(s * 0.038)}" fill="${fill}"/>`,
      )
      .join('');
    return `<rect width="${w}" height="${h}" fill="#FFE7C2"/>${plateTop(w * 0.5, h * 0.55, s * 0.3, 'brass')}${petals}
      ${bowls}${diya(w * 0.46, h * 0.53, s * 0.13)}${donaTop(w * 0.14, h * 0.8, s * 0.08, 'leaf')}`;
  },
  catering: (w, h) => {
    const s = Math.min(w, h);
    return `<rect width="${w}" height="${h}" fill="#FFF4E6"/><rect y="${n(h * 0.62)}" width="${w}" height="${n(h * 0.38)}" fill="#EBDDC9"/>
      ${plateStack(w * 0.2, h * 0.72, s * 0.16, 14, 'silver')}${plateStack(w * 0.44, h * 0.74, s * 0.15, 10, 'paper')}
      ${glass(w * 0.62, h * 0.74, s * 0.2)}${glass(w * 0.7, h * 0.74, s * 0.2)}${glass(w * 0.78, h * 0.74, s * 0.2)}
      ${bowl(w * 0.86, h * 0.9, s * 0.18)}${spoon(w * 0.3, h * 0.92, s * 0.2, 80, 'steel')}`;
  },
};

const heroScenes = {
  'hero-1': (w, h) =>
    `<rect width="${w}" height="${h}" fill="${C.creamAlt}"/><rect y="${n(h * 0.58)}" width="${w}" height="${n(h * 0.42)}" fill="#F3E3CC"/>
     ${plateTop(w * 0.7, h * 0.58, h * 0.26, 'silver')}${donaTop(w * 0.7, h * 0.56, h * 0.09, 'silver')}
     ${plateTop(w * 0.52, h * 0.86, h * 0.14, 'paper')}${donaTop(w * 0.88, h * 0.34, h * 0.1, 'leaf')}
     ${spoon(w * 0.86, h * 0.72, h * 0.3, 20, 'plastic')}${cup(w * 0.94, h * 0.9, h * 0.2, C.red, 'stripes')}`,
  'hero-2': (w, h) => {
    let leaves = '';
    [[0.55, 0.2, 30], [0.95, 0.15, -20], [0.6, 0.92, 60], [0.98, 0.7, 10]].forEach(([x, y, a]) => {
      leaves += `<ellipse cx="${n(w * x)}" cy="${n(h * y)}" rx="${n(h * 0.12)}" ry="${n(h * 0.05)}" transform="rotate(${a} ${n(w * x)} ${n(h * y)})" fill="#6A9A38" opacity=".7"/>`;
    });
    return `<rect width="${w}" height="${h}" fill="#F1F5E6"/><rect y="${n(h * 0.6)}" width="${w}" height="${n(h * 0.4)}" fill="#E3EACF"/>${leaves}
      ${plateStack(w * 0.66, h * 0.72, h * 0.24, 14, 'leaf')}${donaStack(w * 0.86, h * 0.8, h * 0.26, 8, 'leaf')}
      ${plateTop(w * 0.8, h * 0.4, h * 0.14, 'leaf')}`;
  },
  'hero-3': (w, h) =>
    `<rect width="${w}" height="${h}" fill="#FBEFE2"/><rect y="${n(h * 0.5)}" width="${w}" height="${n(h * 0.5)}" fill="#F1DFC6"/>
     ${garland(w * 0.4, w * 0.7, 0, h * 0.12, h * 0.02)}${garland(w * 0.7, w, 0, h * 0.12, h * 0.02)}
     ${glass(w * 0.58, h * 0.46, h * 0.16)}${glass(w * 0.64, h * 0.46, h * 0.16)}${glass(w * 0.7, h * 0.46, h * 0.16)}
     ${glass(w * 0.76, h * 0.46, h * 0.16)}${glass(w * 0.82, h * 0.46, h * 0.16)}
     ${thaliTop(w * 0.62, h * 0.72, h * 0.42, h * 0.3, -6)}${thaliTop(w * 0.86, h * 0.7, h * 0.42, h * 0.3, 8, 'grey')}`,
};

/** Shop / about scenes. */
function shelves(w, h, top) {
  let out = '';
  const rows = 3;
  const rowH = (h - top) / rows;
  for (let r = 0; r < rows; r++) {
    const y = top + rowH * (r + 1) - h * 0.02;
    out += `<rect x="${n(w * 0.04)}" y="${n(y)}" width="${n(w * 0.92)}" height="${n(h * 0.02)}" fill="#A9774A"/>`;
    for (let i = 0; i < 6; i++) {
      const cx = w * (0.11 + i * 0.155);
      const k = (r + i) % 4;
      if (k === 0) out += plateStack(cx, y - 4, rowH * 0.32, 10, 'silver');
      if (k === 1) out += plateStack(cx, y - 4, rowH * 0.3, 9, 'leaf');
      if (k === 2) out += cup(cx - rowH * 0.12, y, rowH * 0.42, C.red, 'stripes') + cup(cx + rowH * 0.14, y, rowH * 0.42, C.marigold, 'dots');
      if (k === 3) out += foilRoll(cx, y - rowH * 0.18, rowH * 0.5, rowH * 0.1);
    }
  }
  return out;
}

const aboutScenes = {
  'shop-front': (w, h) => {
    let awning = '';
    for (let i = 0; i < 16; i++) awning += `<rect x="${n((w / 16) * i)}" y="${n(h * 0.14)}" width="${n(w / 16)}" height="${n(h * 0.1)}" fill="${i % 2 ? '#FFFFFF' : C.red}"/>`;
    return `<rect width="${w}" height="${h}" fill="#F3E6D3"/>
      <rect y="0" width="${w}" height="${n(h * 0.14)}" fill="${C.red}"/>
      <text x="${n(w / 2)}" y="${n(h * 0.095)}" font-family="${HINDI_FONT}" font-size="${n(h * 0.06)}" font-weight="700" fill="#FFFFFF" text-anchor="middle">श्री बालाजी दोना पत्तल स्टोर</text>
      ${awning}<rect y="${n(h * 0.24)}" width="${w}" height="${n(h * 0.76)}" fill="#FBF3E8"/>
      ${shelves(w, h * 0.82, h * 0.26)}
      <rect x="0" y="${n(h * 0.82)}" width="${w}" height="${n(h * 0.18)}" fill="#B98247"/>
      <rect x="0" y="${n(h * 0.82)}" width="${w}" height="${n(h * 0.02)}" fill="#8E5F31"/>`;
  },
  team: (w, h) => {
    const person = (cx, color) =>
      `<circle cx="${n(cx)}" cy="${n(h * 0.42)}" r="${n(h * 0.08)}" fill="#C68C5A"/>
       <path d="M ${n(cx - h * 0.15)} ${n(h * 0.78)} Q ${n(cx - h * 0.15)} ${n(h * 0.52)} ${n(cx)} ${n(h * 0.52)} Q ${n(cx + h * 0.15)} ${n(h * 0.52)} ${n(cx + h * 0.15)} ${n(h * 0.78)} Z" fill="${color}"/>`;
    return `<rect width="${w}" height="${h}" fill="#FBF3E8"/>${shelves(w, h * 0.62, h * 0.02)}
      ${person(w * 0.5, '#FFFFFF')}
      <rect x="0" y="${n(h * 0.74)}" width="${w}" height="${n(h * 0.26)}" fill="#B98247"/>
      ${plateStack(w * 0.2, h * 0.76, h * 0.12, 10, 'silver')}${plateStack(w * 0.82, h * 0.76, h * 0.12, 8, 'leaf')}`;
  },
  stock: (w, h) => `<rect width="${w}" height="${h}" fill="#FBF3E8"/>${shelves(w, h, h * 0.02)}`,
};

/** Owner portrait placeholder (replace public/images/about/owner.webp with a real photo). */
function ownerPortrait(w, h) {
  const cx = w / 2;
  return `<rect width="${w}" height="${h}" fill="#FBF3E8"/>${shelves(w, h * 0.7, h * 0.02)}
    <rect y="${n(h * 0.62)}" width="${w}" height="${n(h * 0.38)}" fill="#F3E3CC"/>
    <rect x="${n(cx - w * 0.07)}" y="${n(h * 0.5)}" width="${n(w * 0.14)}" height="${n(h * 0.15)}" rx="${n(w * 0.03)}" fill="#B97C4C"/>
    <circle cx="${n(cx)}" cy="${n(h * 0.42)}" r="${n(w * 0.17)}" fill="#C68C5A"/>
    <path d="M ${n(cx - w * 0.17)} ${n(h * 0.36)} Q ${n(cx)} ${n(h * 0.22)} ${n(cx + w * 0.17)} ${n(h * 0.36)} Q ${n(cx + w * 0.12)} ${n(h * 0.28)} ${n(cx)} ${n(h * 0.28)} Q ${n(cx - w * 0.12)} ${n(h * 0.28)} ${n(cx - w * 0.17)} ${n(h * 0.36)} Z" fill="#3B2A20"/>
    <path d="M ${n(cx - w * 0.36)} ${h} Q ${n(cx - w * 0.36)} ${n(h * 0.62)} ${n(cx)} ${n(h * 0.62)} Q ${n(cx + w * 0.36)} ${n(h * 0.62)} ${n(cx + w * 0.36)} ${h} Z" fill="#FFFFFF"/>
    <path d="M ${n(cx - w * 0.06)} ${n(h * 0.62)} L ${n(cx)} ${n(h * 0.72)} L ${n(cx + w * 0.06)} ${n(h * 0.62)} Z" fill="${C.marigold}"/>
    <rect x="${n(w * 0.08)}" y="${n(h * 0.05)}" width="${n(w * 0.84)}" height="${n(h * 0.08)}" rx="${n(h * 0.04)}" fill="#FFFFFF" opacity=".85"/>
    <text x="${n(cx)}" y="${n(h * 0.1)}" font-family="${LATIN_FONT}" font-size="${n(w * 0.04)}" fill="#8A7D6E" text-anchor="middle">Owner photo — replace owner.webp</text>`;
}

const bannerScenes = {
  'page-header': (w, h) => {
    let out = `<rect width="${w}" height="${h}" fill="${C.creamAlt}"/>`;
    const spots = [[0.06, 0.3, 'silver'], [0.2, 0.85, 'leaf'], [0.82, 0.2, 'paper'], [0.93, 0.78, 'silver'], [0.7, 1.0, 'leaf'], [0.36, 0.05, 'paper']];
    spots.forEach(([x, y, k]) => {
      out += `<g opacity=".55">${plateTop(w * x, h * y, h * 0.26, k)}</g>`;
    });
    return out;
  },
  'bulk-order': (w, h) =>
    `<rect width="${w}" height="${h}" fill="${C.redDark}"/><circle cx="${n(w * 0.8)}" cy="${n(h * 0.6)}" r="${n(h * 0.9)}" fill="${C.red}" opacity=".5"/>
     ${plateStack(w * 0.62, h * 0.86, h * 0.2, 16, 'silver')}${plateStack(w * 0.76, h * 0.9, h * 0.2, 12, 'leaf')}
     ${donaStack(w * 0.88, h * 0.88, h * 0.26, 10, 'silver')}${garland(w * 0.5, w, 0, h * 0.14, h * 0.03)}`,
};

/** Gallery: [file, width, height, scene] */
const galleryItems = [
  ['gallery-1', 800, 1000, (w, h) => categoryScenes.pattal(w, h, 0)],
  ['gallery-2', 800, 600, occasionScenes.wedding],
  ['gallery-3', 800, 800, aboutScenes.stock],
  ['gallery-4', 800, 800, (w, h) => categoryScenes.glasses(w, h, 1)],
  ['gallery-5', 800, 1000, occasionScenes.bhandara],
  ['gallery-6', 800, 600, (w, h) => categoryScenes.thali(w, h, 0)],
  ['gallery-7', 800, 600, aboutScenes['shop-front']],
  ['gallery-8', 800, 1000, (w, h) => categoryScenes.combo(w, h, 1)],
  ['gallery-9', 800, 800, occasionScenes.birthday],
  ['gallery-10', 800, 600, (w, h) => categoryScenes.foil(w, h, 0)],
  ['gallery-11', 800, 800, occasionScenes.puja],
  ['gallery-12', 800, 600, (w, h) => categoryScenes.dona(w, h, 2)],
];

/* ------------------------------------------------------------------ */
/*  Logo                                                               */
/* ------------------------------------------------------------------ */
export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Shri Balaji Dona Pattal Store logo">
  <circle cx="32" cy="32" r="31" fill="${C.red}"/>
  ${Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return `<circle cx="${n(32 + Math.cos(a) * 26.5)}" cy="${n(32 + Math.sin(a) * 26.5)}" r="2.3" fill="${C.marigold}"/>`;
  }).join('')}
  <circle cx="32" cy="32" r="21" fill="${C.cream}"/>
  <circle cx="32" cy="32" r="15.5" fill="none" stroke="${C.marigold}" stroke-width="2"/>
  <path d="M32 21c6.5 3.6 8.6 10.6 4.6 16.6-1.5 2.2-3.2 3.6-4.6 4.4-1.4-.8-3.1-2.2-4.6-4.4-4-6-1.9-13 4.6-16.6z" fill="${C.green}"/>
  <path d="M32 24.5v16.5" stroke="${C.cream}" stroke-width="1.3" stroke-linecap="round"/>
  <path d="M32 30.5l3.2-2.6M32 35l-3.2-2.6" stroke="${C.cream}" stroke-width="1.1" stroke-linecap="round"/>
</svg>`;

function ogImage(w, h) {
  const logo = LOGO_SVG.replace('<svg ', `<svg x="80" y="${n(h * 0.2)}" width="150" height="150" `);
  return `<rect width="${w}" height="${h}" fill="${C.cream}"/>
    <rect x="${n(w * 0.62)}" width="${n(w * 0.38)}" height="${h}" fill="${C.creamAlt}"/>
    ${plateTop(w * 0.82, h * 0.42, h * 0.26, 'silver')}${donaTop(w * 0.82, h * 0.4, h * 0.09, 'leaf')}
    ${plateStack(w * 0.74, h * 0.92, h * 0.12, 8, 'leaf')}${cup(w * 0.94, h * 0.9, h * 0.2, C.red, 'stripes')}
    ${logo}
    <text x="80" y="${n(h * 0.62)}" font-family="${LATIN_FONT}" font-size="54" font-weight="700" fill="${C.ink}">Shri Balaji Dona Pattal Store</text>
    <text x="80" y="${n(h * 0.74)}" font-family="${HINDI_FONT}" font-size="40" font-weight="700" fill="${C.red}">श्री बालाजी दोना पत्तल स्टोर</text>
    <text x="80" y="${n(h * 0.84)}" font-family="${LATIN_FONT}" font-size="26" fill="#6B6B6B">Wholesale &amp; Retail Disposable Crockery · Bilsanda, Pilibhit</text>
    <rect x="80" y="${n(h * 0.88)}" width="420" height="44" rx="22" fill="${C.green}"/>
    <text x="290" y="${n(h * 0.88 + 30)}" font-family="${LATIN_FONT}" font-size="22" font-weight="700" fill="#FFFFFF" text-anchor="middle">WhatsApp: +91 84450 09955</text>`;
}

/* ------------------------------------------------------------------ */
/*  Writer                                                             */
/* ------------------------------------------------------------------ */
let created = 0;
let skipped = 0;

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

/** Render an SVG body to a file (webp / png / jpg by extension). Skips existing files unless --force. */
async function render(relPath, w, h, body, { caption } = {}) {
  const file = path.join(OUT, relPath);
  if (!FORCE && (await exists(file))) {
    skipped++;
    return;
  }
  await mkdir(path.dirname(file), { recursive: true });
  const cap = caption
    ? `<text x="${n(w / 2)}" y="${n(h - h * 0.045)}" font-family="${LATIN_FONT}" font-size="${n(Math.min(w, h) * 0.034)}" fill="#8A7D6E" text-anchor="middle">${caption.replace(/&/g, '&amp;')}</text>`
    : '';
  const img = sharp(Buffer.from(doc(w, h, body + cap)));
  const ext = path.extname(file);
  if (ext === '.png') await img.png({ compressionLevel: 9 }).toFile(file);
  else if (ext === '.jpg') await img.jpeg({ quality: 86, mozjpeg: true }).toFile(file);
  else await img.webp({ quality: 80, effort: 5 }).toFile(file);
  created++;
}

async function main() {
  // Hero 1600×900
  for (const [name, scene] of Object.entries(heroScenes)) await render(`hero/${name}.webp`, 1600, 900, scene(1600, 900));

  // Categories 600×600
  for (const [name, scene] of Object.entries(categoryScenes)) await render(`categories/${name}.webp`, 600, 600, scene(600, 600));

  // Occasions 800×600
  for (const [name, scene] of Object.entries(occasionScenes)) await render(`occasions/${name}.webp`, 800, 600, scene(800, 600));

  // Gallery (mixed sizes)
  for (const [name, w, h, scene] of galleryItems) await render(`gallery/${name}.webp`, w, h, scene(w, h));

  // About 1200×800
  for (const [name, scene] of Object.entries(aboutScenes)) await render(`about/${name}.webp`, 1200, 800, scene(1200, 800));
  await render('about/owner.webp', 800, 1000, ownerPortrait(800, 1000));

  // Banners 1600×500
  for (const [name, scene] of Object.entries(bannerScenes)) await render(`banners/${name}.webp`, 1600, 500, scene(1600, 500));

  // Products 800×800 — read from src/data/products.js when it exists.
  const productsFile = path.join(ROOT, 'src', 'data', 'products.js');
  if (await exists(productsFile)) {
    const { default: products } = await import(pathToFileURL(productsFile).href);
    for (const [index, p] of products.entries()) {
      const scene = categoryScenes[p.category] || categoryScenes.combo;
      for (const [i, src] of p.images.entries()) {
        const rel = src.replace(/^\/images\//, '');
        await render(rel, 800, 800, scene(800, 800, index + i), { caption: p.nameEn });
      }
    }
  }

  // Logo, favicon, social share image
  const logoFile = path.join(OUT, 'logo', 'logo.svg');
  if (FORCE || !(await exists(logoFile))) {
    await mkdir(path.dirname(logoFile), { recursive: true });
    await writeFile(logoFile, LOGO_SVG);
    created++;
  } else skipped++;
  // Small favicon for browser tabs + 180px icon for phone home screens.
  for (const [file, size] of [['favicon.png', 64], ['apple-touch-icon.png', 180], ['icon-512.png', 512]]) {
    const target = path.join(OUT, 'logo', file);
    if (FORCE || !(await exists(target))) {
      await sharp(Buffer.from(LOGO_SVG)).resize(size, size).png({ compressionLevel: 9, palette: true }).toFile(target);
      created++;
    } else skipped++;
  }
  await render('logo/og-image.jpg', 1200, 630, ogImage(1200, 630));

  console.log(`Placeholder images: ${created} created, ${skipped} kept (already exist). Use --force to regenerate all.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
