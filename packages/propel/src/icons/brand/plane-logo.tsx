/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import * as React from "react";

import type { ISvgIcons } from "../type";

const IMT_SYMBOL_RATIO = 330 / 250;
const IMT_LOGO_SCALE = 1.2;

const resolveWidthFromHeight = (height: React.SVGAttributes<SVGElement>["height"]) => {
  if (typeof height === "number") return height * IMT_SYMBOL_RATIO;
  if (typeof height === "string") {
    const parsedHeight = Number.parseFloat(height);
    if (Number.isFinite(parsedHeight)) return parsedHeight * IMT_SYMBOL_RATIO;
  }
  return undefined;
};

export function PlaneLogo({ width, height = 40, className, ...rest }: ISvgIcons) {
  const resolvedWidth = width ?? resolveWidthFromHeight(height);
  const style = rest.style as React.CSSProperties | undefined;
  const scaledStyle: React.CSSProperties = {
    ...style,
    transform: `${style?.transform ? `${style.transform} ` : ""}scale(${IMT_LOGO_SCALE})`,
    transformOrigin: style?.transformOrigin ?? "center",
  };

  return (
    <svg
      width={resolvedWidth}
      height={height}
      viewBox="0 0 330 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="IMT logo"
      {...rest}
      style={scaledStyle}
    >
      <g fill="currentColor" transform="translate(-287 -360)">
        <path d="M428.667 410H385.333C380.731 410 377 414.433 377 419.901V600.099C377 605.567 380.731 610 385.333 610H428.667C433.269 610 437 605.567 437 600.099V419.901C437 414.433 433.269 410 428.667 410Z" />
        <path d="M518.667 360H475.333C470.731 360 467 364.433 467 369.901V550.099C467 555.567 470.731 560 475.333 560H518.667C523.269 560 527 555.567 527 550.099V369.901C527 364.433 523.269 360 518.667 360Z" />
        <path d="M603.452 430H570.548C563.066 430 557 436.066 557 443.548V476.452C557 483.934 563.066 490 570.548 490H603.452C610.934 490 617 483.934 617 476.452V443.548C617 436.066 610.934 430 603.452 430Z" />
        <path d="M333.452 490H300.548C293.066 490 287 496.066 287 503.548V536.452C287 543.934 293.066 550 300.548 550H333.452C340.934 550 347 543.934 347 536.452V503.548C347 496.066 340.934 490 333.452 490Z" />
      </g>
    </svg>
  );
}
