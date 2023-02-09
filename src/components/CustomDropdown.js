import React, { useEffect } from "react";

function CustomDropdown({
  datas,
  onSelectValueChangeHandler,
  styling,
  setInitProjectId = null,
  defaultValue = "",
}) {
  useEffect(() => {
    if (datas && datas.length > 0) {
      setInitProjectId(datas[0]._id);
    }
  }, [datas]);

  return (
    <select
      id="countries"
      defaultValue={defaultValue}
      className={`${styling} bg-slate-600 border border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
      onChange={(e) => onSelectValueChangeHandler(e)}
    >
      {/* <option value="default">Choose a project</option> */}
      {datas.map((item, key) => {
        return (
          <option value={item.value} key={key}>
            {item.name}
          </option>
        );
      })}
    </select>
  );
}

export default CustomDropdown;
