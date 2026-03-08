/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import * as React from "react";

import type { ISvgIcons } from "../type";

export function PlaneLockup({ width = "253", height = "53", className, color = "currentColor" }: ISvgIcons) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 253 53"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="IMT"
    >
      <rect x="1" y="1" width="251" height="51" rx="10" stroke={color} strokeWidth="2" />
      <text
        x="126.5"
        y="35"
        textAnchor="middle"
        fill={color}
        fontFamily="Inter, sans-serif"
        fontSize="26"
        fontWeight="700"
        letterSpacing="0.1em"
      >
        IMT
      </text>
    </svg>
  );
}
