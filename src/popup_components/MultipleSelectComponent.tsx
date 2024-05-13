import React from "react";
import Select, { GroupBase, Props, StylesConfig } from "react-select";

/**
 * Helps with types
 * @param param0 
 * @returns 
 */
function SelectInput<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  ...props
}: Props<Option, IsMulti, Group>) {

  return <Select<Option, IsMulti, Group>
          {...props}
        />;
}

export default SelectInput;