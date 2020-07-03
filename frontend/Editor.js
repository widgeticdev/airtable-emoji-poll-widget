import React from "react";
import { globalConfig } from "@airtable/blocks";
import { Box, Heading, Button } from "@airtable/blocks/ui";
import InputController from "./InputController";

function Editor(props) {
  const { setSkin } = props;
  const generateTab = (generateOnChange, tabs, tabName, controls, index) => {
    let noTabs = Object.keys(tabs).length;
    const separator =
      index < noTabs - 1 ? (
        <Box
          width="100%"
          border="thick"
          borderRadius="none"
          borderWidth="1px"
          marginBottom=".5rem"
        ></Box>
      ) : (
        <></>
      );
    // console.log("generateTab:", index, noTabs, separator);
    // tab is an object straight out of widget skinMeta
    return (
      <Box key={parseInt(index)} width="100%">
        {Object.keys(controls).map((control, index2) =>
          generateControl(generateOnChange, control, controls[control], index2)
        )}
        {separator}
      </Box>
    );
  };

  const generateOnChange = (property) => {
    const updateSkin = (newVal) => {
      const currentSkin = globalConfig.get("skin");
      console.log("generateOnChange", currentSkin);
      if (property == "textFont")
        currentSkin[property] = {
          size: newVal,
          family:
            "-apple-system,system-ui,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'",
          style: "500",
        };
      else currentSkin[property] = newVal;
      setSkin(currentSkin);
      globalConfig.setAsync("skin", currentSkin);
    };
    return updateSkin;
  };

  const generateControl = (
    generateOnChange,
    propertyName,
    controlOptions,
    index
  ) => {
    const control = controlOptions.control.split("/")[2];
    const onChange = generateOnChange(propertyName);
    const values = globalConfig.get("skin");
    const currentValue =
      control == "font" ? values[propertyName].size : values[propertyName];
    // console.log("Controller:", controlOptions);
    const options = controlOptions.options;
    // if (control == "font") options.options = options.size;
    return (
      <InputController
        key={String(index)}
        onChangeFn={onChange}
        control={control}
        controlOptions={options}
        currentValue={currentValue}
      />
    );
  };

  const { skinMeta, visible } = props;
  const { tabs } = skinMeta;

  const EditorFrame = (
    <Box
      width="324px"
      height="100%"
      display={visible ? "flex" : "none"}
      flexDirection="column"
      justifyContent="space-between"
      overflow="hidden"
      border="default"
      borderRadius="none"
      borderTop="none"
      borderBottom="none"
      borderRight="none"
      backgroundColor="rgb(250, 250, 250)"
    >
      <Heading width="100%" padding="1rem">
        Emoji poll settings
      </Heading>
      <Box overflowY="auto" paddingLeft="1rem" paddingRight="1rem">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          {Object.keys(tabs).map((tab, index) =>
            generateTab(generateOnChange, tabs, tab, tabs[tab], index)
          )}
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-end"
        paddingLeft="1rem"
        paddingRight="1rem"
        paddingBottom=".5rem"
        marginTop="auto"
      >
        <Box
          width="100%"
          border="thick"
          borderRadius="none"
          borderWidth="1px"
          marginBottom=".5rem"
        ></Box>
        <Button variant="primary" onClick={() => console.log("Button clicked")}>
          Done
        </Button>
      </Box>
    </Box>
  );

  return EditorFrame;
}
export default Editor;
