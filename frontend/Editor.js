import React from "react";
import { globalConfig } from "@airtable/blocks";
import { Box, Heading } from "@airtable/blocks/ui";
import InputController from "./InputController";

function Editor(props) {
  const { setSkin } = props;
  const generateTab = (generateOnChange, tabName, controls, index) => {
    // tab is an object straight out of widget skinMeta
    return (
      <Box key={parseInt(index)}>
        {Object.keys(controls).map((control, index2) =>
          generateControl(generateOnChange, control, controls[control], index2)
        )}
      </Box>
    );
  };

  const generateOnChange = (property) => {
    const updateSkin = (newVal) => {
      const currentSkin = globalConfig.get("skin");
      currentSkin[property] = newVal;
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
    const currentValue = values[propertyName];
    return (
      <InputController
        key={String(index)}
        onChangeFn={onChange}
        control={control}
        controlOptions={controlOptions.options}
        currentValue={currentValue}
      />
    );
  };

  const { skinMeta, visible } = props;
  const { tabs } = skinMeta;

  const EditorFrame = (
    <Box
      width="325px"
      height="100%"
      display={visible ? "block" : "none"}
      backgroundColor="rgb(250, 250, 250)"
      overflowY="auto"
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        padding="1rem"
      >
        <Heading width="100%">Emoji Poll settings</Heading>
        {Object.keys(tabs).map((tab, index) =>
          generateTab(generateOnChange, tab, tabs[tab], index)
        )}
      </Box>
    </Box>
  );

  return EditorFrame;
}
export default Editor;
