import React from "react";
import { globalConfig } from "@airtable/blocks";
import { Box, Heading, useGlobalConfig } from "@airtable/blocks/ui";
import mapping from "./translator";

function Editor(props) {
  const generateTab = (generateOnChange, tabName, controls, index) => {
    // tab is an object straight out of widget skinMeta
    return (
      <Box key={parseInt(index)} paddingLeft='1rem' paddingRight='1rem'>
        {Object.keys(controls).map((control, index2) =>
          generateControl(generateOnChange, control, controls[control], index2)
        )}
      </Box>
    );
  };
  const globalConfigSyn = useGlobalConfig();

  const generateOnChange = (property) => {
    const updateSkin = (newVal) => {
      const currentSkin = globalConfigSyn.get("skin");
      currentSkin[property] = newVal;
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
    const controlValues = values[control];
    const InputController = mapping(
      onChange,
      control,
      controlOptions.options,
      controlValues,
      index
    );
    return InputController;
  };

  const { skinMeta, visible } = props;
  const { tabs } = skinMeta;

  const EditorFrame = (
    <Box
      width="324px"
      height="100%"
      display={visible ? "block" : "none"}
      backgroundColor="rgb(250, 250, 250)"
      overflowY="auto"
        paddingBottom='1rem'
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {Object.keys(tabs).map((tab, index) =>
          generateTab(generateOnChange, tab, tabs[tab], index)
        )}
      </Box>
    </Box>
  );

  return EditorFrame;
}
export default Editor;
