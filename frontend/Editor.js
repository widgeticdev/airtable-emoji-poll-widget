import React from "react";
import { globalConfig } from "@airtable/blocks";
import { Box, Heading } from "@airtable/blocks/ui";
import mapping from "./translator";

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      skin: {},
    };
  }

  generateTab(generateOnChange, tabName, controls, index) {
    // tab is an object straight out of widget skinMeta
    return (
      <Box key={String(index)} padding="1rem">
        <Heading>{tabName}</Heading>
        {Object.keys(controls).map((control, index2) =>
          this.generateControl(
            generateOnChange,
            control,
            controls[control],
            index2
          )
        )}
      </Box>
    );
  }

  generateOnChange(property) {
    const w = window.Widgetic;
    w.auth.token(globalConfig.get("token"));
    const updateSkin = (newVal) => {
      const presetSkinRegex = /^p[1-9]{1}_/;
      const currentSkin = this.state.skin;
      const skinId = currentSkin.id;
      currentSkin[property] = newVal;
      if (presetSkinRegex.test(skinId)) {
        w.api("skins", "POST", JSON.stringify(currentSkin)).then((skin) => {
          globalConfig.setAsync("skinId", skin.id);
          this.setState({ skin });
        });
      } else {
        w.api(`skins/${skinId}`, "PUT", JSON.stringify(currentSkin)).then(
          (skin) => {
            this.setState({ skin });
          }
        );
      }
    };
    return updateSkin;
  }

  generateControl(generateOnChange, propertyName, controlOptions, index) {
    const control = controlOptions.control.split("/")[2];
    const onChange = generateOnChange(propertyName);
    const values = this.state.skin;
    const controlValues = values[control];
    const InputController = mapping(
      onChange,
      control,
      controlOptions.options,
      controlValues,
      index
    );
    return InputController;
  }

  render() {
    const { skinMeta, visible } = this.props;
    const { tabs } = skinMeta;

    const EditorFrame = (
      <Box
        width="324px"
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
        >
          {Object.keys(tabs).map((tab, index) =>
            this.generateTab(
              this.generateOnChange.bind(this),
              tab,
              tabs[tab],
              index
            )
          )}
        </Box>
      </Box>
    );

    return EditorFrame;
  }
}
export default Editor;
