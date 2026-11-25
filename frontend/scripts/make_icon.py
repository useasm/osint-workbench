#!/usr/bin/env python3
"""renders build/icon.png (1024x1024 rgba): dark rounded square, cyan border, ">_" glyph. stdlib only."""
import math
import os
import struct
import zlib

W = H = 1024
CX = CY = 512.0

NAVY = (10, 23, 48)
CYAN = (84, 231, 255)
VIOLET = (157, 123, 255)

# rounded square
BX = BY = 430.0          # half of the side length
RAD = 180.0              # corner radius
BORDER = 16.0            # border thickness

# glyph ">" (chevron) + "_" (underscore)
C1 = (430.0, 388.0)
C2 = (588.0, 512.0)
C3 = (430.0, 636.0)
THICK = 34.0
UX0, UX1, UY0, UY1 = 620.0, 792.0, 596.0, 634.0


def length(x, y):
    return math.hypot(x, y)


def sd_round_box(px, py, bx, by, r):
    qx = abs(px - CX) - bx + r
    qy = abs(py - CY) - by + r
    return length(max(qx, 0.0), max(qy, 0.0)) + min(max(qx, qy), 0.0) - r


def sd_seg(px, py, ax, ay, bx, by):
    pax, pay = px - ax, py - ay
    bax, bay = bx - ax, by - ay
    denom = bax * bax + bay * bay
    h = 0.0 if denom == 0 else max(0.0, min(1.0, (pax * bax + pay * bay) / denom))
    return length(pax - bax * h, pay - bay * h)


def lerp(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


raw = bytearray()
for y in range(H):
    raw.append(0)  # filter type 0
    fy = y + 0.5
    for x in range(W):
        fx = x + 0.5
        d = sd_round_box(fx, fy, BX, BY, RAD)
        if d > 0.8:
            raw += b"\x00\x00\x00\x00"
            continue
        # anti-aliased alpha on the outer edge
        a = 255 if d <= -0.8 else int(round((0.8 - d) / 1.6 * 255))
        # vertical bg gradient, a bit lighter at the top
        r, g, b = lerp((14, 30, 64), NAVY, y / H)
        if d > -BORDER:
            r, g, b = CYAN
        # glyph with a soft cyan→violet vertical shimmer
        ds = min(sd_seg(fx, fy, *C1, *C2), sd_seg(fx, fy, *C2, *C3))
        if ds < THICK:
            r, g, b = lerp(CYAN, VIOLET, (fy - C1[1]) / (C3[1] - C1[1]))
        if UX0 <= fx <= UX1 and UY0 <= fy <= UY1:
            r, g, b = CYAN
        raw += bytes((r, g, b, a))


def chunk(typ, data):
    return (
        struct.pack(">I", len(data))
        + typ
        + data
        + struct.pack(">I", zlib.crc32(typ + data) & 0xFFFFFFFF)
    )


png = (
    b"\x89PNG\r\n\x1a\n"
    + chunk(b"IHDR", struct.pack(">IIBBBBB", W, H, 8, 6, 0, 0, 0))
    + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
    + chunk(b"IEND", b"")
)

out_dir = os.path.join(os.path.dirname(__file__), "..", "build")
os.makedirs(out_dir, exist_ok=True)
out = os.path.join(out_dir, "icon.png")
with open(out, "wb") as f:
    f.write(png)
print("wrote", os.path.normpath(out), len(png), "bytes")
