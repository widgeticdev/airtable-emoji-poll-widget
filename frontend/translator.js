import {
  Box,
  Button,
  Tooltip,
  ColorPalette,
  Input,
  Select,
  Text,
  Switch,
  TextButton,
  Link,
  Label,
  colors,
  colorUtils,
} from "@airtable/blocks/ui";
import React from "react";
import allowedColors from "./allowedColors";

const mapping = (onChangeFn, control, controlOptions, currentValue, index) => {
  switch (control) {
    case "date-time":
      return <></>;
    case "font":
      return <></>;
    case "position":
      return "";
    case "audio":
      return "";
    case "browser":
      return "";
    case "color":
      return (
        <Box marginTop="1rem">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom=".25rem"
          >
            <Label style={{ marginBottom: "0px" }}>
              {controlOptions.label}
            </Label>
            <Tooltip
              content={controlOptions.help_text}
              placementX={Tooltip.placements.LEFT}
              placementY={Tooltip.placements.CENTER}
            >
              <Button icon="info" aria-label="info" />
            </Tooltip>
          </Box>

          <ColorPalette
            key={String(index)}
            color={currentValue}
            allowedColors={Object.keys(allowedColors).map(
              (color) => colors[color]
            )}
            onChange={(newVal) => {
              onChangeFn(colorUtils.getHexForColor(newVal));
            }}
          />
        </Box>
      );
    case "dropdown":
      return (
        <Box marginTop="1rem">
          <Label>{controlOptions.label}</Label>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom=".25rem"
          >
            <Label style={{ marginBottom: "0px" }}>
              {controlOptions.label}
            </Label>
            <Tooltip
              content={controlOptions.help_text}
              placementX={Tooltip.placements.LEFT}
              placementY={Tooltip.placements.CENTER}
            >
              <Button icon="info" aria-label="info" />
            </Tooltip>
          </Box>

          <Select
            key={String(index)}
            value={controlOptions.default}
            options={controlOptions.options}
            onChange={(newVal) => {
              onChangeFn(newVal);
            }}
          />
        </Box>
      );
    case "image":
      return "";
    case "orderPicker":
      return "";
    case "rss":
      return <></>;
    case "scale":
      return "";
    case "range":
    case "slider":
    case "stepper":
      return (
        <Box marginTop="1rem">
          <Label>{controlOptions.label}</Label>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom=".25rem"
          >
            <Label style={{ marginBottom: "0px" }}>
              {controlOptions.label}
            </Label>
            <Tooltip
              content={controlOptions.help_text}
              placementX={Tooltip.placements.LEFT}
              placementY={Tooltip.placements.CENTER}
            >
              <Button icon="info" aria-label="info" />
            </Tooltip>
          </Box>

          <div style={{ display: "flex", alignItems: "center" }}>
            <Input
              key={String(index)}
              value={controlOptions.default}
              type="number"
              min={0}
              max={100}
              step={1}
              onChange={(e) => {
                onChangeFn(e.target.value);
              }}
            />
            &nbsp;
            <span>{controlOptions.unit}</span>
          </div>
        </Box>
      );
    case "text":
      return <></>;
    case "textarea":
      return <></>;
    case "toggle":
      return (
        <Box marginTop="1rem">
          <Label>{controlOptions.label}</Label>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom=".25rem"
          >
            <Label style={{ marginBottom: "0px" }}>
              {controlOptions.label}
            </Label>
            <Tooltip
              content={controlOptions.help_text}
              placementX={Tooltip.placements.LEFT}
              placementY={Tooltip.placements.CENTER}
            >
              <Button icon="info" aria-label="info" />
            </Tooltip>
          </Box>

          <Switch
            key={String(index)}
            value={controlOptions.default}
            onChange={(newVal) => {
              onChangeFn(newVal);
            }}
          />
        </Box>
      );
    case "url":
      return <></>;
    case "video":
      return "";
  }
};

export default mapping;
