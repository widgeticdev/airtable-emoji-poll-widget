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
    case "color": {
      const ColorPicker = () => {
        const [color, setColor] = useState(hexColors[String(currentValue)]);
        return (
          <ColorPalette
            color={color}
            allowedColors={Object.keys(allowedColors).map((col) => colors[col])}
            onChange={(newVal) => {
              onChangeFn(colorUtils.getHexForColor(newVal));
              return setColor(newVal);
            }}
          />
        );
      };
      return (
        <Box marginTop="1rem">
          <Label style={{ marginBottom: ".25rem" }}>
            {capitalizeFirstLetter(controlOptions.label.toLowerCase())}
          </Label>

          <Tooltip
            content={controlOptions.help_text}
            placementX={Tooltip.placements.LEFT}
            placementY={Tooltip.placements.CENTER}
          >
            <Box>
              <ColorPicker />
            </Box>
          </Tooltip>
        </Box>
      );
    }
    case "dropdown": {
      const MySelectButtons = () => {
        const [value, setValue] = useState(currentValue);
        return (
          <SelectButtons
            value={value}
            onChange={(newVal) => {
              onChangeFn(newVal);
              return setValue(newVal);
            }}
            options={controlOptions.options}
            size="large"
          />
        );
      };
      return (
        <Box marginTop="1rem">
          <Label style={{ marginBottom: ".25rem" }}>
            {capitalizeFirstLetter(controlOptions.label.toLowerCase())}
          </Label>
          <Tooltip
            content={controlOptions.help_text}
            placementX={Tooltip.placements.LEFT}
            placementY={Tooltip.placements.CENTER}
          >
            <Box>
              <MySelectButtons />
            </Box>
          </Tooltip>
        </Box>
      );
    }
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
    case "stepper": {
      const NumberInput = () => {
        const [value, setValue] = useState(currentValue);
        return (
          <input
            style={{ width: "100%" }}
            value={parseInt(value)}
            type="number"
            min={0}
            max={100}
            step={1}
            onChange={(e) => {
              onChangeFn(parseInt(e.target.value));
              return setValue(parseInt(event.target.value));
            }}
          />
        );
      };
      return (
        <Box marginTop="1rem">
          <Label style={{ marginBottom: ".25rem" }}>
            {capitalizeFirstLetter(controlOptions.label.toLowerCase())}
          </Label>
          <Tooltip
            content={controlOptions.help_text}
            placementX={Tooltip.placements.LEFT}
            placementY={Tooltip.placements.CENTER}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <NumberInput />
              &nbsp;
              <span>{controlOptions.unit}</span>
            </div>
          </Tooltip>
        </Box>
      );
    }
    case "text":
      return <></>;
    case "textarea":
      return <></>;
    case "toggle": {
      const MySwitch = () => {
        const [isEnabled, setIsEnabled] = useState(currentValue);
        return (
          <Switch
            value={isEnabled}
            onChange={(newVal) => {
              onChangeFn(newVal);
              return setIsEnabled(newVal);
            }}
          />
        );
      };
      return (
        <Box marginTop="1rem">
          <Label style={{ marginBottom: ".25rem" }}>
            {capitalizeFirstLetter(controlOptions.label.toLowerCase())}
          </Label>
          <Tooltip
            content={controlOptions.help_text}
            placementX={Tooltip.placements.LEFT}
            placementY={Tooltip.placements.CENTER}
          >
            <Box>
              <MySwitch />
            </Box>
          </Tooltip>
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
