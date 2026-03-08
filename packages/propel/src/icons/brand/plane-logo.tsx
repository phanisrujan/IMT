/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import * as React from "react";

import type { ISvgIcons } from "../type";

export function PlaneLogo({ width = "85", height = "52", className, color = "currentColor" }: ISvgIcons) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 85 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="IMT"
    >
      <rect x="1.5" y="1.5" width="82" height="49" rx="8" stroke={color} strokeWidth="2" />
      <text
        x="42.5"
        y="33"
        textAnchor="middle"
        fill={color}
        fontFamily="Inter, sans-serif"
        fontSize="20"
        fontWeight="700"
        letterSpacing="0.08em"
      >
        IMT
      </text>
    </svg>
  );
}
