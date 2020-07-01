import {
  Box,
  Button,
  Tooltip,
  ColorPalette,
  SelectButtons,
  Switch,
  Label,
  colors,
  colorUtils,
} from "@airtable/blocks/ui";
import React, { useState } from "react";
import allowedColors from "./allowedColors";
import hexColors from "./hexColors";

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* props has
  onChangeFn, control, controlOptions, currentValue, index
  */
const InputController = (props) => {
  console.log("hexColors[String(currentValue)]", hexColors);
  const { control, controlOptions, onChangeFn, currentValue } = props;
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
              {capitalizeFirstLetter(controlOptions.label.toLowerCase())}
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
            color={hexColors[String(currentValue)]}
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom=".25rem"
          >
            <Label style={{ marginBottom: "0px" }}>
              {capitalizeFirstLetter(controlOptions.label.toLowerCase())}
            </Label>
            <Tooltip
              content={controlOptions.help_text}
              placementX={Tooltip.placements.LEFT}
              placementY={Tooltip.placements.CENTER}
            >
              <Button icon="info" aria-label="info" />
            </Tooltip>
          </Box>

          <SelectButtons
            value={currentValue}
            onChange={(newVal) => onChangeFn(newVal)}
            options={controlOptions.options}
            size="large"
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom=".25rem"
          >
            <Label style={{ marginBottom: "0px" }}>
              {capitalizeFirstLetter(controlOptions.label.toLowerCase())}
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
            <input
              value={parseInt(currentValue)}
              type="number"
              min={0}
              max={100}
              step={1}
              onChange={(e) => {
                onChangeFn(parseInt(e.target.value));
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
    case "toggle": {
      const MySwitch = () => {
        const [isEnabled, setIsEnabled] = useState(currentValue);
        const myChangeFn = (newVal) => {
          onChangeFn(newVal);
          return setIsEnabled(newVal);
        };
        return (
          <Switch
            value={isEnabled}
            onChange={(newVal) => {
              onChangeFn(newVal);
              console.log("hello world");
              return setIsEnabled(newVal);
            }}
          />
        );
      };
      return (
        <Box marginTop="1rem">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom=".25rem"
          >
            <Label style={{ marginBottom: "0px" }}>
              {capitalizeFirstLetter(controlOptions.label.toLowerCase())}
            </Label>
            <Tooltip
              content={controlOptions.help_text}
              placementX={Tooltip.placements.LEFT}
              placementY={Tooltip.placements.CENTER}
            >
              <Button icon="info" aria-label="info" />
            </Tooltip>
          </Box>
          <MySwitch />
        </Box>
      );
    }
    case "url":
      return <></>;
    case "video":
      return "";
  }
};

export default InputController;
