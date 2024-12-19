import React from "react"

const SearchInput = ({ searchTerm, onSearchTermChange,placeholder }) => {
  return (
    <span className="has-wrapperss">
      <span className="left_icon_1">
        <i className="ti-search"></i>
      </span>
      <input
        className="input_default_1"
        placeholder={placeholder}
        type="text"
        name="searchTerm"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
      />
    </span>
  )
}

export default SearchInput